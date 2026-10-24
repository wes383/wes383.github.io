"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

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
          __html:
            'try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}',
        }}
      />
    );
  });

  return null;
}
