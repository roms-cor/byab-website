# Premium Growth Agency — Landing Page & Brand Guidelines

## Overview
A two-page site for a premium growth agency: a landing page (homepage) and a brand guidelines page (design system). Inspired by Clay.global and Attio's design aesthetic. Optimized for Firecrawl scraping, AI search indexing (ChatGPT, Gemini, Perplexity, Grok), and SEO.

## Architecture
- **Frontend only** — No backend API needed, purely static content
- React + Tailwind CSS + shadcn/ui tokens
- Semantic HTML5 throughout (section, article, header, footer, nav, blockquote, figure, dl)
- Proper heading hierarchy (h1 > h2 > h3)

## Routes
- `/` — Homepage (agency landing page)
- `/brand` — Brand Guidelines (design system documentation)

## AI / Scraping Optimization
- `client/public/robots.txt` — Allows all major AI bots
- `client/public/llms.txt` — Structured summary for LLM consumption
- `client/public/llms-full.txt` — Complete design system specification for LLMs
- `client/public/sitemap.xml` — Sitemap for search engines
- `client/index.html` — JSON-LD structured data (ProfessionalService, BreadcrumbList)
- Proper meta tags, ARIA labels, semantic landmarks

## Key Files
- `client/src/pages/home.tsx` — Agency landing page
- `client/src/pages/brand-guidelines.tsx` — Brand guidelines page
- `client/src/App.tsx` — Router setup (/ and /brand)
- `client/src/index.css` — Design tokens (CSS custom properties) + marquee animation

## Brand Design Tokens
- **Primary**: #B5BDC9 — Decorative fills, accents, stars, badges
- **Accent**: #202124 — Primary buttons, dark sections, CTA backgrounds
- **Background**: #FFFFFF — Page backgrounds
- **Text Primary**: #1C1D1F — Headings, body text
- **Link/Secondary**: #505967 — Nav links, secondary text, descriptions
- **Card BG**: #F8F9FA (Slate 50)
- **Card Border**: #EEF0F3 (Slate 100)
- **Font**: Inter (body + headings), JetBrains Mono (code)
- **Spacing**: 8px grid system
- **Border Radius**: 8px default, 10px buttons, 0px secondary buttons

## Homepage Sections
1. Header — Fixed nav with logo, links (Services, Work, About, Contact), "Get in touch" CTA
2. Hero — Large heading "We build brands that outgrow expectations.", subtitle, primary/secondary buttons
3. Marquee — Scrolling keywords (Strategy, Branding, Performance, etc.)
4. Services — 4 service cards in 2x2 grid (Brand Strategy, Identity Design, Performance Marketing, Web & Digital)
5. Work — 3 case study rows (Theorem, Northlight, Arcadia) with category badges
6. Stats — Dark panel: 150+ projects, 3.2x ROI, 40+ brands, 98% retention
7. About — Two-column: mission statement + approach tags
8. Testimonial — Centered blockquote from Sarah Larsen, CEO Northlight
9. Contact — Two-column: info + form (Name, Email, Message, Submit)
10. Footer — Logo + copyright + Brand Guidelines link
