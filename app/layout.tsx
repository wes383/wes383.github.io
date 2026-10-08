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
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      // The script below writes `data-theme` on this element before React
      // hydrates, so the DOM and the payload disagree on purpose. This tells
      // React to keep the DOM — which holds the reader's choice — rather than
      // warn and rebuild from the payload, which would drop it.
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        {/* Applies a theme the reader chose on an earlier visit. It has to run
            before the first paint — as the first thing in the body, it does —
            or the page would render the system's scheme and then switch.
            Storage access can throw where it is blocked, hence the try. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}',
          }}
        />
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-6">
          <main className="flex-1 pt-14 pb-24">{children}</main>
        </div>
      </body>
    </html>
  );
}