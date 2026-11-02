import type { Locale } from "./i18n";

const API_ROOT = "https://api.themoviedb.org/3";

export type MovieSearchResult = {
  id: number;
  title: string;
  originalTitle: string;
  year: string | null;
};

export type MovieSearchPage = {
  results: MovieSearchResult[];
  page: number;
  totalPages: number;
  totalResults: number;
};

export type ReleaseRecord = {
  country: string;
  date: string;
  type: number;
};

export type CountryRelease = {
  country: string;
  /** Every dated release, earliest first. */
  records: ReleaseRecord[];
};

export type MovieReleases = {
  id: number;
  title: string;
  originalTitle: string;
  year: string | null;
  countries: CountryRelease[];
};

type TmdbSearchResponse = {
  page?: number;
  total_pages?: number;
  total_results?: number;
  results?: {
    id?: number;
    title?: string;
    original_title?: string;
    release_date?: string;
  }[];
};

type TmdbReleaseDate = {
  release_date?: string;
  type?: number;
};

type TmdbReleaseCountry = {
  iso_3166_1?: string;
  release_dates?: TmdbReleaseDate[];
};

type TmdbMovieResponse = {
  id?: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  release_dates?: { results?: TmdbReleaseCountry[] };
};

export class TmdbNotConfiguredError extends Error {
  constructor() {
    super("TMDB credentials are not configured");
  }
}

export class TmdbRequestError extends Error {
  constructor(readonly status: number) {
    super(`TMDB request failed with status ${status}`);
  }
}

function credentials():
  | { kind: "token"; value: string }
  | { kind: "key"; value: string }
  | null {
  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (token) return { kind: "token", value: token };
  const key = process.env.TMDB_API_KEY?.trim();
  if (key) return { kind: "key", value: key };
  return null;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const auth = credentials();
  if (!auth) throw new TmdbNotConfiguredError();

  const url = new URL(`${API_ROOT}${path}`);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }
  if (auth.kind === "key") url.searchParams.set("api_key", auth.value);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (auth.kind === "token") {
    headers.Authorization = `Bearer ${auth.value}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) throw new TmdbRequestError(response.status);
  return (await response.json()) as T;
}

function isoDate(value: string | undefined): string | null {
  if (!value) return null;
  const date = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

function yearOf(value: string | undefined): string | null {
  const year = value?.slice(0, 4);
  return year && /^\d{4}$/.test(year) ? year : null;
}

const URL_LIKE = /\.(?:com|net|org|cn|cc|xyz|top|vip|me|io|tv)\b/i;

function cleanText(value: string | undefined): string {
  const text = value?.trim() ?? "";
  return URL_LIKE.test(text) ? "" : text;
}

function displayTitle(
  localized: string | undefined,
  original: string | undefined,
): string {
  const localizedText = localized?.trim() ?? "";
  const originalText = original?.trim() ?? "";
  return (
    cleanText(localized) ||
    cleanText(original) ||
    localizedText ||
    originalText ||
    "Untitled"
  );
}

function earliest(records: ReleaseRecord[]): ReleaseRecord | null {
  if (records.length === 0) return null;

  return records.reduce((first, record) => {
    if (record.date < first.date) return record;
    if (record.date === first.date && record.type < first.type) return record;
    return first;
  });
}

export async function searchMovies(
  query: string,
  lang: Locale,
  page: number,
): Promise<MovieSearchPage> {
  const data = await tmdbFetch<TmdbSearchResponse>("/search/movie", {
    query,
    include_adult: "false",
    language: lang === "zh" ? "zh-CN" : "en-US",
    page: String(page),
  });

  const results = (data.results ?? [])
    .filter((movie): movie is { id: number } & typeof movie =>
      Number.isSafeInteger(movie.id),
    )
    .map((movie) => ({
      id: movie.id,
      title: displayTitle(movie.title, movie.original_title),
      originalTitle:
        cleanText(movie.original_title) || cleanText(movie.title) || "",
      year: yearOf(movie.release_date),
    }));

  return {
    results,
    page: Math.max(1, Number(data.page) || page),
    totalPages: Math.min(500, Math.max(1, Number(data.total_pages) || 1)),
    totalResults: Math.max(0, Number(data.total_results) || results.length),
  };
}

export async function getMovieReleases(
  id: number,
  lang: Locale,
): Promise<MovieReleases> {
  const data = await tmdbFetch<TmdbMovieResponse>(`/movie/${id}`, {
    append_to_response: "release_dates",
    language: lang === "zh" ? "zh-CN" : "en-US",
  });

  const countries: CountryRelease[] = [];

  for (const country of data.release_dates?.results ?? []) {
    const code = country.iso_3166_1?.toUpperCase();
    if (!code) continue;

    const recordsByDate = new Map<string, ReleaseRecord>();
    for (const release of country.release_dates ?? []) {
      const date = isoDate(release.release_date);
      if (!date) continue;
      const type = Number(release.type) || 0;
      const key = `${date}:${type}`;
      if (!recordsByDate.has(key)) {
        recordsByDate.set(key, { country: code, date, type });
      }
    }

    const records = [...recordsByDate.values()].sort(
      (a, b) => a.date.localeCompare(b.date) || a.type - b.type,
    );
    if (records.length === 0) continue;

    countries.push({ country: code, records });
  }

  const earliestOverall = earliest(
    countries.flatMap((country) => country.records),
  );

  return {
    id: Number(data.id) || id,
    title: displayTitle(data.title, data.original_title),
    originalTitle:
      cleanText(data.original_title) || cleanText(data.title) || "",
    year: yearOf(data.release_date) ?? yearOf(earliestOverall?.date),
    countries,
  };
}
