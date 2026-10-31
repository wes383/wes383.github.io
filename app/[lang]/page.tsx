import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { LanguageSwitcher } from "@/app/language-switcher";
import { ThemeToggle } from "@/app/theme-toggle";
import { formatDate } from "@/lib/format";
import { getDictionary, hasLocale, otherLocale, type Locale } from "@/lib/i18n";
import { getAllNotes } from "@/lib/notes";
import { linkClass, proseLinkClass, titleLinkClass } from "@/lib/ui";

/** Where to find me. Most of the names read the same in either language, so they
 * are not in the dictionary — the film site is the exception: it is Letterboxd
 * to an English reader, but 豆瓣 to a Chinese one. */
function getPlaces(lang: Locale) {
  return [
    { href: "mailto:why5807@gmail.com", label: "Email", external: false },
    { href: "https://x.com/wes457", label: "X", external: true },
    { href: "https://github.com/wes383", label: "GitHub", external: true },
    lang === "zh"
      ? {
          href: "https://www.douban.com/people/km6/",
          label: "豆瓣",
          external: true,
        }
      : { href: "https://boxd.it/5TMbd", label: "Letterboxd", external: true },
  ];
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const other = otherLocale(lang);
  const notes = await getAllNotes(lang);
  const places = getPlaces(lang);

  return (
    <div>
      <section>
        <h1 className="text-sm font-medium">{dict.home.heading}</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-foreground-muted">
          {/* The sentence and its list sit in the dictionary; the links
              themselves are threaded in here, since a language punctuates a
              list differently. */}
          {dict.home.findMePrefix}
          {places.map((place, index) => (
            <Fragment key={place.href}>
              {index === 0
                ? null
                : index === places.length - 1
                  ? dict.home.lastSeparator
                  : dict.home.separator}
              <a
                href={place.href}
                className={proseLinkClass}
                {...(place.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {place.label}
              </a>
            </Fragment>
          ))}
          {dict.home.findMeSuffix}
        </p>
      </section>

      {/* Above the list rather than below it: the notes can run long, and a
          switch that needs the whole page scrolled first is no switch at all. */}
      <div className="mt-4 flex items-center gap-6">
        <ThemeToggle labels={dict.theme} />
        <LanguageSwitcher
          to={other}
          label={getDictionary(other).languageName}
          href={`/${other}`}
        />
        {/* A plain anchor rather than a `Link`: this is a file to subscribe to,
            not a page to prefetch. `RSS` reads the same in either language. */}
        <a href={`/${lang}/atom.xml`} className={linkClass}>
          RSS
        </a>
      </div>

      {/* The skip link's landing point: past the introduction and the row of
          controls, at the notes themselves. */}
      <section id="content-start" tabIndex={-1} className="mt-14">
        <h2 className="text-sm font-medium text-foreground-muted">
          {dict.home.notes}
        </h2>
        <ul className="mt-5 space-y-8">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link
                href={`/${lang}/notes/${note.slug}`}
                className={titleLinkClass}
              >
                {note.title}
              </Link>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {formatDate(note.date, lang)}
              </p>
              {note.summary ? (
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  {note.summary}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
