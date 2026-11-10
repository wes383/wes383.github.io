"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent as ReactMouseEvent } from "react";
import { beginLanguageFade } from "@/app/language-fade";
import type { Locale } from "@/lib/i18n";
import { linkClass } from "@/lib/ui";

/**
 * The same note in the other language. It is a link, not a control, so the
 * server works out where it goes and this component exists only to remember the
 * choice: a language picked by hand should outlast the browser's own
 * preference, and only the reader's own browser can record it. It also dims the
 * page on the way out, since React animates no transition for this navigation.
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
  const router = useRouter();

  /**
   * The switch is the one navigation the site animates itself, and the fade has
   * to happen before the route changes — which means the navigation waits for
   * it. See `language-fade.ts` for why React cannot be asked to do this one.
   */
  function leave(event: ReactMouseEvent<HTMLAnchorElement>) {
    // A modified click opens a new tab, where there is no page to fade and the
    // browser's own navigation is the one that should run.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    // Next's own handler gives up on a prevented event, which is what leaves
    // the navigation to the timer below.
    event.preventDefault();

    try {
      // A year, so that coming back to `/` lands on the language they chose
      // rather than the one their system suggests.
      document.cookie = `lang=${to}; path=/; max-age=31536000; samesite=lax`;
    } catch {}

    // The fade decides how long the navigation waits; with reduced motion it
    // asks for none.
    const wait = beginLanguageFade();
    window.setTimeout(() => router.push(href), wait);
  }

  return (
    <Link
      href={href}
      hrefLang={to}
      // The label is written in the language it names, so a Chinese "English"
      // needs its own tag for the screen reader's voice to switch with it.
      lang={to}
      className={linkClass}
      onClick={leave}
    >
      {label}
    </Link>
  );
}
