import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { proseLinkClass } from "@/lib/ui";

/**
 * Typography for everything that comes out of an MDX file. It leans on spacing,
 * weight and colour rather than decoration. The one exception is the table grid
 * below: a column of figures is read as a column only if something divides the
 * rows, so the lines are drawn as faintly as they can be and still be seen.
 */
export const components = {
  // Every heading forwards its remaining props: `rehype-slug` puts the `id` the
  // table of contents links to on each one, and the footnote section's heading
  // carries an `id` its references point at via `aria-describedby`.
  h1: ({ children, className, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className={[
        "mt-12 mb-4 text-xl font-semibold tracking-tight text-balance first:mt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className={[
        "mt-12 mb-3 text-base font-semibold tracking-tight first:mt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className={["mt-8 mb-2 text-sm font-semibold first:mt-0", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, className, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className={["mt-6 mb-2 text-sm font-medium first:mt-0", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h4>
  ),
  // Preflight resets every heading to `font-size: inherit; font-weight: inherit`,
  // so h5/h6 need explicit styles or they render as plain body text.
  h5: ({ children, className, ...props }: ComponentPropsWithoutRef<"h5">) => (
    <h5
      className={["mt-6 mb-2 text-xs font-semibold first:mt-0", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, className, ...props }: ComponentPropsWithoutRef<"h6">) => (
    <h6
      className={[
        "mt-6 mb-2 text-xs font-medium text-foreground-muted first:mt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h6>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-4 text-sm leading-7 text-foreground/90">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-4 list-disc space-y-1.5 pl-5 text-sm leading-7 text-foreground/90 marker:text-foreground-muted">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-5 text-sm leading-7 text-foreground/90 marker:text-foreground-muted">
      {children}
    </ol>
  ),
  // A footnote definition carries the `id` its reference links to.
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li {...props}>{children}</li>
  ),
  // Props beyond `href` matter: GFM footnotes put `id`, `data-footnote-ref` and
  // `aria-describedby` on these anchors, and dropping them leaves both the
  // reference and the return arrow pointing at ids that don't exist.
  a: ({
    children,
    className,
    href,
    ...props
  }: ComponentPropsWithoutRef<"a">) => {
    // Links leaving the site open in a new tab. `mailto:` and in-page anchors
    // stay put, since a new tab for those only leaves a blank one behind.
    const leavesSite = /^https?:/i.test(href ?? "");

    return (
      <a
        href={href}
        className={[proseLinkClass, className].filter(Boolean).join(" ")}
        {...props}
        {...(leavesSite ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-6 text-sm leading-7 text-foreground-muted italic">
      {children}
    </blockquote>
  ),
  // Inline code is styled in `globals.css` under `:not(pre) > code`, because the
  // highlighter puts its own props on the `<code>` of a block and overriding the
  // component here would give both the same treatment.
  //
  // `rehype-pretty-code` adds `data-language`, `data-theme` and a `display: grid`
  // style to the `<pre>`, so props have to be forwarded or highlighting breaks.
  pre: ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"pre"> & { "data-language"?: string }) => {
    // `rehype-pretty-code` records the fence's info string here; a fence with
    // no language gets no attribute at all, so nothing is labelled in that case.
    const { "data-language": language, ...preProps } = props;

    return (
      <div className="relative my-6">
        <pre
          className={[
            "overflow-x-auto rounded-xl bg-hover-bg p-4 font-mono text-xs leading-6 text-foreground",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...preProps}
        >
          {children}
        </pre>
        {language ? (
          // Sits inside the block, level with the first line. Being a sibling of
          // the scroll container it stays put while long lines scroll beneath it,
          // and the block-coloured background masks whatever passes under.
          <span className="absolute top-5 right-4 bg-hover-bg pl-2 text-xs text-foreground-muted">
            {language}
          </span>
        ) : null}
      </div>
    );
  },
  // The highlighter wraps every block in a `<figure>`; clear its default margins
  // so code lines up with the text column.
  figure: ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"figure">) => (
    <figure className={["m-0", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </figure>
  ),
  img: ({ className, ...props }: ComponentPropsWithoutRef<"img">) => (
    <img
      className={["my-6 w-full rounded-xl", className].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  // Authors may use `---` as a beat between sections; keep it as pure space.
  hr: () => <div className="h-8" aria-hidden="true" />,
  // A table is the one place that gets rules. Every row and every column is
  // divided, but only *between* cells: `first:border-l-0` keeps the grid from
  // closing into a frame, and the heading's rule is left a shade darker than
  // the rest so it still reads as the divider between head and body.
  table: ({ children }: { children?: ReactNode }) => (
    <table className="my-6 w-full text-sm leading-7">{children}</table>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b border-l border-b-foreground-muted/30 border-l-foreground-muted/15 pr-3 pb-2 pl-3 text-left font-medium text-foreground first:border-l-0 first:pl-0 last:pr-0">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-l border-foreground-muted/15 py-1.5 pr-3 pl-3 align-top text-foreground/90 first:border-l-0 first:pl-0 last:pr-0">
      {children}
    </td>
  ),
};

export function useMDXComponents() {
  return components;
}