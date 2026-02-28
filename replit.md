# Brand Guidelines Site

## Overview
A static brand guidelines website inspired by Clay.global and Attio's design aesthetic. Displays brand identity information including logo usage, color palette, typography, spacing system, component specifications, and design principles.

## Architecture
- **Frontend only** - No backend API needed, purely static content
- Single-page scrollable site with sticky sidebar navigation
- Built with React + Tailwind CSS + shadcn/ui tokens

## Key Files
- `client/src/pages/brand-guidelines.tsx` - Main brand guidelines page (all sections)
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
1. Overview - Hero + quick stats
2. Logo - Usage rules, light/dark backgrounds
3. Colors - Brand palette, extended palette, accessibility
4. Typography - Type scale, font weights
5. Spacing - 8px grid system
6. Components - Buttons, inputs, cards
7. Guidelines - Design principles + token reference
