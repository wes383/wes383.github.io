"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type {
  MovieReleases,
  MovieSearchPage,
  MovieSearchResult,
  ReleaseRecord,
} from "@/lib/tmdb";

type Mode = "cinema" | "all";

const CINEMA_TYPES = [1, 2, 3];

type Status = "idle" | "loading" | "done" | "error" | "unavailable";

type Copy = {
  title: string;
  searchLabel: string;
  placeholder: string;
  tryLabel: string;
  suggestions: { id: number; label: string; title: string; year: string }[];
  searching: string;
  results: (count: number) => string;
  noResults: string;
  previousPage: string;
  nextPage: string;
  pageStatus: (page: number, total: number) => string;
  paginationLabel: string;
  searchError: string;
  unavailable: string;
  loadingMovie: string;
  movieError: string;
  noDates: string;
  loaded: (count: number) => string;
  modeLabel: string;
  cinema: string;
  all: string;
  modeNote: string;
  first: string;
  last: string;
  markets: string;
  marketsListLabel: string;
  firstLabel: string;
  sameDay: string;
  typeLabels: Record<number, string>;
  dateLocale: string;
  dayUnits: [string, string];
  monthUnits: [string, string];
  yearUnits: [string, string];
  laterSuffix: string;
  dataNote: string;
  attribution: string;
  countryNames: Record<string, string>;
};

const COPY: Record<Locale, Copy> = {
  en: {
    title: "How long did the wait last?",
    searchLabel: "Film title",
    placeholder: "Try Star Wars or Casablanca",
    tryLabel: "Try",
    suggestions: [
      {
        id: 770,
        label: "Gone with the Wind",
        title: "Gone with the Wind",
        year: "1939",
      },
      { id: 548, label: "Rashomon", title: "Rashomon", year: "1950" },
      { id: 496243, label: "Parasite", title: "Parasite", year: "2019" },
      { id: 872585, label: "Oppenheimer", title: "Oppenheimer", year: "2023" },
    ],
    searching: "Searching…",
    results: (count) => `${count} ${count === 1 ? "result" : "results"}`,
    noResults: "No films matched. Try another title.",
    previousPage: "Previous",
    nextPage: "Next",
    pageStatus: (page, total) => `Page ${page} of ${total}`,
    paginationLabel: "Search result pages",
    searchError: "Search is unavailable right now.",
    unavailable: "This demo is unavailable right now.",
    loadingMovie: "Loading release dates…",
    movieError: "Release dates could not be loaded.",
    noDates: "TMDB has no release dates recorded for this film.",
    loaded: (count) =>
      `Release dates loaded for ${count} ${count === 1 ? "market" : "markets"}.`,
    modeLabel: "Dates shown",
    cinema: "Cinema",
    all: "All releases",
    modeNote:
      "Cinema lists every premiere, limited and wide theatrical date. All releases also include digital, physical and TV dates.",
    first: "First release",
    last: "Last release",
    markets: "Markets with a date",
    marketsListLabel: "Release dates by market",
    firstLabel: "First",
    sameDay: "Same day",
    typeLabels: {
      0: "Other",
      1: "Premiere",
      2: "Limited",
      3: "Wide",
      4: "Digital",
      5: "Physical",
      6: "TV",
    },
    dateLocale: "en-US",
    dayUnits: ["day", "days"],
    monthUnits: ["month", "months"],
    yearUnits: ["year", "years"],
    laterSuffix: " later",
    dataNote:
      "Release dates can be incomplete, especially for older films. A missing date does not mean there was no release.",
    attribution:
      "This application uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.",
    countryNames: {
      AN: "Netherlands Antilles",
      BU: "Burma",
      CS: "Serbia and Montenegro",
      DD: "East Germany",
      SU: "Soviet Union",
      TP: "East Timor",
      XC: "Czechoslovakia",
      XG: "East Germany",
      XI: "Northern Ireland",
      XK: "Kosovo",
      YU: "Yugoslavia",
    },
  },
  zh: {
    title: "一部电影，等了多久？",
    searchLabel: "电影名",
    placeholder: "例如 星球大战 或 卡萨布兰卡",
    tryLabel: "试试",
    suggestions: [
      {
        id: 770,
        label: "乱世佳人",
        title: "乱世佳人",
        year: "1939",
      },
      { id: 548, label: "罗生门", title: "罗生门", year: "1950" },
      { id: 496243, label: "寄生虫", title: "寄生虫", year: "2019" },
      { id: 872585, label: "奥本海默", title: "奥本海默", year: "2023" },
    ],
    searching: "搜索中…",
    results: (count) => `${count} 条结果`,
    noResults: "没有找到匹配的电影，换个片名试试。",
    previousPage: "上一页",
    nextPage: "下一页",
    pageStatus: (page, total) => `第 ${page} / ${total} 页`,
    paginationLabel: "搜索结果分页",
    searchError: "搜索暂时不可用，请稍后再试。",
    unavailable: "这个演示暂时不可用。",
    loadingMovie: "正在读取上映日期…",
    movieError: "上映日期暂时无法加载。",
    noDates: "TMDB 没有这部电影的上映日期记录。",
    loaded: (count) => `已载入 ${count} 个市场的上映日期。`,
    modeLabel: "统计口径",
    cinema: "影院上映",
    all: "所有发行",
    modeNote:
      "影院上映列出每一条预售/首映、有限院线和广泛院线日期；所有发行还包括数字、实体和电视。",
    first: "最早",
    last: "最晚",
    markets: "有记录的市场",
    marketsListLabel: "各市场发行日期",
    firstLabel: "最早",
    sameDay: "同日",
    typeLabels: {
      0: "其他",
      1: "首映",
      2: "有限院线",
      3: "广泛院线",
      4: "数字",
      5: "实体",
      6: "电视",
    },
    dateLocale: "zh-CN",
    dayUnits: ["天", "天"],
    monthUnits: ["个月", "个月"],
    yearUnits: ["年", "年"],
    laterSuffix: "后",
    dataNote: "老片记录可能不完整；没有日期不等于没有上映。",
    attribution:
      "This application uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.",
    countryNames: {
      AN: "荷属安的列斯",
      BU: "缅甸",
      CS: "塞尔维亚和黑山",
      DD: "东德",
      SU: "苏联",
      TP: "东帝汶",
      XC: "捷克斯洛伐克",
      XG: "东德",
      XI: "北爱尔兰",
      XK: "科索沃",
      YU: "南斯拉夫",
    },
  },
};

