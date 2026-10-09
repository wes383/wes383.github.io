import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getAllNotes, getNoteSource } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

/** The tag Atom expects in the feed's `xml:lang`. */
const FEED_LANGUAGE: Record<Locale, string> = { en: "en", zh: "zh-CN" };

/** Atom requires an author on the feed or on every entry. The name is written
 * the same way in either language, so it is not in the dictionary. */
const AUTHOR = "Wes Wei";

/**
 * Markdown to HTML, with the same extensions the pages are compiled with, so a
 * note's tables, footnotes and formulas come out here the way they do there.
 * Raw HTML is left alone in both directions: a caption is written as a bare
 * `<small>`, and it has to survive the trip as an element.
 *
 * Math is the one place the two pipelines have to part. A page loads
 * `katex.css`, so it can carry KaTeX's full output; a reader loads nothing of
 * ours. That output hides its MathML half — the half a screen reader reads —
 * with a class, so without the stylesheet both halves would show at once: the
 * formula, then the same formula taken apart. `output: "mathml"` drops the HTML
 * half and leaves the `<math>` element, which a browser draws on its own.
 */
const markdownToHtml = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex, { output: "mathml" })
  .use(rehypeStringify, { allowDangerousHtml: true });

/**
 * Two things in a note's source are not part of its text. The front matter is an
 * MDX `export` the page never renders, and the interactive figures are client
 * components: a feed has no JavaScript to run them, so a slider would arrive as
 * a dead control. Both are taken out before the Markdown is parsed — the prose
 * around the figures is written to stand on its own.
 */
const METADATA_EXPORT = /^export\s+const\s+metadata\s*=[\s\S]*?\n\};?\n?/;
const INTERACTIVE_FIGURE =
  /^[ \t]*<(?:TabletRotation|DirectionSwitch)\b[^>]*\/>[ \t]*\n/gm;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Atom dates are RFC 3339; a note's own date is a plain `YYYY-MM-DD`, meaning
 * the start of that day where the note was written rather than at Greenwich.
 * Read as UTC it would land up to eight hours in the future, and a reader is
 * free to hold a future-dated entry back until its time comes.
 */
function atomDate(date: string): string {
  return new Date(`${date}T00:00:00+08:00`).toISOString();
}

/**
 * A feed of one language's notes, in Atom, carrying each note in full.
 *
 * The list is the same one the home page shows — fallbacks included — so a note
 * that can be read on the site is never missing from the feed.
 */
export async function GET(
  _request: Request,
  ctx: RouteContext<"/[lang]/atom.xml">,
) {
  const { lang } = await ctx.params;
  if (!hasLocale(lang)) return new Response("Not found", { status: 404 });

  const dict = getDictionary(lang);
  const home = `${siteUrl}/${lang}`;
  const notes = await getAllNotes(lang);

  const entries = await Promise.all(
    notes.map(async (note) => {
      const page = `${home}/notes/${note.slug}`;
      const source = getNoteSource(lang, note.slug);
      if (!source) return "";

      const html = String(
        await markdownToHtml.process(
          source.replace(METADATA_EXPORT, "").replace(INTERACTIVE_FIGURE, ""),
        ),
      )
        // The footnote references and their return arrows are the only in-page
        // links a note writes. Inside a feed reader there is no page for a bare
        // `#id` to belong to, so they carry the note's own address.
        .replace(/href="#/g, `href="${page}#`);

      const date = atomDate(note.date);

      // A note carries one date, so it is both when it was published and when
      // it last changed — the entries are written once and then left alone.
      return `
  <entry>
    <title>${escapeXml(note.title)}</title>
    <link rel="alternate" href="${page}"/>
    <id>${page}</id>
    <updated>${date}</updated>
    <published>${date}</published>
    <summary>${escapeXml(note.summary ?? "")}</summary>
    <content type="html"><![CDATA[${html.replace(/]]>/g, "]]&gt;")}]]></content>
  </entry>`;
    }),
  );

  // The list is newest first, so its head is what the feed was last built from.
  const updated = atomDate(notes[0]?.date ?? "1970-01-01");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${FEED_LANGUAGE[lang]}">
  <title>${escapeXml(dict.feed.title)}</title>
  <subtitle>${escapeXml(dict.feed.description)}</subtitle>
  <id>${home}</id>
  <link rel="alternate" href="${home}"/>
  <link rel="self" href="${home}/atom.xml"/>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(AUTHOR)}</name>
  </author>${entries.join("")}
</feed>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
