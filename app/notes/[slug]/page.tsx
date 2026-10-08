import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getEssay, getEssayHeadings, getEssaySlugs, hasEssay } from "@/lib/essays";
import { formatDate } from "@/lib/format";
import { linkClass } from "@/lib/ui";
import { TableOfContents } from "./table-of-contents";

export function generateStaticParams() {
  return getEssaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!hasEssay(slug)) return {};

  const { metadata } = await getEssay(slug);
  return { title: metadata.title, description: metadata.summary };
}

export default function EssayPage({ params }: PageProps<"/notes/[slug]">) {
  return (
    <Suspense
      fallback={<p className="text-sm text-foreground-muted">Loading…</p>}
    >
      <Essay params={params} />
    </Suspense>
  );
}

async function Essay({ params }: Pick<PageProps<"/notes/[slug]">, "params">) {
  const { slug } = await params;
  if (!hasEssay(slug)) notFound();

  const { default: EssayBody, metadata } = await getEssay(slug);
  const headings = getEssayHeadings(slug);
  const hasContents = headings.length > 1;

  return (
    // The text column stays centred on its own at every width; from `xl` the
    // contents moves out into the right-hand gutter beside it.
    //
    // The link back stays in the flow rather than moving into the left gutter:
    // as an in-flow first child it stops the header's top margin from collapsing
    // through this article, which would push the article down and so start the
    // contents column 2rem below the `top-14` it sticks at.
    <article className="relative">
      <Link href="/" className={linkClass}>
        Back
      </Link>

      <header className="mt-8 mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          {metadata.title}
        </h1>
        <p className="mt-2 text-xs text-foreground-muted">
          {formatDate(metadata.date)}
        </p>
      </header>

      {hasContents ? (
        // Below `xl` there is no room beside the text, so the contents sits in
        // the flow above the essay.
        <nav
          aria-label="Contents"
          className="mb-12 xl:absolute xl:inset-y-0 xl:left-full xl:mb-0 xl:ml-32 xl:w-40"
        >
          <TableOfContents headings={headings} />
        </nav>
      ) : null}

      <EssayBody />
    </article>
  );
}