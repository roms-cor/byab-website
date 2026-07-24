import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * Design-token sheet — the single source of truth for every color the site
 * uses. Each value below is a full, directly usable color (hex / hsl / rgba),
 * so the theme can be imported as-is by design tools (e.g. Subframe's
 * "Import your theme") and Tailwind's opacity modifiers keep working:
 * `border-border/50` still renders hsl(0 0% 90% / 0.5), exactly as before.
 *
 * The inline plugin at the bottom re-emits every token as a :root CSS custom
 * property (--gray-450, --accent-yellow, --muted-foreground, …), so inline
 * styles (`style={{ color: "var(--gray-450)" }}`) and the /design page's
 * runtime token resolver read the exact same values as the Tailwind classes.
 * Derived interaction tokens (--primary-border and friends) are computed with
 * CSS relative color syntax and stay in client/src/index.css.
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

type TokenGroup = Record<string, string>;
type TokenTree = Record<string, string | TokenGroup>;

const tokens = {
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
  chart: {
    "1": "hsl(0 0% 20%)",
    "2": "hsl(0 0% 35%)",
    "3": "hsl(0 0% 50%)",
    "4": "hsl(0 0% 65%)",
    "5": "hsl(0 0% 80%)",
  },
  sidebar: {
    DEFAULT: "hsl(0 0% 96%)",
    foreground: "hsl(0 0% 0%)",
    border: "hsl(0 0% 90%)",
    ring: "hsl(0 0% 0%)",
  },
  "sidebar-primary": {
    DEFAULT: "hsl(0 0% 0%)",
    foreground: "hsl(0 0% 100%)",
  },
  "sidebar-accent": {
    DEFAULT: "hsl(0 0% 93%)", // #EDEDED
    foreground: "hsl(0 0% 0%)",
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

  /* — Status indicator colors (avatar status dots) — */
  status: {
    online: "rgb(34 197 94)",
    away: "rgb(245 158 11)",
    busy: "rgb(239 68 68)",
    offline: "rgb(156 163 175)",
  },
} satisfies TokenTree;

/** Flatten the token tree into `--name[-key]` CSS custom properties. */
function tokenCssVars(tree: TokenTree): Record<string, string> {
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
        "sidebar-primary": { ...tokens["sidebar-primary"], border: "var(--sidebar-primary-border)" },
        "sidebar-accent": { ...tokens["sidebar-accent"], border: "var(--sidebar-accent-border)" },
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
      spacing: {
        header: "72px", // fixed header height (h-header) + mobile-nav offset (top-header)
      },
      boxShadow: {
        "slider-photo": "0 8px 40px var(--black-alpha-10)", // TeamSlider active portrait
        "slider-thumb": "0 4px 12px var(--black-alpha-08)", // TeamSlider orbit thumbnails
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
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    /* Re-emit every token as a :root CSS variable so inline `var(--…)`
       consumers and the /design page's runtime resolver share exactly the
       same values as the Tailwind utility classes. */
    plugin(({ addBase }) => {
      addBase({ ":root": tokenCssVars(tokens) });
    }),
  ],
} satisfies Config;
