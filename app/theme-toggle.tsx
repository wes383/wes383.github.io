"use client";

import { useEffect, useState } from "react";
import { linkClass } from "@/lib/ui";

/** The three choices, in the order the button cycles through them. */
const themes = ["auto", "light", "dark"] as const;

type Theme = (typeof themes)[number];

const labels: Record<Theme, string> = {
  auto: "Theme: Auto",
  light: "Theme: Light",
  dark: "Theme: Dark",
};

/**
 * A one-line theme switch. Cycles through following the system preference and
 * forcing either scheme, and records the choice for the script in the layout to
 * pick up on the next visit. The label says which way it is currently set, so
 * the button explains itself without a separate caption.
 */
export function ThemeToggle() {
  // Both the server and the first client render say "auto", so hydration
  // matches; the effect then adopts whatever that script found on the element.
  const [theme, setTheme] = useState<Theme>("auto");

  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (applied === "light" || applied === "dark") setTheme(applied);
  }, []);

  const next = themes[(themes.indexOf(theme) + 1) % themes.length];

  function choose(choice: Theme) {
    setTheme(choice);

    if (choice === "auto") {
      // No attribute means the colour-scheme queries in `globals.css` are free
      // to follow the system again.
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = choice;
    }

    // Recorded for the layout's script to read back on the next visit. Storage
    // can throw where it is blocked, and failing to remember the choice is no
    // reason to leave the page unpainted — the scheme is already applied above.
    try {
      if (choice === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", choice);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={() => choose(next)}
      className={linkClass}
    >
      {labels[theme]}
    </button>
  );
}
