import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

export type EssayMeta = {
  title: string;
  date: string;
  summary?: string;
};

export type Essay = EssayMeta & { slug: string };

const essaysDirectory = path.join(process.cwd(), "content", "essays");

export function getEssaySlugs(): string[] {
  return fs
    .readdirSync(essaysDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

export function hasEssay(slug: string): boolean {
  return getEssaySlugs().includes(slug);
}

export async function getEssay(slug: string) {
  return await import(`../content/essays/${slug}.mdx`);
}

export async function getAllEssays(): Promise<Essay[]> {
  const essays = await Promise.all(
    getEssaySlugs().map(async (slug) => {
      const { metadata } = await getEssay(slug);
      return { slug, ...metadata };
    }),
  );

  return essays.sort((a, b) => b.date.localeCompare(a.date));
}

export type EssayHeading = {
  /** The `id` `rehype-slug` gives this heading in the rendered page. */
  id: string;
  text: string;
  /** Level-three headings sitting under this level-two heading. */
  children: { id: string; text: string }[];
};

/** Drops inline Markdown, leaving the words a reader would actually see. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .trim();
}

/**
 * The level-two and level-three headings of an essay, read back out of the
 * source. `rehype-slug` derives ids from the same text with the same slugger.
 */
export function getEssayHeadings(slug: string): EssayHeading[] {
  if (!hasEssay(slug)) return [];

  const source = fs.readFileSync(
    path.join(essaysDirectory, `${slug}.mdx`),
    "utf8",
  );

  // `rehype-slug` numbers repeated slugs in document order, so every heading has
  // to pass through the slugger — not only the ones the tree displays — or the
  // two would disagree from the first duplicate onwards.
  const slugger = new GithubSlugger();
  const sections: EssayHeading[] = [];
  let fence: { character: string; length: number } | null = null;

  for (const line of source.split(/\r?\n/)) {
    // A fence closes only on the same character, at least as long as the one
    // that opened it — which is how the reference essay nests a three-backtick
    // block inside a four-backtick one.
    const delimiter = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (delimiter) {
      const marker = delimiter[1];
      if (!fence) {
        fence = { character: marker[0], length: marker.length };
      } else if (
        marker[0] === fence.character &&
        marker.length >= fence.length &&
        delimiter[2].trim() === ""
      ) {
        fence = null;
      }
      continue;
    }
    if (fence) continue;

    // Fences are skipped above, so the reference essay's examples of heading
    // syntax don't turn into table-of-contents entries.
    const heading = /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/.exec(line);
    if (!heading) continue;

    const text = toPlainText(heading[2]);
    const id = slugger.slug(text);
    const depth = heading[1].length;

    if (depth === 2) {
      sections.push({ id, text, children: [] });
    } else if (depth === 3) {
      const parent = sections[sections.length - 1];
      if (parent) parent.children.push({ id, text });
      else sections.push({ id, text, children: [] });
    }
  }

  return sections;
}