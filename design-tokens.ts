/**
 * design-tokens.ts — the design-token sheet: single source of truth for every
 * color the site uses. Each value is a full, directly usable color
 * (hex / hsl / rgba), so the theme can be imported as-is by design tools
 * (e.g. Subframe's "Import your theme" pointed at tailwind.config.ts) and
 * Tailwind's opacity modifiers keep working: `border-border/50` still
 * renders hsl(0 0% 90% / 0.5), exactly as before.
 *
 * Two consumers import this file:
 *   1. tailwind.config.ts — builds the Tailwind `colors` theme and re-emits
 *      every token as a :root CSS custom property (--gray-450, …) via an
 *      inline plugin, so inline `var(--…)` styles share the exact values.
 *   2. client/src/sections/design/tokens.ts — the /design page renders each
 *      token's value as text. Those texts resolve statically from the
 *      literals below (see tokenVarText), so the build-time prerender of
 *      /design contains the real values with no getComputedStyle involved,
 *      and the browser re-render is byte-identical.
 *
 * This file lives at the repo root on purpose: the ESLint hardcoded-color
 * guard bans color literals inside client/src and content/ — the token sheet
 * is the one sanctioned home for them, importable by both the Tailwind
 * (Node) and client (browser) sides.
 *
 * Value provenance — these near-misses are deliberate; verify computed values
 * before "normalizing" anything (see docs/design-tokens.md):
 *   --border      hsl(0 0% 90%)  computes #E6E6E6 — NOT gray-100 #E5E5E5
 *   --destructive hsl(0 72% 51%) computes #DC2828 — NOT red-600 #DC2626
 *
 * Gray scale: 50…900 ordered light → dark; the in-between stops (225, 250,
 * 350, 450, 550) preserve historical brand values exactly (they replaced the
 * old hex-encoded names --gray-c0, --gray-bb, --gray-94, --gray-76, --gray-59).
 */

export type TokenGroup = Record<string, string>;
export type TokenTree = Record<string, string | TokenGroup>;

export const tokens = {
  /* — Semantic (shadcn) tokens. hsl notation preserved from the historical
       triplet wiring so computed values stay bit-identical. — */
  background: "hsl(0 0% 100%)", // #FFFFFF
  foreground: "hsl(0 0% 0%)", // #000000
  border: "hsl(0 0% 90%)", // #E6E6E6 — deliberately ≠ gray-100 (#E5E5E5)
  input: "hsl(0 0% 80%)", // #CCCCCC (same value as gray-200)
  ring: "hsl(0 0% 0%)", // #000000
  card: {
    DEFAULT: "hsl(0 0% 96%)", // #F5F5F5 (same value as gray-50)
    foreground: "hsl(0 0% 0%)",
    border: "hsl(0 0% 90%)",
  },
  popover: {
    DEFAULT: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 0%)",
    border: "hsl(0 0% 90%)",
  },
  primary: {
    DEFAULT: "hsl(0 0% 0%)",
    foreground: "hsl(0 0% 100%)",
  },
  secondary: {
    DEFAULT: "hsl(0 0% 96%)",
    foreground: "hsl(0 0% 0%)",
  },
  muted: {
    DEFAULT: "hsl(0 0% 94%)", // #F0F0F0
    foreground: "hsl(0 0% 40%)", // #666666 (same value as gray-500)
  },
  accent: {
    DEFAULT: "hsl(0 0% 96%)",
    foreground: "hsl(0 0% 0%)",
  },
  destructive: {
    DEFAULT: "hsl(0 72% 51%)", // #DC2828 — deliberately ≠ red-600 (#DC2626)
    foreground: "hsl(0 0% 98%)", // #FAFAFA
  },
  /* — Brand grayscale, ordered by lightness (50 lightest → 900 darkest).
       In-between stops keep exact historical values; see docs/design-tokens.md
       for the old-name mapping table. — */
  gray: {
    "50": "#F5F5F5", // card surfaces (same value as card)
    "100": "#E5E5E5", // hairline borders on cards (was --gray-e5)
    "200": "#CCCCCC", // form input borders (same value as input)
    "225": "#C0C0C0", // About-section borders (was --gray-c0, "silver")
    "250": "#BBBBBB", // footer version text (was --gray-bb)
    "300": "#999999", // brand primary: decorative fills (was --gray-99)
    "350": "#949494", // text on dark: labels, credits, 4.7:1 (was --gray-94)
    "400": "#777777", // service-card numbers (was --gray-77)
    "450": "#767676", // decorative text on white, 4.6:1 (was --gray-76)
    "500": "#666666", // body text on white, 5.74:1 (same value as muted-foreground)
    "550": "#595959", // small badge text, 7:1 (was --gray-59)
    "600": "#444444", // secondary dark text (was --gray-44)
    "700": "#333333", // dark text/surfaces (was --gray-33)
    "800": "#1A1A1A", // near-black surfaces (was --gray-1a)
    "900": "#000000", // brand accent: headings, buttons (same value as foreground)
  },

  /* — Brand accents — */
  red: {
    "600": "#DC2626", // form validation errors (was --red-dc; equals Tailwind's default red-600)
  },
  "accent-yellow": "#E8E020", // stats suffixes, engagement outcome badges

  /* — Alpha tokens: translucent text/borders over dark surfaces (white-alpha)
       and soft shadows/overlays on light surfaces (black-alpha). — */
  "white-alpha": {
    "85": "rgba(255,255,255,0.85)",
    "50": "rgba(255,255,255,0.5)",
    "25": "rgba(255,255,255,0.25)",
    "08": "rgba(255,255,255,0.08)",
  },
  "black-alpha": {
    "10": "rgba(0,0,0,0.10)",
    "08": "rgba(0,0,0,0.08)",
    "06": "rgba(0,0,0,0.06)",
    "04": "rgba(0,0,0,0.04)",
    "02": "rgba(0,0,0,0.02)",
  },
} satisfies TokenTree;

