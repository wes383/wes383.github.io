import { NextResponse } from "next/server";
import {
  getMovieReleases,
  TmdbNotConfiguredError,
  TmdbRequestError,
} from "@/lib/tmdb";

const NO_STORE = { "Cache-Control": "no-store" };
const CACHE = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
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
      { status: error.status === 404 ? 404 : 502, headers: NO_STORE },
    );
  }
  return NextResponse.json(
    { error: "internal_error" },
    { status: 500, headers: NO_STORE },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en";

  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json(
      { error: "invalid_id" },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    const movie = await getMovieReleases(id, lang);
    return NextResponse.json(movie, { headers: CACHE });
  } catch (error) {
    return failure(error);
  }
}
