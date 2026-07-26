import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { tokens, tokenCssVars } from "./design-tokens";

/**
 * Tailwind theme wired to the design-token sheet (design-tokens.ts — the
 * single source of truth for every color literal; see its header for the
 * value-provenance notes). Design tools importing the theme (e.g. Subframe's
 * "Import your theme") point at this file and see full color values.
 *
 * The inline plugin at the bottom re-emits every token as a :root CSS custom
 * property (--gray-450, --accent-yellow, --muted-foreground, …), so inline
 * styles (`style={{ color: "var(--gray-450)" }}`) and the /design page's
 * static token texts share the exact same values as the Tailwind classes.
 * Derived interaction tokens (--primary-border and friends) are computed with
 * CSS relative color syntax and stay in client/src/index.css.
 */
export default {
  darkMode: ["class"],
  /* content/ is scanned too: content/timeline.tsx JSX is prerendered into the
     homepage, so its Tailwind classes must be seen by the scanner. */
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}", "./content/**/*.tsx"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem", /* 6px */
        sm: ".1875rem", /* 3px */
        button: "10px", /* primary CTA corner rounding */
      },
      colors: {
        ...tokens,
        /* Interaction-border colors are DERIVED at runtime (CSS relative
           color syntax + older-browser fallback) in client/src/index.css —
           referenced here so `border-primary-border` classes keep resolving. */
        primary: { ...tokens.primary, border: "var(--primary-border)" },
        secondary: { ...tokens.secondary, border: "var(--secondary-border)" },
        muted: { ...tokens.muted, border: "var(--muted-border)" },
        accent: { ...tokens.accent, border: "var(--accent-border)" },
        destructive: { ...tokens.destructive, border: "var(--destructive-border)" },
      },
      fontFamily: {
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      /* — Named non-color tokens: recurring "magic numbers" promoted to theme
           tokens so pages compose token classes instead of arbitrary values.
           One-off dimensions (slider geometry, logo heights, the 800px
           testimonial measure) deliberately stay as arbitrary values at their
           single call site. fontSize values are plain strings on purpose:
           they emit ONLY font-size, exactly like the text-[70px]-style
           arbitraries they replace (no line-height side effects). — */
      fontSize: {
        "4xs": "9px", // /design color-swatch captions (name + hex, base size)
        "3xs": "10px", // footer version line, stat subtexts
        "2xs": "11px", // footer meta lines, skill badges
        hero: "70px", // hero h1 display size (base)
        "hero-lg": "80px", // hero h1 display size (lg+)
      },
      letterSpacing: {
        label: "0.15em", // uppercase panel/footer labels
        eyebrow: "0.2em", // section eyebrow labels
      },
      maxWidth: {
        container: "1200px", // site content column
        "container-wide": "1400px", // /design page shell
      },
      minHeight: {
        "logo-tile": "160px", // /design logo preview tiles (base)
        "logo-tile-sm": "200px", // /design logo preview tiles (sm+)
      },
      spacing: {
        header: "72px", // fixed header height (h-header) + mobile-nav offset (top-header)
      },
      boxShadow: {
        "slider-photo": "0 8px 40px var(--black-alpha-10)", // TeamSlider active portrait
        "slider-thumb": "0 4px 12px var(--black-alpha-08)", // TeamSlider orbit thumbnails
        "runbook": "0 30px 60px -15px var(--black-alpha-06)", // /why hero console card
        "why-cta": "0 10px 30px var(--black-alpha-06)", // /why final CTA resting shadow
      },
      /* Named (not arbitrary) on purpose: the animate plugin also registers
         duration and delay utilities for animation properties, which makes arbitrary
         candidates like duration-[400ms] ambiguous — Tailwind silently drops
         them. Named scale values compile for both properties; the stray
         animation-* twin is harmless because later plain-CSS animation
         shorthands (.slider-orbit-reverse etc.) win the cascade. */
      transitionDuration: {
        400: "400ms", // TeamSlider orbit-thumb hover scale
      },
      transitionDelay: {
        60: "60ms", // TeamSlider role-line crossfade stagger
      },
      transitionProperty: {
        "opacity-transform": "opacity, transform", // TeamSlider crossfades (photo, name & role lines)
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    /* Re-emit every token as a :root CSS variable so inline `var(--…)`
       consumers and the /design page's static token texts share exactly the
       same values as the Tailwind utility classes. */
    plugin(({ addBase }) => {
      addBase({ ":root": tokenCssVars(tokens) });
    }),
  ],
} satisfies Config;
