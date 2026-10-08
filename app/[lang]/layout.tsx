import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { ThemeScript } from "../theme-script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Source Han Sans, under the name Google ships it. The family is cut into
// unicode-range slices and a browser fetches only the ones a page actually
// draws, so what it costs a reader has nothing to do with what it costs the
// build. It sits second in the font stack in `globals.css`: Latin characters
// are taken by Inter, everything Chinese falls through to this.
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  // A plain title, with no template: pages that set their own — the notes, the
  // 404 — then show exactly what they say, and the rest fall back to this.
  return { title: getDictionary(lang).meta.title };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${notoSansSC.variable} h-full antialiased`}
      // The script below writes `data-theme` on this element before React
      // hydrates, so the DOM and the payload disagree on purpose. This tells
      // React to keep the DOM — which holds the reader's choice — rather than
      // warn and rebuild from the payload, which would drop it.
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        {/* Applies a theme the reader chose on an earlier visit. It has to run
            before the first paint, so it goes into the document the server
            writes rather than into the tree React renders — see the component
            for why. */}
        <ThemeScript />
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-6">
          <main className="flex-1 pt-14 pb-24">{children}</main>
        </div>
      </body>
    </html>
  );
}
