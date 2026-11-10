"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

/** What the toggle records, and what both halves below read back. */
const KEY = "theme";

/**
 * The theme the reader picked, or `null` for one they left to the system — which
 * is the absence of the attribute, not a third value to write.
 */
function storedTheme(): string | null {
  try {
    const theme = localStorage.getItem(KEY);
    return theme === "light" || theme === "dark" ? theme : null;
  } catch {
    return null;
  }
}

/**
 * `useLayoutEffect` warns when it runs on the server, where there is nothing to
 * lay out; the no-op stands in for it on that pass. In the browser this is the
 * real thing, and it is the point: the theme has to be back before the paint.
 */
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The reader's stored theme, put back on <html> before the first paint.
 *
 * A plain <script> in the layout is the obvious way to do this, and it is what
 * this used to be — but React 19 will not run a script element it creates
 * itself. Any render that happens in the browser rather than in the server's
 * HTML — a client-side navigation, or a page whose document arrives as a bare
 * shell — gets the element swapped for a <div>, along with a console warning,
 * and the theme would then come back only after the wrong one had been painted.
 *
 * `useServerInsertedHTML` keeps the element out of that path: the callback runs
 * only while the server is writing the document, and what it returns goes into
 * the stream ahead of the content it applies to. In the browser the hook does
 * nothing and this component renders nothing, so there is no script tag for
 * React to object to — and the one in the HTML still runs, because the parser
 * finds it there.
 *
 * Which leaves the one navigation that rebuilds the document after the fact: a
 * switch of language is rendered from `<html>` down, and the attribute written
 * by that script goes with the old root. Nothing on the far side runs the script
 * again, so the theme is applied a second time here — in a layout effect, before
 * the paint, rather than in an effect that would let the system's colours show
 * for a frame first.
 */
export function ThemeScript() {
  // The server asks for inserted HTML more than once while it writes a
  // document, and every ask re-registers this callback; handing the script over
  // once per mounted component keeps it from being written out on each of them.
  // A ref, not state: this is a flag the renderer writes to, never something
  // the UI reads, so changing it must not schedule a render.
  const handedOver = useRef(false);

  useServerInsertedHTML(() => {
    if (handedOver.current) return null;
    handedOver.current = true;

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
        }}
      />
    );
  });

  // Runs on mount, which is every page load — the script has usually done this
  // already, so the write is a no-op — and after the document is rebuilt by a
  // switch of language, where it is the only thing that puts the theme back.
  useBeforePaint(() => {
    const theme = storedTheme();
    if (theme) document.documentElement.dataset.theme = theme;
  }, []);

  return null;
}
