/**
 * Design token table: token name → CSS color reference.
 * Every literal color value lives in design-tokens.ts at the repo root (the
 * design-token sheet, imported by tailwind.config.ts, which re-emits each
 * token as a :root CSS variable). The values displayed on the /design page
 * resolve statically from those literals — no getComputedStyle — so the
 * build-time prerender of /design contains the real values and the browser
 * re-render is identical. No color literal appears in these source files.
 */
import { tokenVarText } from "../../../../design-tokens";

export const tokenRefs = {
  gray50: "var(--gray-50)",
  gray100: "var(--gray-100)",
  gray200: "var(--gray-200)",
  gray225: "var(--gray-225)",
  gray250: "var(--gray-250)",
  gray300: "var(--gray-300)",
  gray350: "var(--gray-350)",
  gray400: "var(--gray-400)",
  gray450: "var(--gray-450)",
  gray500: "var(--gray-500)",
  gray550: "var(--gray-550)",
  gray600: "var(--gray-600)",
  gray700: "var(--gray-700)",
  gray800: "var(--gray-800)",
  gray900: "var(--gray-900)",
  white: "var(--background)",
  yellow: "var(--accent-yellow)",
  whiteA85: "var(--white-alpha-85)",
  whiteA50: "var(--white-alpha-50)",
  whiteA25: "var(--white-alpha-25)",
} as const;

export type TokenName = keyof typeof tokenRefs;
export type TokenText = Record<TokenName, string>;

/**
 * Token display texts, resolved statically from the design-token sheet:
 * opaque colors as uppercase hex, alpha colors in functional notation —
 * exactly the strings the old getComputedStyle probe produced at runtime.
 */
export function resolveTokenTexts(): TokenText {
  const out = {} as Record<TokenName, string>;
  for (const name of Object.keys(tokenRefs) as TokenName[]) {
    out[name] = tokenVarText(tokenRefs[name]);
  }
  return out;
}
