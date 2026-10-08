import Link from "next/link";
import { getAllEssays } from "@/lib/essays";
import { formatDate } from "@/lib/format";
import { proseLinkClass, titleLinkClass } from "@/lib/ui";

export default async function Home() {
  const essays = await getAllEssays();

  return (
    <div>
      <section>
        <h1 className="text-sm font-medium">I&apos;m Wes Wei.</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-foreground-muted">
          Find me on{" "}
          <a href="mailto:why5807@gmail.com" className={proseLinkClass}>
            Email
          </a>
          ,{" "}
          <a
            href="https://x.com/wes457"
            target="_blank"
            rel="noopener noreferrer"
            className={proseLinkClass}
          >
            X
          </a>
          ,{" "}
          <a
            href="https://github.com/wes383"
            target="_blank"
            rel="noopener noreferrer"
            className={proseLinkClass}
          >
            GitHub
          </a>
          , or{" "}
          <a
            href="https://boxd.it/5TMbd"
            target="_blank"
            rel="noopener noreferrer"
            className={proseLinkClass}
          >
            Letterboxd
          </a>
          .
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-medium text-foreground-muted">Notes</h2>
        <ul className="mt-5 space-y-8">
          {essays.map((essay) => (
            <li key={essay.slug}>
              <Link href={`/essays/${essay.slug}`} className={titleLinkClass}>
                {essay.title}
              </Link>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {formatDate(essay.date)}
              </p>
              {essay.summary ? (
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  {essay.summary}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}