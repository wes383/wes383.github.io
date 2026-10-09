/**
 * The site's own address. A feed has to name itself in full — every link in it
 * is absolute — and page metadata resolves its relative URLs against the same
 * value, so both read it from here.
 *
 * `SITE_URL` is only for serving the site from somewhere else — a preview, say —
 * where the links should name that copy rather than the site itself.
 */
export const siteUrl = (
  process.env.SITE_URL ?? "https://weswei.wesluma.com"
).replace(/\/$/, "");
