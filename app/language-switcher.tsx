"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { linkClass } from "@/lib/ui";

/**
 * The same note in the other language. It is a link, not a control, so the
 * server works out where it goes and this component exists only to remember the
 * choice: a language picked by hand should outlast the browser's own
 * preference, and only the reader's own browser can record it.
 */
export function LanguageSwitcher({
  to,
  label,
  href,
}: {
  /** The language this link leads to. */
  to: Locale;
  /** What to call it — that language's name, in that language. */
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      hrefLang={to}
      // The label is written in the language it names, so a Chinese "English"
      // needs its own tag for the screen reader's voice to switch with it.
      lang={to}
      className={linkClass}
      onClick={() => {
        // A year, so that coming back to `/` lands on the language they chose
        // rather than the one their system suggests.
        try {
          document.cookie = `lang=${to}; path=/; max-age=31536000; samesite=lax`;
        } catch {}
      }}
    >
      {label}
    </Link>
  );
}
