# Attio Landing Page & Brand Guidelines

## Overview
A two-page site: a product landing page (homepage) and a brand guidelines page (design system). The homepage strictly uses the design tokens and component styles defined in the brand guidelines. Optimized for Firecrawl scraping, AI search indexing, and SEO.

## Architecture
- **Frontend only** - No backend API needed, purely static content
- React + Tailwind CSS + shadcn/ui tokens
- Semantic HTML5 throughout (section, article, header, footer, nav, figure, dl)
- Proper heading hierarchy (h1 > h2 > h3 > h4)

## Routes
- `/` — Homepage (landing page)
- `/brand` — Brand Guidelines (design system documentation)

## AI / Scraping Optimization
- `client/public/robots.txt` - Allows all major AI bots
- `client/public/llms.txt` - Structured summary for LLM consumption
- `client/public/llms-full.txt` - Complete design system specification for LLMs
- `client/public/sitemap.xml` - Sitemap for search engines
- `client/index.html` - JSON-LD structured data (WebSite, Organization, SoftwareApplication, FAQPage, BreadcrumbList)
- Proper meta tags, ARIA labels, semantic landmarks

## Key Files
- `client/src/pages/home.tsx` - Homepage landing page
- `client/src/pages/brand-guidelines.tsx` - Brand guidelines page
- `client/src/App.tsx` - Router setup (/ and /brand)
- `client/src/index.css` - Design tokens (CSS custom properties)
- `tailwind.config.ts` - Tailwind theme configuration
- `attached_assets/logo.svg` - Brand logo (imported via `@assets/logo.svg`)

## Brand Design Tokens (used by both pages)
- **Primary Color**: #B5BDC9 (decorative fills, icon backgrounds, stars)
- **Accent Color**: #202124 (primary buttons, dark sections, CTA backgrounds)
- **Background**: #FFFFFF (page backgrounds)
- **Text Primary**: #1C1D1F (headings, body text)
- **Link Color**: #505967 (secondary text, nav links, border accents)
- **Card BG**: #F8F9FA (Slate 50, card backgrounds)
- **Card Border**: #EEF0F3 (Slate 100)
- **Font**: Inter (body + headings), JetBrains Mono (code)
- **Spacing**: 8px grid system
- **Border Radius**: 8px default, 10px buttons, 0px secondary buttons

## Homepage Sections
1. Header — Sticky nav with logo, links, CTA
2. Hero — Title, subtitle, primary/secondary buttons, product preview
3. Logo Cloud — Trusted-by company names
4. Features — 6 feature cards with icons (Zap, Layers, BarChart3, Users, Shield, Globe)
5. How It Works — 3-step process cards
6. Testimonials — 3 testimonial cards with ratings
7. Pricing — Free / Pro / Enterprise pricing table
8. FAQ — 4 questions in definition list
9. CTA — Dark section with email input and submit
10. Footer — 4-column link grid + brand guidelines link

## Brand Guidelines Sections
1. Overview, 2. Logo, 3. Colors, 4. Typography, 5. Spacing, 6. Components, 7. Guidelines
