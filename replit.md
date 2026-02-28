# Brand Guidelines Site

## Overview
A static brand guidelines landing page inspired by Clay.global and Attio's design aesthetic. Optimized for Firecrawl scraping, AI search indexing (ChatGPT, Gemini, Perplexity, Grok), and SEO.

## Architecture
- **Frontend only** - No backend API needed, purely static content
- Single-page scrollable site with sticky sidebar navigation
- Built with React + Tailwind CSS + shadcn/ui tokens
- Semantic HTML5 throughout (section, article, header, footer, nav, figure, dl)
- Proper heading hierarchy (h1 > h2 > h3 > h4)

## AI / Scraping Optimization
- `client/public/robots.txt` - Allows all major AI bots (GPTBot, ClaudeBot, PerplexityBot, FirecrawlBot, etc.)
- `client/public/llms.txt` - Structured summary for LLM consumption
- `client/public/llms-full.txt` - Complete design system specification for LLMs
- `client/public/sitemap.xml` - Sitemap for search engines
- `client/index.html` - JSON-LD structured data (WebPage, BreadcrumbList, FAQPage schemas)
- Proper meta tags: title, description, OG, Twitter Card, robots directives
- ARIA labels and landmarks on all sections
- Semantic role attributes throughout

## Key Files
- `client/src/pages/brand-guidelines.tsx` - Main landing page (all sections)
- `client/src/App.tsx` - Router setup
- `client/src/index.css` - Design tokens (CSS custom properties)
- `tailwind.config.ts` - Tailwind theme configuration
- `attached_assets/logo.svg` - Brand logo (imported via `@assets/logo.svg`)

## Brand Tokens
- **Primary Color**: #B5BDC9
- **Accent Color**: #202124
- **Background**: #FFFFFF
- **Text Primary**: #1C1D1F
- **Link Color**: #505967
- **Font Family**: Inter (body + headings), JetBrains Mono (code)
- **Base Spacing Unit**: 8px
- **Border Radius**: 8px (default), 10px (buttons)

## Sections
1. Overview - Hero with brand summary + quick stat cards
2. Logo - Usage rules, light/dark background demos, specifications
3. Colors - Brand palette swatches, extended 10-step palette, accessibility contrast ratios
4. Typography - Inter & JetBrains Mono showcases, 9-step type scale, weight usage
5. Spacing - 8px grid system with visual bars
6. Components - Primary/secondary buttons, input states, card variants
7. Guidelines - Design principles, token reference code, machine-readable resource links
