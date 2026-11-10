/**
 * How long the page is given to dim before the navigation is allowed to run.
 * Kept equal to `--dur-fast` in `globals.css`, which is the duration the fade
 * itself uses — the route must not change under a half-dimmed page.
 */
export const LEAVING = 120;

/**
 * Dims the page before a switch of language, and returns how long the caller
 * should wait before changing the route — the fade gets to play before the page
 * is rebuilt under it. The class goes on the root because the root is the last
 * thing left standing: the switch then rebuilds the page from `<html>` down, and
 * the new one arrives on its own animation — the one thing a freshly built
 * element can do, where an element with no past cannot transition. See `main` in
 * `globals.css` for both halves.
 *
 * Nothing is dimmed, and nothing is waited for, when the reader has asked for
 * less motion: a page that went blank and came back with no fade between would
 * be worse than no animation at all.
 */
export function beginLanguageFade(): number {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;

  const root = document.documentElement;
  root.classList.add("leaving-language");

  // A navigation that never lands — a dropped payload, an offline reader, a
  // route that 404s — must not leave the page blank. Nothing else removes the
  // class in that case, so this does.
  window.setTimeout(() => root.classList.remove("leaving-language"), 900);

  return LEAVING;
}
