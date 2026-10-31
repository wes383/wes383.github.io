/**
 * What the site says, in each language it says it in. This module is imported
 * by `proxy.ts`, which runs before the app does, so it must stay free of any
 * import from `next` — plain data only.
 */

export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(lang: Locale): Locale {
  return lang === "en" ? "zh" : "en";
}

export type Dictionary = {
  meta: { title: string; description: string };
  /** Strings the page needs for reasons other than the text it says. */
  a11y: { skipToContent: string };
  home: {
    heading: string;
    /**
     * The "find me on …" sentence, split around the links so the page can
     * thread them through: prefix + link + separator + … + suffix.
     */
    findMePrefix: string;
    separator: string;
    lastSeparator: string;
    findMeSuffix: string;
    notes: string;
  };
  /**
   * What the feed calls itself and how it describes itself to a reader who has
   * subscribed to it. RSS 2.0 requires a description, so there is no way to
   * leave it out.
   */
  feed: { title: string; description: string };
  note: {
    back: string;
    top: string;
    contents: string;
    /**
     * Shown when a note is being read in a language it was never written in.
     * `null` here: an English page can only ever show English.
     */
    fallbackNotice: string | null;
  };
  notFound: { title: string; body: string; back: string };
  theme: { prefix: string; auto: string; light: string; dark: string };
  /** This language's name in this language, for the other side's switch. */
  languageName: string;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      title: "Home",
      description:
        "Notes by Wes Wei on history, technology, and why things are the way they are.",
    },
    a11y: { skipToContent: "Skip to content" },
    home: {
      heading: "I'm Wes Wei.",
      findMePrefix: "Find me on ",
      separator: ", ",
      lastSeparator: ", or ",
      findMeSuffix: ".",
      notes: "Notes",
    },
    feed: { title: "Notes from Wes", description: "The notes live here." },
    note: {
      back: "Back",
      top: "Back to top",
      contents: "Contents",
      fallbackNotice: null,
    },
    notFound: {
      title: "Not found",
      body: "Nothing lives at this address. It may have been renamed, or the link that brought you here may be wrong.",
      back: "Back",
    },
    theme: { prefix: "Theme: ", auto: "Auto", light: "Light", dark: "Dark" },
    languageName: "English",
  },
  zh: {
    meta: {
      title: "首页",
      description: "Wes Wei 的随笔：关于历史、技术，以及事物为何如此。",
    },
    a11y: { skipToContent: "跳到正文" },
    home: {
      heading: "我是 Wes Wei。",
      findMePrefix: "在 ",
      separator: "、",
      lastSeparator: " 或 ",
      findMeSuffix: " 上找到我。",
      notes: "随笔",
    },
    feed: { title: "Wes 的随笔", description: "随笔在这里。" },
    note: {
      back: "返回",
      top: "回到顶部",
      contents: "目录",
      fallbackNotice: "本文暂无中文版本，以下为英文原文。",
    },
    notFound: {
      title: "页面不存在",
      body: "此地址没有内容。可能已更名，或链接有误。",
      back: "返回",
    },
    theme: { prefix: "主题：", auto: "自动", light: "浅色", dark: "深色" },
    languageName: "中文",
  },
};

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
