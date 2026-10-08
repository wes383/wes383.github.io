declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const metadata: {
    title: string;
    date: string;
    summary?: string;
  };

  const MDXComponent: ComponentType<{
    components?: Record<string, unknown>;
  }>;

  export default MDXComponent;
}