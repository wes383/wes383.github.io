import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/app/language-switcher";
import { ThemeToggle } from "@/app/theme-toggle";
import { formatDate } from "@/lib/format";
import { getDictionary, hasLocale, otherLocale } from "@/lib/i18n";
import { getNote, getNoteHeadings, getNoteSlugs } from "@/lib/notes";
import { linkClass } from "@/lib/ui";
import { TableOfContents } from "./table-of-contents";

export async function generateStaticParams() {
  // A nested segment reads the root parameter directly, because which notes
  // exist depends on which language is being browsed.
  const language = await rootLang();
  return getNoteSlugs(hasLocale(language) ? language : "en").map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/notes/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const note = await getNote(lang, slug);
  if (!note) return {};

  return { title: note.metadata.title, description: note.metadata.summary };
}

export default function NotePage({
  params,
}: PageProps<"/[lang]/notes/[slug]">) {
  return (
    // The fallback can't be translated: the shell may not read the route before
    // it renders, and a filesystem read resolves too fast for it to be seen.
    <Suspense fallback={<p className="text-sm text-foreground-muted">…</p>}>
      <Note params={params} />
    </Suspense>
  );
}

async function Note({
  params,
}: Pick<PageProps<"/[lang]/notes/[slug]">, "params">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const note = await getNote(lang, slug);
  if (!note) notFound();

  const dict = getDictionary(lang);
  const other = otherLocale(lang);
  const headings = getNoteHeadings(lang, slug);
  const hasContents = headings.length > 1;

  return (
    // The text column stays centred on its own at every width; from `xl` the
    // contents moves out into the right-hand gutter beside it.
    //
    // The link back stays in the flow rather than moving into the left gutter:
    // as an in-flow first child it stops the header's top margin from collapsing
    // through this article, which would push the article down and so start the
    // contents column 2rem below the `top-14` it sticks at.
    <article className="relative">
      {/* Back on the left; the language switch and the theme switch pushed to
          the far right of the same row. The row keeps a child in the flow here,
          which is what stops the header's top margin from collapsing through
          this article — that would push the article down and start the contents
          column 2rem below the `top-14` it sticks at. */}
      <div className="flex items-center justify-between">
        <Link href={`/${lang}`} className={linkClass}>
          {dict.note.back}
        </Link>
        <div className="flex items-center gap-6">
          <LanguageSwitcher
            to={other}
            label={getDictionary(other).languageName}
            href={`/${other}/notes/${slug}`}
          />
          <ThemeToggle labels={dict.theme} />
        </div>
      </div>

      <header className="mt-8 mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          {note.metadata.title}
        </h1>
        <p className="mt-2 text-xs text-foreground-muted">
          {formatDate(note.metadata.date, lang)}
        </p>
      </header>

      {/* Nothing translated yet, so the reader gets the original — and is told
          so, rather than left to wonder why the page changed language. */}
      {note.source !== lang && dict.note.fallbackNotice ? (
        <p
          lang={lang}
          className="mb-10 text-xs leading-6 text-foreground-muted"
        >
          {dict.note.fallbackNotice}
        </p>
      ) : null}

      {hasContents ? (
        // Below `xl` there is no room beside the text, so the contents sits in
        // the flow above the note.
        //
        // From `xl` it is absolute, and its box reaches the bottom of the
        // *page* rather than of the note: `-bottom-24` carries it through the
        // `pb-24` on `main`. A sticky column can only stay put while its box
        // lasts, so a box that ended with the text would let the column start
        // travelling upwards again over the last screenful of scrolling.
        <nav
          aria-label={dict.note.contents}
          className="mb-12 xl:absolute xl:top-0 xl:-bottom-24 xl:left-full xl:mb-0 xl:ml-32 xl:w-40"
        >
          <TableOfContents headings={headings} label={dict.note.contents} />
        </nav>
      ) : null}

      {/* Marked with the language it is actually written in, not the one the
          page is in: that is what hyphenation, a screen reader and the choice
          of CJK glyph forms all read this element for. */}
      <div lang={note.source}>
        <note.default />
      </div>
    </article>
  );
}
