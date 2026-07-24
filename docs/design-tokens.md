# Design Tokens — Because You Are Busy (BYAB)

Single source of truth: **`tailwind.config.ts`**. Every color is defined there as a
full, directly usable value (hex / hsl / rgba) — ready to paste into design tools
(e.g. Subframe's *Import your theme* and *Design Guidelines*). A small inline
Tailwind plugin re-emits every token as a `:root` CSS custom property, so the same
values are reachable three ways:

| Consumer | How it reads a token |
| --- | --- |
| Tailwind utility classes | `text-gray-450`, `bg-card`, `border-border/50` (opacity modifiers work — values are literals) |
| CSS / vendor `ui/` via `var(--…)` | `color: var(--gray-450)`, `shadow-[0_0_0_1px_var(--sidebar-border)]` (page code must use utility classes — see ESLint note below) |
| `/design` page resolver | computes hex at runtime from the same CSS variables |

Non-color variables (shadows, radius, elevate system) and **derived** colors
(`--primary-border` etc., CSS relative color syntax) live in `client/src/index.css`.
ESLint enforces both guards (see `eslint.config.js`): raw color literals are
forbidden in `client/src` and `content`, and inline `style={{…}}` props are
forbidden in `client/src/pages/**`, `client/src/sections/**` and `content/**` —
styling must be Tailwind token classes. Irreducibly dynamic values use an
explicit `// eslint-disable-next-line no-restricted-syntax -- <reason>`
(today: the TeamSlider orbit `--thumb-angle` CSS variable and the /design
type-scale & spacing previews that render token data tables).

---

## Gray scale (brand palette, pure grayscale)

Ordered by lightness, `50` lightest → `900` darkest. In-between stops (225, 250,
350, 450, 550) preserve exact historical brand values — do not round them.

| Token | Hex | Old name | Usage |
| --- | --- | --- | --- |
| `gray-50` | `#F5F5F5` | — (= `card`) | Card surfaces, light section backgrounds |
| `gray-100` | `#E5E5E5` | `--gray-e5` | Hairline borders on cards, team photo borders |
| `gray-200` | `#CCCCCC` | — (= `input`) | Form input borders |
| `gray-225` | `#C0C0C0` | `--gray-c0` ("silver") | About-section borders |
| `gray-250` | `#BBBBBB` | `--gray-bb` | Footer version text |
| `gray-300` | `#999999` | `--gray-99` | **Brand primary** — decorative fills, accents (not for text) |
| `gray-350` | `#949494` | `--gray-94` | Text on dark: labels, credits (4.7:1 on black) |
| `gray-400` | `#777777` | `--gray-77` | Service-card numbers |
| `gray-450` | `#767676` | `--gray-76` | Decorative text on white (4.6:1) |
| `gray-500` | `#666666` | — (= `muted-foreground`) | Body text on white (5.74:1), links |
| `gray-550` | `#595959` | `--gray-59` | Small badge text (7:1) |
| `gray-600` | `#444444` | `--gray-44` | Secondary dark text |
| `gray-700` | `#333333` | `--gray-33` | Dark text / surfaces |
| `gray-800` | `#1A1A1A` | `--gray-1a` | Near-black surfaces |
| `gray-900` | `#000000` | — (= `foreground`) | **Brand accent** — headings, primary buttons, dark sections |

## Brand accents

| Token | Value | Usage |
| --- | --- | --- |
| `accent-yellow` | `#E8E020` | Stats suffixes, engagement outcome badges |
| `red-600` | `#DC2626` | Form validation errors (was `--red-dc`; equals Tailwind's default red-600) |

## Semantic (shadcn) tokens

Kept in `hsl()` notation so computed values stay bit-identical to the historical
wiring. Hex equivalents shown for reference.

| Token | Value | Hex | Usage |
| --- | --- | --- | --- |
| `background` | `hsl(0 0% 100%)` | `#FFFFFF` | Page background |
| `foreground` | `hsl(0 0% 0%)` | `#000000` | Default text |
| `border` | `hsl(0 0% 90%)` | `#E6E6E6` | Default borders (`border-border`, often at `/50`) |
| `input` | `hsl(0 0% 80%)` | `#CCCCCC` | Input borders |
| `ring` | `hsl(0 0% 0%)` | `#000000` | Focus rings |
| `card` / `-foreground` / `-border` | `hsl(0 0% 96%)` / `hsl(0 0% 0%)` / `hsl(0 0% 90%)` | `#F5F5F5` / `#000000` / `#E6E6E6` | Cards |
| `popover` / `-foreground` / `-border` | `hsl(0 0% 100%)` / `hsl(0 0% 0%)` / `hsl(0 0% 90%)` | `#FFFFFF` / `#000000` / `#E6E6E6` | Popovers |
| `primary` / `-foreground` | `hsl(0 0% 0%)` / `hsl(0 0% 100%)` | `#000000` / `#FFFFFF` | Primary buttons |
| `secondary` / `-foreground` | `hsl(0 0% 96%)` / `hsl(0 0% 0%)` | `#F5F5F5` / `#000000` | Secondary buttons |
| `muted` / `-foreground` | `hsl(0 0% 94%)` / `hsl(0 0% 40%)` | `#F0F0F0` / `#666666` | Muted surfaces / body text |
| `accent` / `-foreground` | `hsl(0 0% 96%)` / `hsl(0 0% 0%)` | `#F5F5F5` / `#000000` | Hover/selected surfaces |
| `destructive` / `-foreground` | `hsl(0 72% 51%)` / `hsl(0 0% 98%)` | `#DC2828` / `#FAFAFA` | Destructive UI (shadcn) |
| `chart-1…5` | `hsl(0 0% 20/35/50/65/80%)` | `#333333`→`#CCCCCC` | Chart palette (grayscale) |
| `sidebar*` | see `tailwind.config.ts` | — | shadcn sidebar scaffold |

### ⚠️ Exact-value traps (deliberate near-misses)

- `border` `hsl(0 0% 90%)` computes **#E6E6E6** — NOT `gray-100` **#E5E5E5**.
- `destructive` `hsl(0 72% 51%)` computes **#DC2828** — NOT `red-600` **#DC2626** (form errors use `red-600`).

Verify computed values, not names, before consolidating anything.

## Alpha tokens

Translucent text/borders over dark surfaces (`white-alpha-*`) and soft
overlays/shadows on light surfaces (`black-alpha-*`).

| Token | Value | Token | Value |
| --- | --- | --- | --- |
| `white-alpha-85` | `rgba(255,255,255,0.85)` | `black-alpha-10` | `rgba(0,0,0,0.10)` |
| `white-alpha-50` | `rgba(255,255,255,0.5)` | `black-alpha-08` | `rgba(0,0,0,0.08)` |
| `white-alpha-25` | `rgba(255,255,255,0.25)` | `black-alpha-06` | `rgba(0,0,0,0.06)` |
| `white-alpha-08` | `rgba(255,255,255,0.08)` | `black-alpha-04` | `rgba(0,0,0,0.04)` |
| | | `black-alpha-02` | `rgba(0,0,0,0.02)` |

## Status colors

`status-online` `rgb(34 197 94)` · `status-away` `rgb(245 158 11)` ·
`status-busy` `rgb(239 68 68)` · `status-offline` `rgb(156 163 175)` (avatar dots).

## Derived interaction tokens (defined in `client/src/index.css`)

Computed with CSS relative color syntax from the emitted token vars — these are
formulas, not stored colors, so they stay in CSS:

- `--primary-border`, `--secondary-border`, `--muted-border`, `--accent-border`,
  `--destructive-border`, `--sidebar-primary-border`, `--sidebar-accent-border`
  — each is `hsl(from var(--token) h s calc(l + var(--opaque-button-border-intensity)) / alpha)`
  with a plain `var(--token)` fallback for older browsers.
- Elevate system: `--elevate-1` `rgba(0,0,0,.03)`, `--elevate-2` `rgba(0,0,0,.08)`,
  `--button-outline` `rgba(0,0,0,.10)`, `--badge-outline` `rgba(0,0,0,.05)`.

---

## Typography

Families (loaded via Google Fonts, weights in parentheses):

- **Sans — Inter** (400, 500, 600, 700): all body text and headings.
  Stack: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Mono — JetBrains Mono** (400, 500): numbers, labels, code-flavored meta.
  Stack: `'JetBrains Mono', monospace`
- Serif fallback: `Georgia, serif` (defined, unused).

Type scale:

| Style | Size | Weight | Line height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | 64px | 600 | 1.1 | -0.02em | Hero headings |
| Heading 1 | 48px | 600 | 1.15 | -0.02em | Page titles |
| Heading 2 | 36px | 600 | 1.2 | -0.015em | Section headings |
| Heading 3 | 28px | 600 | 1.25 | -0.01em | Subsections |
| Heading 4 | 22px | 600 | 1.3 | -0.005em | Card titles |
| Body Large | 18px | 400 | 1.6 | 0em | Lead paragraphs |
| Body | 16px | 400 | 1.6 | 0em | Standard text |
| Body Small | 14px | 400 | 1.5 | 0em | Secondary info |
| Caption | 12px | 500 | 1.4 | 0.02em | Labels, metadata |

## Spacing — 8px grid

Base unit 8px (Tailwind's default 0.25rem step stays available; page rhythm
follows the 8px multiples):

| Name | Value | Multiplier |
| --- | --- | --- |
| 2xs | 4px | 0.5× |
| xs | 8px | 1× |
| sm | 12px | 1.5× |
| md | 16px | 2× |
| lg | 24px | 3× |
| xl | 32px | 4× |
| 2xl | 48px | 6× |
| 3xl | 64px | 8× |
| 4xl | 96px | 12× |

## Border radius

- **8px** — default corner rounding (cards, buttons, images; `--radius: .5rem`)
- **10px** (`rounded-button`) — primary CTA buttons (hero, contact form, demos)
- **9999px (pill)** — header CTA
- **0px** — secondary/ghost buttons (sharp)
- shadcn utility mapping (`tailwind.config.ts`): `rounded-lg` 9px · `rounded-md` 6px · `rounded-sm` 3px

## Named non-color tokens (`tailwind.config.ts`)

Recurring "magic values" promoted to named theme tokens — use these instead of
arbitrary values:

| Token | Class | Value | Usage |
| --- | --- | --- | --- |
| fontSize `hero` / `hero-lg` | `text-hero` / `lg:text-hero-lg` | 70px / 80px | Hero h1 display size |
| fontSize `2xs` | `text-2xs` | 11px | Footer meta lines, skill badges |
| fontSize `3xs` | `text-3xs` | 10px | Footer version line, stat subtexts |
| letterSpacing `eyebrow` | `tracking-eyebrow` | 0.2em | Section eyebrow labels |
| letterSpacing `label` | `tracking-label` | 0.15em | Uppercase panel/footer labels |
| maxWidth `container` | `max-w-container` | 1200px | Site content column |
| maxWidth `container-wide` | `max-w-container-wide` | 1400px | /design page shell |
| spacing `header` | `h-header`, `top-header` | 72px | Fixed header height + mobile-nav offset |
| borderRadius `button` | `rounded-button` | 10px | Primary CTA corner rounding |
| boxShadow `slider-photo` | `shadow-slider-photo` | 0 8px 40px `black-alpha-10` | TeamSlider active portrait |
| boxShadow `slider-thumb` | `shadow-slider-thumb` | 0 4px 12px `black-alpha-08` | TeamSlider orbit thumbnails |
| transitionDuration `400` | `duration-400` | 400ms | TeamSlider orbit-thumb hover scale |
| transitionDelay `60` | `delay-60` | 60ms | TeamSlider role-line crossfade stagger |

`duration-400`/`delay-60` are named tokens (not `duration-[400ms]` arbitraries)
because the animate plugin also registers `duration-*`/`delay-*` for
`animation-*` — arbitrary time candidates are ambiguous and get silently
dropped by Tailwind.

These fontSize tokens are plain strings (no line-height tuple) so they emit
only `font-size`, exactly like the arbitrary values they replaced. One-off
dimensions (slider geometry such as `w-[260px]`/`-inset-[34px]`, logo heights,
the `max-w-[800px]` testimonial measure) deliberately stay as arbitrary values
at their single call site.

## Dark mode status

The site is single-theme (light). `client/src/index.css` retains a `.dark`
variable block from the shadcn scaffold (converted to full color values), but
nothing toggles the class and Tailwind utilities compile to light literals.

## Subframe import notes

1. **Import your theme** → point it at `tailwind.config.ts`; every color above is
   a literal value there (no `var()` indirection except the seven derived
   `*-border` interaction colors, which Subframe can ignore).
2. **Design Guidelines doc** → this file is the palette/typography/spacing/radius
   reference to paste from; the live `/design` page shows the same values
   resolved at runtime.
