/**
 * ESLint flat config — single purpose: forbid hardcoded color literals
 * (hex, rgb()/rgba(), hsl()/hsla()) in the app's React sources.
 *
 * All raw color values must live in the token sheet (client/src/index.css);
 * components reference them via Tailwind token classes or `var(--…)` /
 * `hsl(var(--…))`. This catches both arbitrary Tailwind colors like
 * `bg-[#999999]` and inline styles like `style={{ color: "#000" }}`,
 * because both are string literals (or template chunks) in the .tsx source.
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
// CSS variable — hsl(var(--token)) is the sanctioned token reference.
const FUNC = "(?:rgba?\\(|hsla?\\((?!\\s*var\\())";

const noHardcodedColors = [
  "error",
  {
    selector: `Literal[value=/${HEX}/]`,
    message: "Hardcoded hex color — use a token class or var(--…) from client/src/index.css instead.",
  },
  {
    selector: `TemplateElement[value.raw=/${HEX}/]`,
    message: "Hardcoded hex color in template literal — use a token class or var(--…) from client/src/index.css instead.",
  },
  {
    selector: `Literal[value=/${FUNC}/]`,
    message: "Literal rgb()/rgba()/hsl() color — use var(--…) or hsl(var(--…)) tokens from client/src/index.css instead.",
  },
  {
    selector: `TemplateElement[value.raw=/${FUNC}/]`,
    message: "Literal rgb()/rgba()/hsl() color in template literal — use var(--…) or hsl(var(--…)) tokens from client/src/index.css instead.",
  },
];

export default [
  {
    files: ["client/src/**/*.ts", "client/src/**/*.tsx"],
    ignores: ["client/src/components/ui/**"],
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