/** Flatten the token tree into `--name[-key]` CSS custom properties. */
export function tokenCssVars(tree: TokenTree): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [name, value] of Object.entries(tree)) {
    if (typeof value === "string") {
      vars[`--${name}`] = value;
    } else {
      for (const [key, subValue] of Object.entries(value)) {
        vars[key === "DEFAULT" ? `--${name}` : `--${name}-${key}`] = subValue;
      }
    }
  }
  return vars;
}

// Flattened sheet: "--gray-50" → "#F5F5F5", "--accent-yellow" → "#E8E020", …
const varValues: Record<string, string> = tokenCssVars(tokens);

/**
 * hsl(H S% L%) → #RRGGBB using the same rounding browsers apply when
 * computing styles (Math.round on the 0–255 channel), so static texts match
 * what getComputedStyle used to report: hsl(0 0% 90%) → #E6E6E6.
 */
function hslToHex(h: number, s: number, l: number): string {
  const S = s / 100;
  const L = l / 100;
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = L - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Opaque literals become uppercase hex text; alpha colors keep their functional notation (spaces stripped). */
function formatColorText(literal: string): string {
  if (literal.startsWith("#")) return literal.toUpperCase();
  const hsl = literal.match(/^hsl\(\s*([\d.]+)[ ,]+([\d.]+)%[ ,]+([\d.]+)%\s*\)$/);
  if (hsl) return hslToHex(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]));
  return literal.replace(/\s+/g, "");
}

/**
 * Display text for a CSS token reference like "var(--gray-50)", resolved
 * statically from the sheet above. Throws on unknown tokens so a renamed or
 * deleted token fails the build loudly instead of rendering an empty value
 * on the /design page.
 */
export function tokenVarText(ref: string): string {
  const m = ref.match(/^var\((--[a-z0-9-]+)\)$/i);
  const literal = m ? varValues[m[1]] : undefined;
  if (!literal) {
    throw new Error(`design-tokens: unknown token reference "${ref}" — check the sheet in design-tokens.ts`);
  }
  return formatColorText(literal);
}
