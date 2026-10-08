import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // A plain title, with no template: pages that set their own — the essays, the
  // 404 — then show exactly what they say, and the rest fall back to this.
  title: "Home",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-6">
          <main className="flex-1 pt-14 pb-24">{children}</main>
        </div>
      </body>
    </html>
  );
}