import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { getAllNotes, noteLanguagePaths } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

/**
 * The same pages the site serves, with the two language versions pointing at
 * each other. A sitemap has no `metadataBase` to resolve relative addresses
 * against, so every URL here is written out in full.
 */
function languageAlternates(paths: Partial<Record<Locale, string>>) {
  const languages: Record<string, string> = {};

  for (const lang of locales) {
    const path = paths[lang];
    if (path) languages[lang] = `${siteUrl}${path}`;
  }

  const xDefault = paths.en ?? paths.zh;
  if (xDefault) languages["x-default"] = `${siteUrl}${xDefault}`;

  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home = languageAlternates({ en: "/en", zh: "/zh" });
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    // Newest first, so the head is what the home page was last changed for.
    const notes = await getAllNotes(lang);

    entries.push({
      url: `${siteUrl}/${lang}`,
      lastModified: notes[0]?.date,
      alternates: home,
    });

    for (const note of notes) {
      entries.push({
        url: `${siteUrl}/${lang}/notes/${note.slug}`,
        lastModified: note.date,
        alternates: languageAlternates(noteLanguagePaths(note.slug)),
      });
    }
  }

  return entries;
}
