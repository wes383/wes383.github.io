import type { Metadata } from "next";
import Link from "next/link";
import { linkClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div>
      <h1 className="text-sm font-medium">Not found</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-foreground-muted">
        Nothing lives at this address. It may have been renamed, or the link that
        brought you here may be wrong.
      </p>
      <p className="mt-8">
        <Link href="/" className={linkClass}>
          Back
        </Link>
      </p>
    </div>
  );
}
