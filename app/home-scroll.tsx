"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Where the reader had got to in the list, remembered per language.
 *
 * The list is longer than a screen, and a reader who opened the seventh note
 * expects to come back to the seventh note. The router will not do it: a click
 * on "back" is a new navigation rather than a history move, so it scrolls the
 * new page's first node into view — which lands on the heading, not where the
 * reader was. `experimental.scrollRestoration` covers the other case, the
 * browser's own back button, and is left off for that reason.
 *
 * The links that lead here ask the router not to scroll at all (`scroll={false}`),
 * so the write below is the only one; if both ran, the router's would land after
 * this one — effects run from the child up — and put the page back at the top.
 *
 * The position is written once, at the click that leaves, and not as the page
 * scrolls. Next keeps this page mounted — hidden — while a note is open, so a
 * listener would still be running while the document scrolled under the note,
 * and would record the note's position as the list's; and the one moment the
 * reader's own position is unambiguously on screen is the moment they leave.
 */

const key = (pathname: string) => `list-scroll:${pathname}`;

/**
 * `useLayoutEffect` warns when it runs on the server, where there is nothing to
 * lay out; the no-op stands in for it on that pass, and this has to run before
 * the paint or the list would be seen at the top and then jump.
 */
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function HomeScroll() {
  const pathname = usePathname();

  // The list's own address, taken at mount: the page outlives a visit to a note,
  // and while that note is open this component is still here, hidden, being told
  // about a pathname that is not its own.
  const own = useRef(pathname);

  useBeforePaint(() => {
    if (pathname !== own.current) return;

    let saved: number | null = null;
    try {
      const stored = sessionStorage.getItem(key(pathname));
      saved = stored === null ? null : Number(stored);
    } catch {}

    // Nothing remembered, and the page is a reload: the browser is already
    // putting the reader back where they were, out of its own history entry, and
    // there is nothing here to remember because nothing has been clicked. Zero
    // would undo it.
    const [navigation] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    if (saved === null && navigation?.type === "reload") return;

    // Otherwise zero is the right answer even with nothing remembered: a reader
    // arriving from a note that was opened from a link elsewhere should start at
    // the top, not wherever that note was left.
    window.scrollTo(0, saved !== null && Number.isFinite(saved) ? saved : 0);
  }, [pathname]);

  // A click on a way out is the last frame in which this page's own position is
  // still the reader's: the document is thrown to wherever the next page wants
  // it immediately after, and none of that is theirs to remember.
  useEffect(() => {
    const leave = (event: MouseEvent) => {
      if (pathname !== own.current) return;

      const target = event.target as Element | null;
      const link = target?.closest("a[href]");
      // Only links that lead somewhere else in the site. An anchor that stays
      // put — a `mailto:`, a `#` — says nothing about leaving the list.
      if (!link || !link.getAttribute("href")?.startsWith("/")) return;

      try {
        sessionStorage.setItem(
          key(own.current),
          String(Math.round(window.scrollY)),
        );
      } catch {}
    };

    document.addEventListener("click", leave, true);
    return () => document.removeEventListener("click", leave, true);
  }, [pathname]);

  return null;
}
