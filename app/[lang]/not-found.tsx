import type { Metadata } from "next";
import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { linkClass } from "@/lib/ui";

/**
 * A `not-found` file is handed no props, so the language has to be read from
 * the route itself. It renders inside the root layout, which is what makes the
 * root parameter available here.
 */
async function currentLanguage() {
  const language = await lang();
  return hasLocale(language) ? language : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: getDictionary(await currentLanguage()).notFound.title };
}

export default async function NotFound() {
  const language = await currentLanguage();
  const dict = getDictionary(language);

  return (
    <div>
      <h1 className="text-sm font-medium">{dict.notFound.title}</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-foreground-muted">
        {dict.notFound.body}
      </p>
      <p className="mt-8">
        <Link href={`/${language}`} className={linkClass}>
          {dict.notFound.back}
        </Link>
      </p>
    </div>
  );
}
