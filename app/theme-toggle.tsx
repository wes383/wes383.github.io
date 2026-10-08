"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { linkClass } from "@/lib/ui";

const themes = ["auto", "light", "dark"] as const;
type Theme = (typeof themes)[number];

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
  const [theme, setTheme] = useState<Theme>("auto");
  const next = themes[(themes.indexOf(theme) + 1) % themes.length];

  // The layout's script may already have run, so the applied theme is the
  // truth; start from it rather than flashing "Auto" on a dark page.
  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (applied === "light" || applied === "dark") setTheme(applied);
  }, []);

  function choose(choice: Theme) {
    setTheme(choice);

    if (choice === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = choice;

    try {
      if (choice === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", choice);
    } catch {}
  }

  return (
    <button type="button" onClick={() => choose(next)} className={linkClass}>
      {labels.prefix}
      {labels[theme]}
    </button>
  );
}
