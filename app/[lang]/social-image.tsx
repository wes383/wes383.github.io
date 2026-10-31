import { ImageResponse } from "next/og";

/**
 * The card a shared link turns into. It is written in Latin letters on purpose:
 * the site's own text is set in fonts it ships, but `ImageResponse` draws with
 * the one font it carries, which has no Chinese glyphs — a Chinese title would
 * arrive as empty boxes. The note's own title and summary travel in the
 * metadata beside the image, so the card still says which note it is.
 */
export const socialImageAlt =
  "Wes Wei — notes on history, technology, and why things are the way they are.";

export const socialImageSize = { width: 1200, height: 630 };

export const socialImageContentType = "image/png";

export function SocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#fafafa",
          color: "#171717",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 8,
            color: "#737373",
          }}
        >
          WES WEI
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              letterSpacing: -5,
              lineHeight: 1,
            }}
          >
            Notes
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#737373",
            }}
          >
            On history, technology, and why things work the way they do.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#737373",
          }}
        >
          <div style={{ display: "flex" }}>weswei.wesluma.com</div>
          <div style={{ display: "flex" }}>Essays and notes</div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
