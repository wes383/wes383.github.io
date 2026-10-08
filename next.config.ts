import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    // Turbopack requires plugins to be referenced by name (as strings), and
    // their options must be serializable — functions can't cross into Rust.
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: [
      // Runs first so heading ids are derived from the heading's own text,
      // before KaTeX rewrites any math inside it into rendered markup.
      "rehype-slug",
      "rehype-katex",
      [
        "rehype-pretty-code",
        {
          // Both themes are emitted as CSS variables on each token and the
          // theme names land in `data-theme`; `globals.css` switches between
          // them with the same colour-scheme query as the rest of the site.
          // Backgrounds stay off so a code block keeps its own.
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);