"use client";

import { type ReactNode, useEffect, useState } from "react";

/**
 * The links at the foot of a note: back home, back to the top. They only make
 * sense once there is something to come back from, so the whole row waits
 * until the page actually overflows the viewport — a note short enough to fit
 * in one screenful gets no foot at all.
 *
 * The answer can change after the first paint: images arrive and push the page
 * past one screenful, or a phone rotates and the viewport grows to fit it all.
 * So the document element is watched with an observer, which catches both the
 * page growing and a short page tracking the viewport, and the window's own
 * resize is listened to for the case the document's box doesn't report — a
 * long page whose viewport shrank changes neither, yet may stop scrolling.
 *
 * Until then the row is simply not there, and on a short page it never is.
 */
export function NoteFoot({ children }: { children: ReactNode }) {
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const check = () =>
      setScrolls(document.documentElement.scrollHeight > window.innerHeight);

    check();

    const observer = new ResizeObserver(check);
    observer.observe(document.documentElement);
    window.addEventListener("resize", check);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  if (!scrolls) return null;

  return <div className="mt-16 flex items-center gap-6">{children}</div>;
}
