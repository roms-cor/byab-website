/**
 * ESLint flat config — single purpose: forbid hardcoded color literals
 * (hex, rgb()/rgba(), hsl()/hsla()) in the app's React sources.
 *
 * All raw color values must live in the design-token sheet
 * (tailwind.config.ts), which re-emits every token as a :root CSS variable;
 * components reference them via Tailwind token classes or `var(--…)`.
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
    message: "Hardcoded hex color — use a token class or var(--…) from the tailwind.config.ts token sheet instead.",
  },
  {
    selector: `TemplateElement[value.raw=/${HEX}/]`,
    message: "Hardcoded hex color in template literal — use a token class or var(--…) from the tailwind.config.ts token sheet instead.",
  },
  {
    selector: `Literal[value=/${FUNC}/]`,
    message: "Literal rgb()/rgba()/hsl() color — use var(--…) tokens from the tailwind.config.ts token sheet instead.",
  },
  {
    selector: `TemplateElement[value.raw=/${FUNC}/]`,
    message: "Literal rgb()/rgba()/hsl() color in template literal — use var(--…) tokens from the tailwind.config.ts token sheet instead.",
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
];
