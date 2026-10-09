import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import GithubSlugger from "github-slugger";
import type { Locale } from "./i18n";

export type NoteMeta = {
  title: string;
  date: string;
  summary?: string;
};

export type Note = NoteMeta & { slug: string };

/** What an `.mdx` note compiles to. */
type NoteModule = {
  default: ComponentType;
  metadata: NoteMeta;
};

/** The language a note falls back to when it has no translation. */
const FALLBACK: Locale = "en";

const contentDirectory = path.join(process.cwd(), "content");

function notesDirectory(lang: Locale): string {
  return path.join(contentDirectory, lang, "notes");
}

/** The slugs written in `lang`'s own directory — none at all, if it is empty. */
function slugsIn(lang: Locale): string[] {
  try {
    return fs
      .readdirSync(notesDirectory(lang))
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.slice(0, -".mdx".length));
  } catch {
    return [];
  }
}

/**
 * Which language actually supplies a note to a reader browsing `lang`. A
 * translation and its original share a slug, so "is this translated?" is just
 * "is there a file of that name in the other directory?".
 */
export function noteLanguage(lang: Locale, slug: string): Locale | null {
  if (slugsIn(lang).includes(slug)) return lang;
  if (lang !== FALLBACK && slugsIn(FALLBACK).includes(slug)) return FALLBACK;
  return null;
}

/** Everything on the site for a reader browsing `lang`, translations included. */
export function getNoteSlugs(lang: Locale): string[] {
  return [...new Set([...slugsIn(lang), ...slugsIn(FALLBACK)])];
}

// A dynamic import needs a fixed prefix to glob on, so each language names its
// own directory rather than building the path from a variable.
const loaders: Record<Locale, (slug: string) => Promise<NoteModule>> = {
  en: (slug) => import(`../content/en/notes/${slug}.mdx`),
  zh: (slug) => import(`../content/zh/notes/${slug}.mdx`),
};

/**
 * A note's body, its frontmatter, and the language that body is written in,
 * which the reader's language may differ from when nothing is translated yet.
 */
export async function getNote(lang: Locale, slug: string) {
  const source = noteLanguage(lang, slug);
  if (!source) return null;

  const body = await loaders[source](slug);

  return { default: body.default, metadata: body.metadata, source };
}

export async function getAllNotes(lang: Locale): Promise<Note[]> {
  const notes = await Promise.all(
    getNoteSlugs(lang).map(async (slug) => {
      const note = await getNote(lang, slug);
      return note ? { slug, ...note.metadata } : null;
    }),
  );

  return notes
    .filter((note): note is Note => note !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * A note's own Markdown, for the readers of it that work on the source rather
 * than on the page's rendering of it — the contents, and the feed.
 */
export function getNoteSource(lang: Locale, slug: string): string | null {
  const source = noteLanguage(lang, slug);
  if (!source) return null;

  return fs.readFileSync(
    path.join(notesDirectory(source), `${slug}.mdx`),
    "utf8",
  );
}

export type NoteHeading = {
  /** The `id` `rehype-slug` gives this heading in the rendered page. */
  id: string;
  text: string;
  /** Level-three headings sitting under this level-two heading. */
  children: { id: string; text: string }[];
};

/** Drops inline Markdown, leaving the words a reader would actually see. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .trim();
}

/**
 * The level-two and level-three headings of a note, read back out of the
 * source. `rehype-slug` derives ids from the same text with the same slugger.
 */
export function getNoteHeadings(lang: Locale, slug: string): NoteHeading[] {
  const contents = getNoteSource(lang, slug);
  if (contents === null) return [];

  // `rehype-slug` numbers repeated slugs in document order, so every heading has
  // to pass through the slugger — not only the ones the tree displays — or the
  // two would disagree from the first duplicate onwards.
  const slugger = new GithubSlugger();
  const sections: NoteHeading[] = [];
  let fence: { character: string; length: number } | null = null;

  for (const line of contents.split(/\r?\n/)) {
    // A fence closes only on the same character, at least as long as the one
    // that opened it — which is how a reference essay nests a three-backtick
    // block inside a four-backtick one.
    const delimiter = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (delimiter) {
      const marker = delimiter[1];
      if (!fence) {
        fence = { character: marker[0], length: marker.length };
      } else if (
        marker[0] === fence.character &&
        marker.length >= fence.length &&
        delimiter[2].trim() === ""
      ) {
        fence = null;
      }
      continue;
    }
    if (fence) continue;

    // Fences are skipped above, so a note's examples of heading syntax don't
    // turn into table-of-contents entries.
    const heading = /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/.exec(line);
    if (!heading) continue;

    const text = toPlainText(heading[2]);
    const id = slugger.slug(text);
    const depth = heading[1].length;

    if (depth === 2) {
      sections.push({ id, text, children: [] });
    } else if (depth === 3) {
      const parent = sections[sections.length - 1];
      if (parent) parent.children.push({ id, text });
      else sections.push({ id, text, children: [] });
    }
  }

  return sections;
}
