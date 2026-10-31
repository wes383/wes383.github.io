import type { Locale } from "./i18n";

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

/** The name the site signs its pages with, on cards and as a note's author. */
export const siteName = "Wes Wei";

/** The handle a social card credits back to. */
export const twitterHandle = "@wes457";

/**
 * Open Graph names a language with its region, which the URL's bare `en` and
 * `zh` do not.
 */
export const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
};
