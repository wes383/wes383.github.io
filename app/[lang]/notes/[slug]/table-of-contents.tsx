"use client";

import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { NoteHeading } from "@/lib/notes";
import { linkClass } from "@/lib/ui";

/** Shortest the bar may get, so a very long contents stays draggable. */
const MIN_BAR = 24;

/** Mirrors `xl`, the width at which the contents moves beside the text. */
const BESIDE_THE_TEXT = "(min-width: 1280px)";

/**
 * A note's contents. Collapsible because a long note can list a dozen sections,
 * and the toggle is a plain text button like every other control on the site.
 *
 * Whether it starts open depends on where it sits: beside the text on a wide
 * screen there is room for it, in the flow above the note on a narrow one there
 * is not. The breakpoint isn't known while the page is being prerendered, so the
 * initial state is left undecided and the markup carries both answers — the CSS
 * hides the list below `xl` until the effect below settles the matter.
 *
 * From `xl` the column is capped to the viewport and scrolls on its own, so a
 * long contents never runs past the bottom of the screen. Its native scrollbar
 * is hidden and replaced by the bar below: a hairline that fades in with the
 * column, takes up no width, and can be dragged. It is held outside the box
 * rather than on its edge, because the links' `-mx-2` carries their hover
 * background all the way out — a bar at the edge would sit on top of it.
 */
export function TableOfContents({
  headings,
  label,
}: {
  headings: NoteHeading[];
  label: string;
}) {
  // `null` until the reader (or the effect) decides.
  const [open, setOpen] = useState<boolean | null>(null);
  const expanded = open !== false;
  const [bar, setBar] = useState<{
    height: number;
    offset: number;
    atStart: boolean;
    atEnd: boolean;
  } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ from: number; scrollTop: number } | null>(null);

  useEffect(() => {
    setOpen(window.matchMedia(BESIDE_THE_TEXT).matches);
  }, []);

  const measure = useCallback(() => {
    const element = scroller.current;
    if (!element) return;

    const { clientHeight, scrollHeight, scrollTop } = element;
    if (scrollHeight <= clientHeight) {
      setBar(null);
      return;
    }

    const height = Math.max(
      MIN_BAR,
      (clientHeight / scrollHeight) * clientHeight,
    );
    const travel = clientHeight - height;
    const furthest = scrollHeight - clientHeight;

    setBar({
      height,
      offset: (scrollTop / furthest) * travel,
      atStart: scrollTop <= 1,
      atEnd: scrollTop >= furthest - 1,
    });
  }, []);

  useEffect(() => {
    const element = scroller.current;
    if (!element) return;

    measure();
    element.addEventListener("scroll", measure, { passive: true });

    // The list's height changes when the toggle opens or closes, and the
    // column's height follows the viewport, so watch the box and its contents.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of Array.from(element.children)) observer.observe(child);

    return () => {
      element.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure, open]);

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const element = scroller.current;
    if (!element) return;

    drag.current = { from: event.clientY, scrollTop: element.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const element = scroller.current;
    const origin = drag.current;
    if (!element || !origin) return;

    // The bar covers `clientHeight / scrollHeight` of the track, so the content
    // has to move by the inverse of that for the bar to track the pointer.
    element.scrollTop =
      origin.scrollTop +
      (event.clientY - origin.from) *
        (element.scrollHeight / element.clientHeight);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="group xl:sticky xl:top-14">
      {/* The links carry `-mx-2`, so the box that clips them has to be 8px wider
          on each side than the column, or their hover background is cut off at
          the edge. `-mx-2` on this wrapper and `px-2` inside cancel out, so the
          text sits exactly where it did. */}
      <div className="relative -mx-2">
        <div
          ref={scroller}
          className="px-2 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:overscroll-contain xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="contents"
            onClick={() => setOpen(!expanded)}
            className={linkClass}
          >
            {label}
            <ChevronDown
              aria-hidden="true"
              className={[
                "ml-1 h-3.5 w-3.5 transition-transform",
                expanded ? "rotate-0" : "-rotate-90",
              ].join(" ")}
            />
          </button>

          {/* Undecided: hide below `xl`, show at it. Decided: the class alone. */}
          <ul
            id="contents"
            className={[
              "mt-2 space-y-1",
              open === null ? "hidden xl:block" : !open && "hidden",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {headings.map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} className={linkClass}>
                  {heading.text}
                </a>
                {heading.children.length > 0 ? (
                  <ul className="mt-1 space-y-1 pl-4">
                    {heading.children.map((child) => (
                      <li key={child.id}>
                        <a href={`#${child.id}`} className={linkClass}>
                          {child.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {bar && !bar.atStart ? (
          // Same softening at the top edge, dropped once the list is scrolled
          // back to its first entry.
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-10 [background-image:linear-gradient(to_bottom,var(--background),transparent)]"
          />
        ) : null}

        {bar && !bar.atEnd ? (
          // Softens the line where the capped column cuts the list off. It goes
          // once the list is scrolled to the end, so nothing is masked then.
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 [background-image:linear-gradient(to_top,var(--background),transparent)]"
          />
        ) : null}

        {bar ? (
          <div
            aria-hidden="true"
            onPointerDown={startDrag}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{
              height: bar.height,
              transform: `translateY(${bar.offset}px)`,
            }}
            className="absolute top-0 -right-2 w-1 touch-none rounded-full bg-foreground-muted/20 opacity-0 transition-opacity group-hover:opacity-100"
          />
        ) : null}
      </div>
    </div>
  );
}
