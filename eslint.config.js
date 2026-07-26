/**
 * ESLint flat config — two guards that keep styling inside the design system:
 *
 *  1. No hardcoded color literals (hex, rgb()/rgba(), hsl()/hsla()) in the
 *     app's React sources.
 *  2. No inline `style={{…}}` props in page/section/shared-component/content
 *     sources — Subframe and Tailwind's scanner only understand utility
 *     classes, so styling must be expressed as design-token classes.
 *
 * All raw color values must live in the design-token sheet (design-tokens.ts
 * at the repo root, imported by tailwind.config.ts, which re-emits every
 * token as a :root CSS variable); components reference them via Tailwind
 * token classes or `var(--…)`.
 * This catches both arbitrary Tailwind colors like
 * `bg-[#999999]` and inline styles like `style={{ color: "#000" }}`,
 * because both are string literals (or template chunks) in the .tsx source.
 *
 * content/** is also linted, because content/timeline.tsx JSX ends up in the
 * prerendered homepage HTML. content/site.config.ts is exempt: its `colors`
 * block is metadata-generation reference (e.g. the themeColor meta tag
 * requires a literal), not rendered styling.
 *
 * client/src/components/ui/** (shadcn/radix vendor components) is exempt.
 *
 * Run with `npm run lint`; also a blocking step of `npm run build`
 * (see script/build.ts).
 */
import tsParser from "@typescript-eslint/parser";

// 3-, 4-, 6- or 8-digit hex color. Word boundaries keep anchors like
// "#contact" from matching (they contain non-hex letters).
const HEX = "#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-zA-Z])";
// rgb()/rgba() always forbidden; hsl()/hsla() forbidden unless wrapping a
// CSS variable. Tokens now hold full color values, so plain var(--token) is
// the sanctioned reference; hsl(var(--…)) stays allowed for compatibility.
const FUNC = "(?:rgba?\\(|hsla?\\((?!\\s*var\\())";

const noHardcodedColors = [
  "error",
  {
    selector: `Literal[value=/${HEX}/]`,
    message: "Hardcoded hex color — use a token class or var(--…) from the design-tokens.ts token sheet instead.",
  },
  {
    selector: `TemplateElement[value.raw=/${HEX}/]`,
    message: "Hardcoded hex color in template literal — use a token class or var(--…) from the design-tokens.ts token sheet instead.",
  },
  {
    selector: `Literal[value=/${FUNC}/]`,
    message: "Literal rgb()/rgba()/hsl() color — use var(--…) tokens from the design-tokens.ts token sheet instead.",
  },
  {
    selector: `TemplateElement[value.raw=/${FUNC}/]`,
    message: "Literal rgb()/rgba()/hsl() color in template literal — use var(--…) tokens from the design-tokens.ts token sheet instead.",
  },
];

/* Inline-style ban for page/section/shared-component/content code. A later
 * flat-config block REPLACES (does not merge) a rule's options, so this list
 * re-includes the color selectors above plus the style-prop selector.
 * Escape hatch for irreducibly dynamic values: an explicit
 *   // eslint-disable-next-line no-restricted-syntax -- <reason>
 * at the call site. Documented exceptions today:
 *   - client/src/sections/home/team-slider.tsx — TeamSlider orbit thumbs:
 *     the per-thumb angle rides a --thumb-angle CSS variable consumed by a
 *     static [transform:…] class.
 *   - client/src/sections/design/typography.tsx + spacing.tsx — type-scale
 *     & spacing-scale previews: font metrics / bar widths render the
 *     design-token data tables.
 */
const noInlineStyles = [
  ...noHardcodedColors,
  {
    selector: 'JSXAttribute[name.name="style"]',
    message:
      "Inline style prop — use Tailwind token classes (for dynamic values, drive a static class with a CSS variable; eslint-disable with a reason only if irreducibly dynamic).",
  },
];

export default [
  {
    files: [
      "client/src/**/*.ts",
      "client/src/**/*.tsx",
      "content/**/*.ts",
      "content/**/*.tsx",
    ],
    ignores: ["client/src/components/ui/**", "content/site.config.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-restricted-syntax": noHardcodedColors,
    },
  },
  {
    files: [
      "client/src/pages/**/*.tsx",
      "client/src/sections/**/*.tsx",
      "client/src/components/**/*.tsx",
      "content/**/*.tsx",
    ],
    ignores: ["client/src/components/ui/**"],
    rules: {
      "no-restricted-syntax": noInlineStyles,
    },
  },
];
