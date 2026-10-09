"use client";

import { useState, type CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";

const MODES = [
  "ltr",
  "rtl",
  "verticalRight",
  "verticalLeft",
  "boustrophedon",
] as const;

type Mode = (typeof MODES)[number];

/**
 * One sample per direction, each written in a script that goes that way: English,
 * Hebrew, Chinese, Mongolian, Greek. The cuts are hand-made because the
 * boustrophedon mode has to give every other line its own direction, which the
 * browser's own line breaking cannot do. The samples do not follow the reader's
 * language: what the figure shows is the scripts themselves.
 */
const SAMPLES: Record<Mode, { lines: string[]; font?: string }> = {
  ltr: { lines: ["English runs", "left to right."] },
  rtl: { lines: ["עברית נכתבת", "מימין לשמאל."] },
  verticalRight: { lines: ["漢字自上而下，", "換行從右往左。"] },
  verticalLeft: {
    // The script's own name, Mongol bichig. Few systems have a Mongolian font,
    // so this one is shipped with the site and registered in `app/globals.css`.
    lines: ["ᠮᠣᠩᠭᠣᠯ", "ᠪᠢᠴᠢᠭ"],
    font: '"Noto Sans Mongolian", sans-serif',
  },
  // Three meaningful Greek maxims, in capitals as an inscription would use. The
  // lines are deliberately close in length, and each contains asymmetric
  // letters for the mirror demo.
  boustrophedon: {
    lines: ["ΓΝΩΘΙ ΣΕΑΥΤΟΝ", "ΠΡΑΤΤΕ ΚΑΛΩΣ", "ΜΗΔΕΝ ΑΓΑΝ"],
  },
};

type Copy = {
  /** What each layout is, in the reader's terms. */
  labels: Record<Mode, string>;
  /** Which scripts use it, what the sample says, and anything else worth saying. */
  notes: Record<Mode, string>;
};

const COPY: Record<Locale, Copy> = {
  en: {
    labels: {
      ltr: "Rows, L→R",
      rtl: "Rows, R→L",
      verticalRight: "Columns, R→L",
      verticalLeft: "Columns, L→R",
      boustrophedon: "Boustrophedon",
    },
    notes: {
      ltr: "Rows, left to right — English, and the paragraph you are reading. The sample is a sentence of English.",
      rtl: "Rows, right to left — Hebrew and Arabic. The sample, in Hebrew, says that Hebrew is written right to left.",
      verticalRight:
        "Columns beginning on the right — Chinese, Japanese and Korean. The sample, in Chinese, says that characters run downwards and that the line turns to the left.",
      verticalLeft:
        "Columns beginning on the left — traditional Mongolian, the only vertical family that runs this way. The sample is the script's own name, Mongol bichig.",
      boustrophedon:
        "Boustrophedon — the direction flips at the end of every row. The three lines read ΓΝΩΘΙ ΣΕΑΥΤΟΝ, ΠΡΑΤΤΕ ΚΑΛΩΣ, ΜΗΔΕΝ ΑΓΑΝ: “know yourself; act well; nothing in excess.”",
    },
  },
  zh: {
    labels: {
      ltr: "横排，左→右",
      rtl: "横排，右→左",
      verticalRight: "竖排，右→左",
      verticalLeft: "竖排，左→右",
      boustrophedon: "牛耕式",
    },
    notes: {
      ltr: "横排，自左而右——英文，也就是你现在读的这一段。示例是一句英文。",
      rtl: "横排，自右而左——希伯来文、阿拉伯文。示例是一句希伯来文，说的是：希伯来文从右往左写。",
      verticalRight:
        "竖排，列自右而左——汉文、日文、韩文。示例是一句繁体中文，说的是：汉字自上而下，换行从右往左。",
      verticalLeft:
        "竖排，列自左而右——传统蒙古文，竖写文字里唯一这样换行的一支。示例是这套文字自己的名字，Mongol bichig。",
      boustrophedon:
        "牛耕式——每写到行尾就调头。示例为三行希腊短句：ΓΝΩΘΙ ΣΕΑΥΤΟΝ（认识你自己）、ΠΡΑΤΤΕ ΚΑΛΩΣ（行动良善）、ΜΗΔΕΝ ΑΓΑΝ（凡事勿过度）。",
    },
  },
};

/**
 * The layout of each mode. `direction` is the inline axis, which in a vertical
 * writing mode runs down the page, so "ltr" is the top-to-bottom flow that CJK
 * and Mongolian share; which side the first column lands on is the writing mode's
 * own doing, and is the whole difference between the two.
 */
const LAYOUT: Record<Mode, CSSProperties> = {
  ltr: { direction: "ltr", textAlign: "left" },
  rtl: { direction: "rtl", textAlign: "right" },
  verticalRight: { writingMode: "vertical-rl", direction: "ltr" },
  verticalLeft: { writingMode: "vertical-lr", direction: "ltr" },
  // An ox-plough line starts the way the script it is written in does; the
  // alternation is what makes it boustrophedon. The measure is the sample's own
  // width rather than the column's: a plough only reads as one when the returning
  // line begins where the outgoing line stopped, and two short words pushed to
  // opposite margins say nothing at all.
  boustrophedon: {
    direction: "ltr",
    textAlign: "left",
    width: "fit-content",
    marginInline: "auto",
  },
};

/**
 * The first and third rows are ordinary left-to-right text. The return row is
 * kept in its normal logical order, placed at the right edge, and mirrored as
 * one inline box. Mirroring the whole row (rather than reversing the string)
 * makes the letters themselves face the return direction as well.
 */
const ALTERNATING: CSSProperties[] = [
  { direction: "ltr", textAlign: "left" },
  { direction: "ltr", textAlign: "right" },
];

const MIRRORED_RETURN: CSSProperties = {
  display: "inline-block",
  direction: "ltr",
  unicodeBidi: "normal",
  transform: "scaleX(-1)",
  transformOrigin: "center center",
};

/**
 * The control that switches the sample's direction. It departs from the rest of
 * the site, where a control is plain text that only declares itself on hover:
 * five bare labels under a figure read as a caption, and nothing says they can
 * be pressed until the pointer is already over one. Each button therefore
 * carries a rounded rectangle in the page colour, which lifts off the figure's
 * `bg-hover-bg` fill, and the chosen one is inverted — the same reversal as the
 * checked task box and the selection.
 */
const CHOICE =
  "inline-flex cursor-pointer items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors";
const CHOSEN = "bg-foreground text-background";
const UNCHOSEN = "bg-background text-foreground-muted hover:text-foreground";

/**
 * Five scripts, each laid out the way it goes: as rows either way, as columns
 * either way, and as the ox-plough that alternates between the two.
 *
 * The lines are separate blocks rather than one wrapped paragraph. That is what
 * lets the boustrophedon mode give every other line its own direction, and it is
 * also what makes the two vertical modes differ: stacked blocks become columns,
 * and which side the first one lands on is the writing mode deciding.
 */
export function DirectionSwitch({ lang }: { lang: Locale }) {
  const copy = COPY[lang];
  const [mode, setMode] = useState<Mode>("ltr");
  const sample = SAMPLES[mode];

  return (
    // The one surface on the page that is not text: a reader has to be able to
    // tell at a glance that the script under it can be rearranged. It takes the
    // same fill and radius as a code block, which is the site's only other
    // non-text surface.
    <figure className="my-8 rounded-xl bg-hover-bg p-5">
      {/* A fixed height, so the script never moves the buttons under it: as rows
          the samples use multiple lines, as columns they need the height one line
          of the longest of them would take. */}
      <div className="flex h-48 items-center">
        <div
          className="w-full text-sm leading-7"
          style={{
            ...LAYOUT[mode],
            ...(sample.font ? { fontFamily: sample.font } : null),
          }}
        >
          {sample.lines.map((line, index) => (
            <span
              key={line}
              // A line is never allowed to wrap: in a vertical writing mode a
              // wrapped line would quietly become two columns.
              className="block whitespace-nowrap"
              style={mode === "boustrophedon" ? ALTERNATING[index % 2] : undefined}
            >
              <span
                style={
                  mode === "boustrophedon" && index % 2 === 1
                    ? MIRRORED_RETURN
                    : undefined
                }
              >
                {line}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {MODES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === mode}
            onClick={() => setMode(option)}
            className={[CHOICE, option === mode ? CHOSEN : UNCHOSEN].join(" ")}
          >
            {copy.labels[option]}
          </button>
        ))}
      </div>

      {/* A hairline rather than a gap: the note belongs to the layout above it,
          and the fill is too slight for spacing alone to say so. It is a shade
          darker than the table grid, which sits on white. */}
      <div className="mt-4 border-t border-foreground-muted/20 pt-4 text-sm leading-6">
        {copy.notes[mode]}
      </div>
    </figure>
  );
}
