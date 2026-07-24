/**
 * Design token table: token name → CSS color reference.
 * Every literal color value lives in tailwind.config.ts (the design-token
 * sheet), which re-emits each token as a :root CSS variable; the hex codes
 * displayed on the /design page are resolved at runtime from the computed
 * styles (the page is client-only, never prerendered), so no color literal
 * appears in these source files.
 */
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

/** Resolve a CSS color reference to its computed value via a probe element. */
function computeCssColor(ref: string): string {
  const el = document.createElement("span");
  el.style.color = ref;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);
  return computed;
}

/** Opaque computed colors become uppercase hex text; alpha colors keep their functional notation (spaces stripped). */
function formatColorText(computed: string): string {
  const m = computed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (m) {
    return (
      "#" +
      m.slice(1, 4)
        .map((n) => Number(n).toString(16).padStart(2, "0").toUpperCase())
        .join("")
    );
  }
  return computed.replace(/\s+/g, "");
}

export function resolveTokenTexts(): TokenText {
  const out = {} as Record<TokenName, string>;
  for (const name of Object.keys(tokenRefs) as TokenName[]) {
    out[name] = typeof document === "undefined" ? "" : formatColorText(computeCssColor(tokenRefs[name]));
  }
  return out;
}
