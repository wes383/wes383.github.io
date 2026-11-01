import { NextResponse } from "next/server";
import {
  searchMovies,
  TmdbNotConfiguredError,
  TmdbRequestError,
} from "@/lib/tmdb";

const NO_STORE = { "Cache-Control": "no-store" };
const CACHE = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

function failure(error: unknown) {
  if (error instanceof TmdbNotConfiguredError) {
    return NextResponse.json(
      { error: "tmdb_not_configured" },
      { status: 503, headers: NO_STORE },
    );
  }
  if (error instanceof TmdbRequestError) {
    return NextResponse.json(
      { error: "tmdb_error" },
      { status: 502, headers: NO_STORE },
    );
  }
  return NextResponse.json(
    { error: "internal_error" },
    { status: 500, headers: NO_STORE },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en";
  const pageValue = Number(searchParams.get("page") ?? "1");
  const page = Number.isSafeInteger(pageValue)
    ? Math.min(Math.max(pageValue, 1), 500)
    : 1;

  if (query.length === 0 || query.length > 100) {
    return NextResponse.json(
      { results: [] },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    const result = await searchMovies(query, lang, page);
    return NextResponse.json(result, { headers: CACHE });
  } catch (error) {
    return failure(error);
  }
}
