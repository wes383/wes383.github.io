/**
 * Shared link styling. Every link and button in the site is borderless,
 * backgroundless plain text — only a very subtle hover background is used
 * to signal interactivity.
 *
 * `-mx-2` cancels the `px-2` padding, so the label itself lines up flush with
 * the surrounding text while the hover background still extends past it.
 *
 * The radius is capped so that it always stays below half of the element's
 * height: a radius equal to half the height turns the hover background into a
 * pill (this happens to `linkClass` from `rounded-xl` upward, since these links
 * are only 24px tall).
 */
export const linkClass =
  "inline-flex items-center rounded-lg -mx-2 px-2 py-1 text-xs font-medium text-foreground-muted transition-colors hover:bg-hover-bg hover:text-foreground";

/** Same treatment, scaled up for links that carry a title (32px tall). */
export const titleLinkClass =
  "inline-flex items-center rounded-xl -mx-2 px-2 py-1 text-base font-medium text-foreground transition-colors hover:bg-hover-bg";

/**
 * Inline links sitting inside running text. They can't take the padded, rounded
 * treatment above without breaking the sentence mid-flow, so they carry a
 * subtle underline instead — still borderless and backgroundless.
 */
export const proseLinkClass =
  "text-foreground underline decoration-foreground-muted/40 decoration-1 underline-offset-4 transition-colors hover:decoration-foreground";