import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, type Locale } from "@/lib/i18n";

/**
 * The site's rule, in one line: Chinese for a Chinese reader, English for
 * everyone else — so all this has to decide is whether the reader's preferred
 * language is Chinese.
 *
 * `Accept-Language` arrives as `zh-CN,zh;q=0.9,en;q=0.8`: split on commas, read
 * the `q` weight off each entry, and look at the strongest named tag. `*` says
 * nothing about a preference, so it is dropped rather than matched.
 */
function preferredLocale(header: string | null): Locale {
  if (!header) return "en";

  const tags = header
    .split(",")
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(";");
      const weight = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));

      return {
        tag: tag.trim().toLowerCase(),
        q: weight ? Number(weight.slice("q=".length)) : 1,
      };
    })
    .filter(({ tag }) => tag !== "" && tag !== "*")
    .sort((a, b) => b.q - a.q);

  return tags[0]?.tag.startsWith("zh") ? "zh" : "en";
}

/**
 * Every page lives under a language, and this puts the language on. A path that
 * already carries one is left alone; anything else — `/`, `/notes/x`, even a
 * path whose first segment merely looks like a locale — is redirected with the
 * reader's language in front of it.
 *
 * Prefixing rather than stripping keeps every request inside the `[lang]` tree,
 * which is what lets the localised 404 handle a URL that matches no route.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [first = ""] = pathname.split("/").slice(1);

  if (hasLocale(first)) return;

  // A language picked by hand outlives the browser's own preference: the reader
  // who switched once should not be switched back on their next visit.
  const chosen = request.cookies.get("lang")?.value;
  const lang =
    chosen && hasLocale(chosen)
      ? chosen
      : preferredLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Static assets and anything with a file extension are not pages.
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
