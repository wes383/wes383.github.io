"use client";

import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Copy = {
  /** What the slider controls. */
  label: string;
  /** The reading order while the tablet still stands the way it was written. */
  upright: string;
  /** …and once it has been knocked over. */
  turned: string;
  caption: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    label: "Rotation",
    upright: "Columns, read downwards, running right to left",
    turned: "Rows, read left to right, running downwards",
    caption:
      "Eight signs: water, sky, house, mountain, sun, mouth, tree, barley. Most of the characters in Unicode's cuneiform block go back to early picture signs, and many of them really were rotated as a whole when the direction of writing changed. What a font draws now, though, is not simply the rotated picture: the shapes have also been simplified, and cut down to wedges, over a long time.",
  },
  zh: {
    label: "旋转",
    upright: "竖行，自上而下，各行自右而左",
    turned: "横行，自左而右，各行自上而下",
    caption:
      "八个符号的含义分别为：水、天空、房屋、山、太阳、嘴、树、大麦。这里的 Unicode 符号大多可以追溯到早期图画符号；早期书写方向改变时，它们中的许多确实发生了整体旋转。但现在的字形不只是“旋转后的原图”，还经过了长期的简化和楔形化。",
  },
};

/**
 * The site's one slider, drawn like the buttons that switch direction in the
 * other figure: a rounded bar in the page colour, which lifts off the figure's
 * `bg-hover-bg` fill, with a knob in the inverted foreground. As a hairline with
 * a dot on it, it stayed too close to a rule of text to read as something to
 * drag.
 */
const SLIDER = [
  "mt-2 h-4 w-full cursor-pointer appearance-none bg-transparent",
  "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-background",
  "[&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground",
  "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-background",
  "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground",
].join(" ");

/** Past halfway the tablet has plainly turned over, and the text says so. */
const TURNED = 45;

/**
 * Eight signs of early cuneiform, taken from the Unicode block rather than drawn
 * by hand. Each carries a quarter turn of its own, and that is the point: the
 * glyph in a sign list — and so in the font — is the *late* form, already lying
 * on its back, which is how the script ended up. Turning each one 90 degrees
 * clockwise at rest, and letting the figure's own rotation unwind it, is what
 * stands the picture up at 0 degrees and drops it into the sign list's own
 * position at 90.
 *
 * They sit in the order a scribe read them: down the right-hand column first.
 *
 * `ink` is each sign's own drawn width in font units, read out of the subset in
 * `public/fonts`. It has to be here because the signs are nowhere near the same
 * size: KA is 1639 units wide and GIS 645, so anchor points on an even grid give
 * gaps that vary threefold. Every sign is scaled to one common width instead, so
 * the spacing stays even and each sign keeps its own proportions.
 */
const SIGNS: { x: number; y: number; sign: string; ink: number }[] = [
  { x: 72, y: 14, sign: "𒀀", ink: 527 }, // A — water
  { x: 72, y: 38, sign: "𒀭", ink: 848 }, // AN — sky, star, god
  { x: 72, y: 62, sign: "𒂍", ink: 1041 }, // E2 — house
  { x: 72, y: 86, sign: "𒆳", ink: 697 }, // KUR — mountain
  { x: 28, y: 14, sign: "𒌓", ink: 849 }, // UD — sun
  { x: 28, y: 38, sign: "𒅗", ink: 1639 }, // KA — mouth
  { x: 28, y: 62, sign: "𒄑", ink: 645 }, // GIS — tree, wood
  { x: 28, y: 86, sign: "𒊺", ink: 703 }, // SE — barley
];

/** What the signs are set at, and the unit the `ink` widths are measured in. */
const FONT_SIZE = 18;
const UNITS_PER_EM = 1000;

/** The width every sign is brought to, against a 24-unit pitch. */
const SIGN_WIDTH = 16;

/**
 * The quarter turn that turned cuneiform on its side, on a slider.
 *
 * The signs and the arrow that marks the reading order are one picture, rotated
 * together: an arrow drawn down the first column swings round to point along the
 * first row, which is exactly what happened to the script. The square stage and
 * the inset square inside it are what let the turn happen without the drawing
 * spilling out of its box — a square of 1/√2 fits inside its own outline at every
 * angle, so the picture is widest at the two ends and never clipped between them.
 */
export function TabletRotation({ lang }: { lang: Locale }) {
  const copy = COPY[lang];
  const id = useId();
  const [angle, setAngle] = useState(0);

  return (
    // The one surface on the page that is not text: a reader has to be able to
    // tell at a glance that the tablet under it can be moved. It takes the same
    // fill and radius as a code block, which is the site's only other non-text
    // surface.
    <figure className="my-8 rounded-xl bg-hover-bg p-5">
      <div className="relative mx-auto aspect-square w-full max-w-56">
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="absolute inset-[15%] text-foreground"
          style={{
            transform: `rotate(${-angle}deg)`,
            // The subset in `globals.css` first; a platform that happens to have
            // its own cuneiform font is only a fallback behind it.
            fontFamily: '"Noto Sans Cuneiform", "Segoe UI Historic", sans-serif',
          }}
        >
          {SIGNS.map((sign) => {
            // Everything is measured in the font's own units, so the scale that
            // brings this sign to the common width is a single division.
            const scale =
              SIGN_WIDTH / ((sign.ink / UNITS_PER_EM) * FONT_SIZE);

            return (
              <text
                key={sign.sign}
                x={sign.x}
                y={sign.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={FONT_SIZE}
                fill="currentColor"
                // Scale about the sign's own slot, then the quarter turn that
                // the figure's rotation will unwind. Keeping the scale uniform
                // leaves the sign's proportions alone — only its size changes.
                transform={`translate(${sign.x} ${sign.y}) rotate(90) scale(${scale.toFixed(3)}) translate(${-sign.x} ${-sign.y})`}
              >
                {sign.sign}
              </text>
            );
          })}
          {/* The reading order, in the margin beside the first column. */}
          <g
            className="text-foreground-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M90 6V94" />
            <path d="M86 88l4 6 4-6" />
          </g>
        </svg>
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs text-foreground-muted">
          {copy.label}
        </label>
        {/* Tabular figures, so the number doesn't jitter as the dot is dragged. */}
        <span className="text-xs tabular-nums text-foreground-muted">
          {angle}°
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={90}
        step={1}
        value={angle}
        onChange={(event) => setAngle(event.target.valueAsNumber)}
        className={SLIDER}
      />

      {/* No rule under the slider: the answer belongs to the control above it,
          and sits close enough that it reads as its result without one. */}
      <div className="mt-6 text-sm leading-6">
        {angle < TURNED ? copy.upright : copy.turned}
      </div>

      <figcaption className="mt-5 text-xs leading-6 text-foreground-muted">
        {copy.caption}
      </figcaption>
    </figure>
  );
}