function daysBetween(start: string, end: string) {
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  return Math.round(
    (Date.UTC(endYear, endMonth - 1, endDay) -
      Date.UTC(startYear, startMonth - 1, startDay)) /
      86_400_000,
  );
}

export function ReleaseTimeline({ lang }: { lang: Locale }) {
  const copy = COPY[lang];
  const id = useId();
  const searchAbort = useRef<AbortController | null>(null);
  const releaseHeading = useRef<HTMLParagraphElement | null>(null);
  const resultsList = useRef<HTMLUListElement | null>(null);
  const [query, setQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<Status>("idle");
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selected, setSelected] = useState<MovieSearchResult | null>(null);
  const [releaseStatus, setReleaseStatus] = useState<Status>("idle");
  const [movie, setMovie] = useState<MovieReleases | null>(null);
  const [mode, setMode] = useState<Mode>("cinema");

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(copy.dateLocale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
    [copy.dateLocale],
  );
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(copy.dateLocale),
    [copy.dateLocale],
  );
  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([copy.dateLocale], { type: "region" });
    } catch {
      return null;
    }
  }, [copy.dateLocale]);

  useEffect(() => {
    const value = query.trim();
    if (!value) return;

    const controller = new AbortController();
    searchAbort.current = controller;
    const timer = setTimeout(async () => {
      setSearchStatus("loading");
      try {
        const response = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(value)}&lang=${lang}&page=${page}`,
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;
        if (response.status === 503) {
          setSearchStatus("unavailable");
          setResults([]);
          setTotalPages(1);
          setTotalResults(0);
          return;
        }
        if (!response.ok) throw new Error("search failed");
        const data = (await response.json()) as MovieSearchPage;
        if (controller.signal.aborted) return;
        if (
          !Array.isArray(data.results) ||
          !Number.isSafeInteger(data.page) ||
          !Number.isSafeInteger(data.totalPages)
        ) {
          throw new Error("bad search data");
        }
        setResults(data.results);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
        setSearchStatus("done");
      } catch {
        if (!controller.signal.aborted) {
          setSearchStatus("error");
          setResults([]);
          setTotalPages(1);
          setTotalResults(0);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang, page]);

  useEffect(() => {
    if (!selected) return;

    const controller = new AbortController();

    fetch(`/api/tmdb/movie?id=${selected.id}&lang=${lang}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (controller.signal.aborted) return;
        if (response.status === 503) {
          setReleaseStatus("unavailable");
          return;
        }
        if (!response.ok) throw new Error("release lookup failed");
        const data = (await response.json()) as MovieReleases;
        if (controller.signal.aborted) return;
        if (!Array.isArray(data.countries)) {
          throw new Error("bad release data");
        }
        setMovie(data);
        setMode(
          data.countries.some((country) =>
            country.records.some((record) =>
              CINEMA_TYPES.includes(record.type),
            ),
          )
            ? "cinema"
            : "all",
        );
        setReleaseStatus("done");
      })
      .catch(() => {
        if (!controller.signal.aborted) setReleaseStatus("error");
      });

    return () => controller.abort();
  }, [selected, lang]);

  useEffect(() => {
    if (selected) releaseHeading.current?.focus();
  }, [selected]);

  const rows = useMemo(() => {
    if (!movie) return [];
    return movie.countries
      .flatMap((country) =>
        country.records.filter(
          (record) => mode === "all" || CINEMA_TYPES.includes(record.type),
        ),
      )
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          a.country.localeCompare(b.country) ||
          a.type - b.type,
      );
  }, [movie, mode]);

  const marketCount = useMemo(
    () => new Set(rows.map((record) => record.country)).size,
    [rows],
  );

  const last = useMemo(() => {
    // Rows are date-sorted, so a country's first appearance is its debut.
    const seen = new Set<string>();
    let latest: ReleaseRecord | null = null;
    for (const record of rows) {
      if (seen.has(record.country)) continue;
      seen.add(record.country);
      if (!latest || record.date > latest.date) latest = record;
    }
    return latest;
  }, [rows]);

  const first = rows[0] ?? null;
  const lastRecord = rows[rows.length - 1] ?? null;
  const maxDelay =
    first && lastRecord ? daysBetween(first.date, lastRecord.date) : 0;
  const lastDelay = first && last ? daysBetween(first.date, last.date) : 0;

  function countryName(code: string) {
    const override = copy.countryNames[code];
    if (override) return override;
    try {
      return regionNames?.of(code) ?? code.toUpperCase();
    } catch {
      return code.toUpperCase();
    }
  }

  function dateLabel(date: string) {
    return dateFormatter.format(new Date(`${date}T00:00:00Z`));
  }

  function typeLabel(type: number) {
    return copy.typeLabels[type] ?? copy.typeLabels[0];
  }

  function plural(value: number, forms: [string, string]) {
    return value === 1 ? forms[0] : forms[1];
  }

  function spanLabel(days: number) {
    if (days < 31) {
      return `${numberFormatter.format(days)} ${plural(days, copy.dayUnits)}`;
    }
    if (days < 365) {
      const months = Math.round(days / 30.44);
      return `${numberFormatter.format(months)} ${plural(months, copy.monthUnits)}`;
    }
    const years = Math.round((days / 365.25) * 10) / 10;
    return `${numberFormatter.format(years)} ${plural(years === 1 ? 1 : 2, copy.yearUnits)}`;
  }

  function delayLabel(days: number) {
    if (days === 0) return copy.firstLabel;
    return `+${numberFormatter.format(days)} ${plural(days, copy.dayUnits)}`;
  }

  function selectResult(result: MovieSearchResult) {
    searchAbort.current?.abort();
    setQuery("");
    setSelected(result);
    setResults([]);
    setSearchStatus("idle");
    setPage(1);
    setTotalPages(1);
    setTotalResults(0);
    setMovie(null);
    setMode("cinema");
    setReleaseStatus("loading");
  }

  function goToPage(next: number) {
    if (next < 1 || next > totalPages || next === page) return;
    setPage(next);
    setSearchStatus("loading");
    if (resultsList.current) resultsList.current.scrollTop = 0;
  }

  function selectSuggestion(suggestion: Copy["suggestions"][number]) {
    selectResult({
      id: suggestion.id,
      title: suggestion.title,
      originalTitle: "",
      year: suggestion.year,
    });
  }

  return (
    <figure
      className="my-8 rounded-xl bg-hover-bg p-5"
      aria-label={copy.title}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{copy.title}</p>
      </div>

      <form
        role="search"
        className="mt-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <label
          htmlFor={`${id}-query`}
          className="text-xs font-medium text-foreground-muted"
        >
          {copy.searchLabel}
        </label>
        <input
          id={`${id}-query`}
          type="text"
          role="searchbox"
          inputMode="search"
          name="q"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setResults([]);
            setSearchStatus("idle");
            setPage(1);
            setTotalPages(1);
            setTotalResults(0);
          }}
          placeholder={copy.placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-controls={`${id}-results`}
          className="release-search mt-1.5 w-full rounded-lg bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted/70"
        />
      </form>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-foreground-muted">
          {copy.tryLabel}
        </span>
        {copy.suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => selectSuggestion(suggestion)}
            className="cursor-pointer rounded-md bg-background px-2 py-1 text-[11px] text-foreground-muted transition-colors hover:text-foreground"
          >
            {suggestion.label}
          </button>
        ))}
      </div>

      <p
        className="mt-2 min-h-4 text-[11px] leading-5 text-foreground-muted"
        role="status"
        aria-live="polite"
      >
        {searchStatus === "loading"
          ? copy.searching
          : searchStatus === "error"
            ? copy.searchError
            : searchStatus === "unavailable"
              ? copy.unavailable
              : searchStatus === "done"
                ? results.length > 0
                  ? copy.results(totalResults)
                  : copy.noResults
                : null}
      </p>

      {results.length > 0 ? (
        <div className="mt-1 overflow-hidden rounded-lg bg-background">
          <ul
            ref={resultsList}
            id={`${id}-results`}
            aria-busy={searchStatus === "loading"}
            className="max-h-72 overflow-y-auto"
          >
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onClick={() => selectResult(result)}
                  className="block w-full cursor-pointer px-3 py-2 text-left transition-colors hover:bg-hover-bg"
                >
                  <span className="text-xs text-foreground">
                    {result.title}
                  </span>
                  <span className="ml-2 text-[11px] text-foreground-muted">
                    {result.year ?? "—"}
                    {result.originalTitle &&
                    result.originalTitle !== result.title
                      ? ` · ${result.originalTitle}`
                      : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {results.length > 0 && totalPages > 1 ? (
        <nav
          aria-label={copy.paginationLabel}
          className="mt-2 flex items-center justify-between gap-3"
        >
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="cursor-pointer text-[11px] text-foreground-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copy.previousPage}
          </button>
          <span
            className="text-[11px] text-foreground-muted"
            aria-live="polite"
          >
            {copy.pageStatus(page, totalPages)}
          </span>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="cursor-pointer text-[11px] text-foreground-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copy.nextPage}
          </button>
        </nav>
      ) : null}

      {selected ? (
        <div className="mt-5 border-t border-foreground-muted/15 pt-4">
          <p
            ref={releaseHeading}
            tabIndex={-1}
            className="text-sm font-medium text-foreground"
          >
            {selected.title}
          </p>
          <p className="mt-0.5 text-[11px] text-foreground-muted">
            {movie?.originalTitle && movie.originalTitle !== selected.title
              ? `${movie.originalTitle} · `
              : ""}
            {movie?.year ?? selected.year ?? ""}
          </p>

          <div
            role="status"
            aria-live="polite"
            className="mt-3 text-xs leading-6 text-foreground-muted"
          >
            {releaseStatus === "loading" ? <p>{copy.loadingMovie}</p> : null}
            {releaseStatus === "error" ? <p>{copy.movieError}</p> : null}
            {releaseStatus === "unavailable" ? <p>{copy.unavailable}</p> : null}
            {releaseStatus === "done" && movie ? (
              movie.countries.length === 0 ? (
                <p>{copy.noDates}</p>
              ) : (
                <p className="sr-only">{copy.loaded(movie.countries.length)}</p>
              )
            ) : null}
          </div>

          {releaseStatus === "done" && movie ? (
            movie.countries.length === 0 ? null : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-foreground-muted">
                    {copy.modeLabel}
                  </span>
                  <div
                    role="group"
                    aria-label={copy.modeLabel}
                    className="flex gap-1"
                  >
                    {(["cinema", "all"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={mode === value}
                        onClick={() => setMode(value)}
                        className={[
                          "cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                          mode === value
                            ? "bg-foreground text-background"
                            : "bg-background text-foreground-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        {value === "cinema" ? copy.cinema : copy.all}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] leading-5 text-foreground-muted">
                  {copy.modeNote}
                </p>

                {rows.length === 0 ? (
                  <p className="mt-3 text-xs text-foreground-muted">
                    {copy.noDates}
                  </p>
                ) : (
                  <>
                    <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-lg bg-background p-3">
                        <dt className="text-[10px] font-medium tracking-wide text-foreground-muted uppercase">
                          {copy.first}
                        </dt>
                        <dd className="mt-1 text-xs text-foreground">
                          {first ? countryName(first.country) : "—"}
                        </dd>
                        <dd className="mt-0.5 text-[11px] text-foreground-muted">
                          {first ? (
                            <>
                              <time dateTime={first.date}>
                                {dateLabel(first.date)}
                              </time>
                              {" · "}
                              {typeLabel(first.type)}
                            </>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>

                      <div className="rounded-lg bg-background p-3">
                        <dt className="text-[10px] font-medium tracking-wide text-foreground-muted uppercase">
                          {copy.last}
                        </dt>
                        <dd className="mt-1 text-xs text-foreground">
                          {last ? countryName(last.country) : "—"}
                        </dd>
                        <dd className="mt-0.5 text-[11px] text-foreground-muted">
                          {last ? (
                            <>
                              <time dateTime={last.date}>
                                {dateLabel(last.date)}
                              </time>
                              {" · "}
                              {lastDelay === 0
                                ? copy.sameDay
                                : `${spanLabel(lastDelay)}${copy.laterSuffix}`}
                            </>
                          ) : (
                            copy.sameDay
                          )}
                        </dd>
                      </div>

                      <div className="rounded-lg bg-background p-3">
                        <dt className="text-[10px] font-medium tracking-wide text-foreground-muted uppercase">
                          {copy.markets}
                        </dt>
                        <dd className="mt-1 text-xs text-foreground">
                          {numberFormatter.format(marketCount)}
                        </dd>
                      </div>
                    </dl>

                    <div
                      className="release-markets-scroll mt-3 max-h-96 overflow-y-auto pr-2"
                      tabIndex={0}
                      role="region"
                      aria-label={copy.marketsListLabel}
                    >
                      <ol className="space-y-2">
                        {rows.map((entry) => {
                          const delay = first
                            ? daysBetween(first.date, entry.date)
                            : 0;
                          const width =
                            maxDelay === 0 || delay === 0
                              ? 0
                              : Math.max(2, (delay / maxDelay) * 100);
                          return (
                            <li
                              key={`${entry.country}-${entry.date}-${entry.type}`}
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                <span className="min-w-0 truncate text-xs text-foreground">
                                  {countryName(entry.country)}
                                </span>
                                <span className="grid shrink-0 grid-cols-[8em_4.5em_7em] items-baseline gap-x-2 text-[11px] text-foreground-muted">
                                  <time
                                    dateTime={entry.date}
                                    className="whitespace-nowrap tabular-nums"
                                  >
                                    {dateLabel(entry.date)}
                                  </time>
                                  <span className="whitespace-nowrap">
                                    {typeLabel(entry.type)}
                                  </span>
                                  <span className="whitespace-nowrap tabular-nums">
                                    {delayLabel(delay)}
                                  </span>
                                </span>
                              </div>
                              <div
                                className="mt-1 h-1 rounded-full bg-background"
                                aria-hidden="true"
                              >
                                <div
                                  className="h-full rounded-full bg-foreground-muted/45"
                                  style={{ width: `${width}%` }}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </>
                )}
              </>
            )
          ) : null}
        </div>
      ) : null}

      <figcaption className="mt-4 text-[11px] leading-5 text-foreground-muted">
        <p>{copy.dataNote}</p>
        <div className="mt-1 flex items-center gap-2.5">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ik.imagekit.io/wes/tmdb/logo.svg"
              alt="TMDB"
              width={185}
              height={133}
              loading="lazy"
              decoding="async"
              className="h-4 w-auto"
            />
          </a>
          <span className="text-[10px] leading-4">{copy.attribution}</span>
        </div>
      </figcaption>
    </figure>
  );
}
