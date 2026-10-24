"use client";

import { useSyncExternalStore } from "react";
import type { Dictionary } from "@/lib/i18n";
import { linkClass } from "@/lib/ui";

const themes = ["auto", "light", "dark"] as const;
type Theme = (typeof themes)[number];

/**
 * The theme actually applied to the page, read back from `<html data-theme>`.
 *
 * That attribute is the single source of truth: the layout's script writes it
 * before the first paint and `choose` writes it on every click, so reading it
 * here avoids holding a second, easily-desynced copy in state.
 */
function appliedTheme(): Theme | null {
  const applied = document.documentElement.dataset.theme;
  return applied === "light" || applied === "dark" ? applied : null;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Nothing is applied while prerendering, so the script has yet to speak. */
function serverTheme(): Theme {
  return "auto";
}

/**
 * One button cycling through three states, rather than three buttons: at this
 * scale a control that shows what it is set to and changes when pressed reads
 * more like text than a control, which is the whole idea.
 *
 * "Auto" means no `data-theme` at all — the palette in `globals.css` falls back
 * to the system then. The choice is remembered in `localStorage`, and applied
 * before the first paint by the script in the layout.
 */
export function ThemeToggle({ labels }: { labels: Dictionary["theme"] }) {
  // Subscribing to the attribute rather than seeding state in an effect means
  // the label follows every write to it — including the layout script's, which
  // lands before hydration and would otherwise leave "Auto" showing on a dark
  // page until something else re-rendered.
  const theme =
    useSyncExternalStore(subscribe, appliedTheme, serverTheme) ?? "auto";
  const next = themes[(themes.indexOf(theme) + 1) % themes.length];

  function choose(choice: Theme) {
    if (choice === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = choice;

    try {
      if (choice === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", choice);
    } catch {}
  }

  return (
    // `aria-live` because the button's text is its state: when the click
    // changes that text in place, polite live regions announce the new label,
    // which is the only way a screen reader hears which theme it landed on.
    <button
      type="button"
      onClick={() => choose(next)}
      aria-live="polite"
      className={linkClass}
    >
      {labels.prefix}
      {labels[theme]}
    </button>
  );
}
