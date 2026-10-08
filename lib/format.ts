import type { Locale } from "./i18n";

export function formatDate(iso: string, lang: Locale): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
    lang === "zh" ? "zh-CN" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    },
  );
}
