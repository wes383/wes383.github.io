import { notFound } from "next/navigation";

/*
 * A URL under a language that matches no route. Without a catch-all the request
 * would never enter the `[lang]` tree, and the framework's own 404 — which
 * knows nothing about the language in the path — would answer instead. Matching
 * here and handing straight to `notFound` is what puts the localised one in
 * charge of every dead link.
 */

// There is no UI here for the instant-navigation check to inspect: this segment
// exists only to throw, so the check can never finish and reports an error for
// every dead link instead. Opting out of it is the point of the export.
export const instant = false;

export default function CatchAll() {
  notFound();
}
