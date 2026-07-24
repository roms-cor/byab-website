import { useMemo, useState, useEffect } from "react";
import { Copy, Check, ArrowDown, Download, Palette, Type, Grid3X3, Layers, BookOpen, Image, LayoutTemplate } from "lucide-react";
import { siteConfig } from "@content/site.config";
import { teamMembers } from "@content/team";
import { engagements } from "@content/work";
import { testimonial } from "@content/testimonial";
const logoSquareBlack = "/images/logo-square-black.webp";
const logoSquareWhite = "/images/logo-square-white.webp";
const logoHorizontalBlack = "/images/logo-horizontal-black.webp";
const logoHorizontalWhite = "/images/logo-horizontal-white.webp";

/**
 * Design token table: token name → CSS color reference.
 * Every literal color value lives in tailwind.config.ts (the design-token
 * sheet), which re-emits each token as a :root CSS variable; the hex codes
 * displayed on this page are resolved at runtime from the computed styles
 * (this page is client-only, never prerendered), so no color literal
 * appears in this source file.
 */
const tokenRefs = {
  gray50: "var(--gray-50)",
  gray100: "var(--gray-100)",
  gray200: "var(--gray-200)",
  gray225: "var(--gray-225)",
  gray250: "var(--gray-250)",
  gray300: "var(--gray-300)",
  gray350: "var(--gray-350)",
  gray400: "var(--gray-400)",
  gray450: "var(--gray-450)",
  gray500: "var(--gray-500)",
  gray550: "var(--gray-550)",
  gray600: "var(--gray-600)",
  gray700: "var(--gray-700)",
  gray800: "var(--gray-800)",
  gray900: "var(--gray-900)",
  white: "var(--background)",
  yellow: "var(--accent-yellow)",
  whiteA85: "var(--white-alpha-85)",
  whiteA50: "var(--white-alpha-50)",
  whiteA25: "var(--white-alpha-25)",
} as const;

type TokenName = keyof typeof tokenRefs;
type TokenText = Record<TokenName, string>;

/** Resolve a CSS color reference to its computed value via a probe element. */
function computeCssColor(ref: string): string {
  const el = document.createElement("span");
  el.style.color = ref;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);
  return computed;
}

/** Opaque computed colors become uppercase hex text; alpha colors keep their functional notation (spaces stripped). */
function formatColorText(computed: string): string {
  const m = computed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (m) {
    return (
      "#" +
      m.slice(1, 4)
        .map((n) => Number(n).toString(16).padStart(2, "0").toUpperCase())
        .join("")
    );
  }
  return computed.replace(/\s+/g, "");
}

function resolveTokenTexts(): TokenText {
  const out = {} as Record<TokenName, string>;
  for (const name of Object.keys(tokenRefs) as TokenName[]) {
    out[name] = typeof document === "undefined" ? "" : formatColorText(computeCssColor(tokenRefs[name]));
  }
  return out;
}

const makeBrandColors = (t: TokenText) => [
  { name: "Primary", hex: t.gray300, css: tokenRefs.gray300, usage: "Backgrounds, subtle accents, decorative fills" },
  { name: "Accent", hex: t.gray900, css: tokenRefs.gray900, usage: "Buttons, headings, primary CTAs" },
  { name: "Background", hex: t.white, css: tokenRefs.white, usage: "Page backgrounds, content areas" },
  { name: "Text Primary", hex: t.gray900, css: tokenRefs.gray900, usage: "Body text, headings" },
  { name: "Link", hex: t.gray500, css: tokenRefs.gray500, usage: "Links, secondary text, navigation" },
];

const makeExtendedPalette = (t: TokenText) => [
  { name: "Gray 50", hex: t.gray50, css: tokenRefs.gray50 },
  { name: "Gray 100", hex: t.gray100, css: tokenRefs.gray100 },
  { name: "Gray 200", hex: t.gray200, css: tokenRefs.gray200 },
  { name: "Gray 225", hex: t.gray225, css: tokenRefs.gray225 },
  { name: "Gray 250", hex: t.gray250, css: tokenRefs.gray250 },
  { name: "Gray 300", hex: t.gray300, css: tokenRefs.gray300 },
  { name: "Gray 350", hex: t.gray350, css: tokenRefs.gray350 },
  { name: "Gray 400", hex: t.gray400, css: tokenRefs.gray400 },
  { name: "Gray 450", hex: t.gray450, css: tokenRefs.gray450 },
  { name: "Gray 500", hex: t.gray500, css: tokenRefs.gray500 },
  { name: "Gray 550", hex: t.gray550, css: tokenRefs.gray550 },
  { name: "Gray 600", hex: t.gray600, css: tokenRefs.gray600 },
  { name: "Gray 700", hex: t.gray700, css: tokenRefs.gray700 },
  { name: "Gray 800", hex: t.gray800, css: tokenRefs.gray800 },
  { name: "Gray 900", hex: t.gray900, css: tokenRefs.gray900 },
];

const typographyScale = [
  { name: "Display", size: "64px", weight: "600", lineHeight: "1.1", tracking: "-0.02em", usage: "Hero headings" },
  { name: "Heading 1", size: "48px", weight: "600", lineHeight: "1.15", tracking: "-0.02em", usage: "Page titles" },
  { name: "Heading 2", size: "36px", weight: "600", lineHeight: "1.2", tracking: "-0.015em", usage: "Section headings" },
  { name: "Heading 3", size: "28px", weight: "600", lineHeight: "1.25", tracking: "-0.01em", usage: "Subsections" },
  { name: "Heading 4", size: "22px", weight: "600", lineHeight: "1.3", tracking: "-0.005em", usage: "Card titles" },
  { name: "Body Large", size: "18px", weight: "400", lineHeight: "1.6", tracking: "0em", usage: "Lead paragraphs" },
  { name: "Body", size: "16px", weight: "400", lineHeight: "1.6", tracking: "0em", usage: "Standard text" },
  { name: "Body Small", size: "14px", weight: "400", lineHeight: "1.5", tracking: "0em", usage: "Secondary info" },
  { name: "Caption", size: "12px", weight: "500", lineHeight: "1.4", tracking: "0.02em", usage: "Labels, metadata" },
];

const spacingScale = [
  { name: "2xs", value: "4px", multiplier: "0.5x" },
  { name: "xs", value: "8px", multiplier: "1x" },
  { name: "sm", value: "12px", multiplier: "1.5x" },
  { name: "md", value: "16px", multiplier: "2x" },
  { name: "lg", value: "24px", multiplier: "3x" },
  { name: "xl", value: "32px", multiplier: "4x" },
  { name: "2xl", value: "48px", multiplier: "6x" },
  { name: "3xl", value: "64px", multiplier: "8x" },
  { name: "4xl", value: "96px", multiplier: "12x" },
];

const teamList = teamMembers.map((m) => `${m.name} (${m.role})`).join(", ");
const engagementList = engagements.map((e) => `${e.title} / ${e.outcome}`).join(", ");

const makeSiteSections = (t: TokenText) => [
  { id: "header", name: "Header", description: `Fixed navigation bar with ${siteConfig.name} logo, anchor links (Services, Track Record, Team, Story, Contact), and primary CTA 'Get in touch'.`, tokens: `bg: Background / backdrop-blur, text: Link (${t.gray500}), CTA: Accent (${t.gray900})` },
  { id: "hero", name: "Hero", description: "Full-width intro with an eyebrow label, display heading, subtitle, primary + secondary CTAs, a proof stats row of key brand metrics, and TeamSlider carousel on right.", tokens: `heading: Text Primary, accent word: ${t.gray450}, buttons: Accent + ${t.gray50}, proof stats: font-mono ${t.gray500}` },
  { id: "marquee", name: "Marquee", description: "Infinite horizontal scroll of expertise keywords with alternating bold/normal pattern.", tokens: `bold text: ${t.gray500}, normal text: ${t.gray450}, border: Gray 100` },
  { id: "pain", name: "Pain Recognition", description: "Dark section with a provocative heading and 3 numbered pain points, each with a bold lead phrase followed by supporting body copy.", tokens: `bg: Accent (${t.gray900}), heading: ${t.white}, accent word: ${t.gray350}, numbers: ${t.gray500} font-mono, body: ${t.whiteA85}, bold: ${t.white}` },
  { id: "services", name: "Services", description: "Section heading with a CTA link, above a 2×2 grid of service cards. Each card has a number, title, description, and an outcome list with → prefix items in mono font.", tokens: `card bg: Gray 50, number: ${t.gray450}, text: Link (${t.gray500}), outcomes: ${t.gray500} font-mono` },
  { id: "stats", name: "Stats", description: `Dark panel with '${siteConfig.name} — by the numbers' label. 4 metrics with yellow accent suffixes (${t.yellow}). Each stat has a descriptive label and a supporting subtitle.`, tokens: `panel bg: Accent (${t.gray900}), values: ${t.white}, suffixes: ${t.yellow}, labels: ${t.whiteA50}, subs: ${t.whiteA25} font-mono` },
  { id: "work", name: "Engagements", description: `Heading 'Recent engagements.' Engagement rows with category (mono), title, description, year, and outcome badge (yellow bg ${t.yellow}): ${engagementList}. Sourced from content/work.ts.`, tokens: `category: ${t.gray500} font-mono, description: ${t.gray500}, year: ${t.gray450}, badge bg: ${t.yellow}, badge text: ${t.gray900}` },
  { id: "approach", name: "About / Approach", description: `Background ${t.gray50}. Two-column layout: a positioning heading with body text on the left, and 3 named pillars with bullet dots and one-line descriptions on the right.`, tokens: `bg: Gray 50 (${t.gray50}), pillar bullets: ${t.gray900}, pillar names: font-semibold, pillar desc: ${t.gray500}, borders: ${t.gray225}` },
  { id: "team", name: "Team", description: `Heading 'Our team.' with an intro line, then a 2×2 grid of team cards: ${teamList}. Each card has photo, name, role, bio, LinkedIn link. Sourced from content/team.ts.`, tokens: `card bg: Gray 50, name: Text Primary, role: ${t.gray450}, bio: ${t.gray500}, photo border: ${t.gray100}` },
  { id: "story", name: "Story", description: `Background ${t.gray50}. Company history timeline of dated phases, each with a year, heading, and body copy containing external backlinks (company registries, LinkedIn profiles, partner sites). Closes with a brand promise quote on a dark panel.`, tokens: `bg: Gray 50 (${t.gray50}), year: Text Primary font-mono, text: Link (${t.gray500}), links: Text Primary underline, promise panel: Accent (${t.gray900}) bg, ${t.white} text, credits: ${t.gray350}` },
  { id: "testimonial", name: "Testimonial", description: `Centered blockquote: '${testimonial.quote}' — ${testimonial.author}, ${testimonial.role}. Sourced from content/testimonial.ts.`, tokens: `avatar bg: Primary (${t.gray300}), avatar text: Text Primary` },
  { id: "contact", name: "Contact", description: `Background ${t.gray50}. Two-column layout with a section heading (accent word ${t.gray450}), styled contact details with mono labels (Email, Based in), and a response-time promise. Form with Name, Email, message textarea, and submit button.`, tokens: `bg: Gray 50 (${t.gray50}), labels: ${t.gray500} font-mono, inputs: default border/bg, submit: Accent (${t.gray900})` },
  { id: "footer", name: "Footer", description: `4-column grid: logo + tagline + email/location + nav links, People (${teamMembers.map((m) => m.name).join(", ")} — all with LinkedIn), Companies (legal entities with registry links). Bottom bar: copyright, version/publish/commit timestamps, address.`, tokens: `text: Link (${t.gray500}), company SIREN: ${t.gray450}, registry links: ${t.gray450} underline, version: ${t.gray250}` },
];

const navSections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "logo", label: "Logo", icon: Image },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "spacing", label: "Spacing", icon: Grid3X3 },
  { id: "ui-components", label: "UI Components", icon: Layers },
  { id: "sections", label: "Site Sections", icon: LayoutTemplate },
  { id: "guidelines", label: "Guidelines", icon: BookOpen },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      data-testid={`button-copy-${text.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground transition-colors duration-150"
      aria-label={`Copy ${text} to clipboard`}
      style={{ background: copied ? "var(--border)" : "transparent" }}
    >
      {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
    </button>
  );
}

function DownloadButton({ src, filename }: { src: string; filename: string }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <button
      onClick={handleDownload}
      data-testid={`button-download-${filename.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 border border-border/50"
      style={{ color: "var(--muted-foreground)" }}
      aria-label={`Download ${filename}`}
    >
      <Download className="w-3 h-3" aria-hidden="true" />
      {filename}
    </button>
  );
}

function SideNav({ activeSection }: { activeSection: string }) {
  return (
    <nav aria-label="Page sections">
      <ul className="space-y-0.5 list-none p-0 m-0">
        {navSections.map((section) => {
          const Icon = section.icon;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-testid={`link-nav-${section.id}`}
                aria-current={activeSection === section.id ? "true" : undefined}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                  activeSection === section.id
                    ? "text-foreground font-medium bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function Components() {
  const [activeSection, setActiveSection] = useState("overview");
  // Resolved once on mount — this page is client-only (never prerendered).
  const [tok] = useState(resolveTokenTexts);
  const brandColors = useMemo(() => makeBrandColors(tok), [tok]);
  const extendedPalette = useMemo(() => makeExtendedPalette(tok), [tok]);
  const siteSections = useMemo(() => makeSiteSections(tok), [tok]);

  useEffect(() => {
    document.title = `Design — ${siteConfig.name}`;
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (meta) {
      meta.content = "noindex, nofollow";
    } else {
      meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      document.head.appendChild(meta);
    }
    return () => {
      document.title = siteConfig.title;
      if (meta) meta.content = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );
    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">

      <header className="sticky top-0 z-50 bg-white border-b border-border/50" role="banner">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" aria-label="Home" data-testid="link-logo-home">
              <img src={logoHorizontalWhite} alt={`${siteConfig.shortName} logo`} className="h-12 w-auto" data-testid="img-logo-header" />
            </a>
            <span className="text-border/80 text-sm font-light" aria-hidden="true">/</span>
            <span className="text-sm font-medium text-muted-foreground">Design</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono px-2 py-1 rounded-md bg-accent" data-testid="text-version">v1.0</span>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">

        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] py-8 px-4 border-r border-border/50" role="complementary" aria-label="Section navigation">
          <SideNav activeSection={activeSection} />
        </aside>

        <main className="flex-1 min-w-0" role="main">

          <section id="overview" aria-labelledby="overview-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <article className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-xs font-medium text-muted-foreground mb-6 sm:mb-8" data-testid="badge-design-system">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--gray-300)" }} aria-hidden="true" />
                Design System
              </div>
              <h1
                id="overview-heading"
                className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05]"
                data-testid="text-hero-title"
              >
                Design
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-4 sm:mt-6 leading-relaxed max-w-xl" data-testid="text-hero-description">
                The single source of truth for the {siteConfig.name} brand identity, design tokens,
                UI elements, and site structure. Everything needed to build and extend the site consistently.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
                <a
                  href="#colors"
                  data-testid="button-explore-system"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium transition-opacity duration-150"
                  style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
                >
                  Explore system
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href="#sections"
                  data-testid="link-site-sections"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium border border-border/50 text-muted-foreground transition-opacity duration-150"
                  style={{ backgroundColor: "var(--card)" }}
                >
                  Site sections
                </a>
              </div>
            </article>

            <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { label: "Font Family", value: "Inter", description: "Primary typeface for all text" },
                { label: "Base Unit", value: "8px", description: "Spacing grid foundation" },
                { label: "Border Radius", value: "8px", description: "Default corner rounding" },
                { label: "Sections", value: "13", description: "Available site sections" },
              ].map((item) => (
                <article
                  key={item.label}
                  className="p-4 sm:p-5 rounded-lg border border-border/50 bg-card/50"
                  data-testid={`card-stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
                  <p className="text-base sm:text-lg font-semibold text-foreground mt-1" data-testid={`text-stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />

          <section id="logo" aria-labelledby="logo-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <header className="max-w-3xl mb-8 sm:mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">01</p>
              <h2 id="logo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-logo">
                Logo
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                Our logo is the cornerstone of the brand identity. Use it consistently across all touchpoints.
              </p>
            </header>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Logomark (Square)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <figure className="relative rounded-lg border border-border/50 bg-white p-8 sm:p-12 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-4">
                <img src={logoSquareBlack} alt="Logomark on light background" className="h-16 sm:h-20 w-16 sm:w-20" data-testid="img-logo-light" />
                <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs text-muted-foreground font-medium">Light background</figcaption>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <DownloadButton src={logoSquareBlack} filename={`${siteConfig.shortName.toLowerCase()}-logomark-black.png`} />
                </div>
              </figure>
              <figure className="relative rounded-lg border border-border/50 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-4" style={{ backgroundColor: "var(--foreground)" }}>
                <img src={logoSquareWhite} alt="Logomark on dark background" className="h-16 sm:h-20 w-16 sm:w-20" data-testid="img-logo-dark" />
                <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs font-medium" style={{ color: "var(--gray-400)" }}>Dark background</figcaption>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <DownloadButton src={logoSquareWhite} filename={`${siteConfig.shortName.toLowerCase()}-logomark-white.png`} />
                </div>
              </figure>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Horizontal Logo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <figure className="relative rounded-lg border border-border/50 bg-white p-8 sm:p-12 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-4">
                <img src={logoHorizontalWhite} alt="Horizontal logo on light background" className="h-auto w-48 sm:w-64" data-testid="img-logo-horizontal-light" />
                <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs text-muted-foreground font-medium">Light background</figcaption>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <DownloadButton src={logoHorizontalWhite} filename={`${siteConfig.shortName.toLowerCase()}-horizontal-logo-light.png`} />
                </div>
              </figure>
              <figure className="relative rounded-lg border border-border/50 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-4" style={{ backgroundColor: "var(--foreground)" }}>
                <img src={logoHorizontalBlack} alt="Horizontal logo on dark background" className="h-auto w-48 sm:w-64" data-testid="img-logo-horizontal-dark" />
                <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs font-medium" style={{ color: "var(--gray-400)" }}>Dark background</figcaption>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <DownloadButton src={logoHorizontalBlack} filename={`${siteConfig.shortName.toLowerCase()}-horizontal-logo-dark.png`} />
                </div>
              </figure>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: "48", title: "Minimum Size", desc: "48px width minimum for digital applications" },
                { icon: "2x", title: "Clear Space", desc: "2x the logomark height around all sides" },
                { icon: "SVG", title: "File Format", desc: "SVG for web, PNG for social and print" },
              ].map((item) => (
                <article key={item.title} className="p-4 sm:p-6 rounded-lg border border-border/50 bg-card/50" data-testid={`card-logo-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                  <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center mb-3 sm:mb-4" aria-hidden="true">
                    <span className="text-xs font-bold text-foreground">{item.icon}</span>
                  </div>
                  <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />

          <section id="colors" aria-labelledby="colors-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <header className="max-w-3xl mb-8 sm:mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">02</p>
              <h2 id="colors-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-colors">
                Colors
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                Our color palette is clean, professional, and accessible. Each color has a specific role.
              </p>
            </header>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Brand Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {brandColors.map((color) => (
                <article key={color.name} data-testid={`swatch-${color.name.toLowerCase().replace(/\s/g, "-")}`}>
                  <div
                    className="w-full aspect-[4/3] rounded-lg mb-3 sm:mb-4 border border-border/50"
                    style={{ backgroundColor: color.hex }}
                    role="img"
                    aria-label={`${color.name} color swatch: ${color.hex}`}
                  />
                  <h4 className="font-medium text-sm text-foreground" data-testid={`text-color-name-${color.name.toLowerCase().replace(/\s/g, "-")}`}>{color.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5" data-testid={`text-color-usage-${color.name.toLowerCase().replace(/\s/g, "-")}`}>{color.usage}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <code className="text-xs font-mono text-muted-foreground">{color.hex}</code>
                    <CopyButton text={color.hex} />
                  </div>
                </article>
              ))}
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Extended Palette</h3>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="flex" role="img" aria-label={`Extended grayscale palette from white (${tok.gray50}) to black (${tok.gray900})`}>
                {extendedPalette.map((color) => (
                  <div key={color.name} className="flex-1 h-16 sm:h-20" style={{ backgroundColor: color.hex }} />
                ))}
              </div>
              <div className="grid grid-cols-5 divide-x divide-border/50">
                {extendedPalette.map((color) => (
                  <div key={color.name} className="p-2 sm:p-3" data-testid={`palette-${color.name.toLowerCase().replace(/\s/g, "-")}`}>
                    <p className="text-[9px] sm:text-[10px] font-medium text-foreground truncate">{color.name}</p>
                    <code className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">{color.hex}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <article className="p-4 sm:p-6 rounded-lg border border-border/50 bg-card/30">
                <h3 className="text-sm font-semibold text-foreground mb-4">Accessibility Contrast Ratios</h3>
                <dl className="space-y-3">
                  {[
                    { pair: "Accent on White", bg: tokenRefs.gray900, fg: tokenRefs.white, ratio: "AAA 21:1" },
                    { pair: "Link on White", bg: tokenRefs.white, fg: tokenRefs.gray500, ratio: "AA 5.74:1", border: true },
                    { pair: "Text on Primary", bg: tokenRefs.gray300, fg: tokenRefs.gray900, ratio: "AA 5.32:1" },
                  ].map((item) => (
                    <div key={item.pair} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <dt className="sr-only">{item.pair}</dt>
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: item.bg, color: item.fg, border: item.border ? "1px solid var(--gray-100)" : "none" }}
                          aria-hidden="true"
                        >Aa</div>
                        <dd className="text-sm text-muted-foreground">{item.pair}</dd>
                      </div>
                      <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md" data-testid={`text-contrast-${item.pair.toLowerCase().replace(/\s/g, "-")}`}>{item.ratio}</span>
                    </div>
                  ))}
                </dl>
              </article>

              <article className="p-4 sm:p-6 rounded-lg border border-border/50 bg-card/30">
                <h3 className="text-sm font-semibold text-foreground mb-4">Color Usage Guide</h3>
                <dl className="space-y-3 text-sm text-muted-foreground">
                  {[
                    { color: tokenRefs.gray300, name: "Primary", desc: "Large surface areas, section backgrounds, decorative elements" },
                    { color: tokenRefs.gray900, name: "Accent", desc: "Primary CTAs, important text, interactive elements" },
                    { color: tokenRefs.gray500, name: "Link", desc: "Clickable elements, secondary labels, navigation" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-start gap-3">
                      <dt>
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: item.color }} aria-hidden="true" />
                        <span className="sr-only">{item.name}</span>
                      </dt>
                      <dd><span className="font-medium text-foreground">{item.name}</span> — {item.desc}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          </section>

          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />

          <section id="typography" aria-labelledby="typography-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <header className="max-w-3xl mb-8 sm:mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">03</p>
              <h2 id="typography-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-typography">
                Typography
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                Inter is our primary typeface, providing excellent readability and a modern aesthetic.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
              <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Primary Typeface</p>
                <p className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }} data-testid="text-font-inter">
                  Inter
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 !@#$%^&amp;*()
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {["400", "500", "600", "700"].map((w) => (
                    <span key={w} className="px-2.5 py-1 rounded-md bg-accent text-xs font-mono text-muted-foreground">{w}</span>
                  ))}
                </div>
              </article>

              <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Monospace</p>
                <p className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight font-mono" data-testid="text-font-jetbrains">
                  JetBrains
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mt-3 font-mono">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 {"<>"} {"{ }"} =&gt; ()
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {["400", "500", "700"].map((w) => (
                    <span key={w} className="px-2.5 py-1 rounded-md bg-accent text-xs font-mono text-muted-foreground">{w}</span>
                  ))}
                </div>
              </article>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Type Scale</h3>
            <div className="rounded-lg border border-border/50 overflow-hidden" role="table" aria-label="Typography scale">
              <div className="hidden sm:flex items-center gap-6 lg:gap-10 px-6 py-3 bg-accent/50 text-xs text-muted-foreground font-medium border-b border-border/30" role="row">
                <div className="w-28 lg:w-36 flex-shrink-0" role="columnheader">Name</div>
                <div className="flex-1" role="columnheader">Preview</div>
              </div>
              {typographyScale.map((item, i) => (
                <div
                  key={item.name}
                  data-testid={`row-type-${item.name.toLowerCase().replace(/\s/g, "-")}`}
                  role="row"
                  className={`flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 lg:gap-10 px-4 sm:px-6 py-4 sm:py-5 ${
                    i !== typographyScale.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <div className="w-full sm:w-28 lg:w-36 flex-shrink-0" role="cell">
                    <p className="text-xs text-muted-foreground font-medium" data-testid={`text-type-name-${item.name.toLowerCase().replace(/\s/g, "-")}`}>{item.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">
                      {item.size} / {item.weight} / {item.lineHeight}
                    </p>
                  </div>
                  <p
                    role="cell"
                    className="text-foreground truncate flex-1 min-w-0"
                    style={{
                      fontSize: `min(${item.size}, 5vw)`,
                      fontWeight: parseInt(item.weight),
                      lineHeight: item.lineHeight,
                      letterSpacing: item.tracking,
                    }}
                  >
                    The quick brown fox
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />

          <section id="spacing" aria-labelledby="spacing-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <header className="max-w-3xl mb-8 sm:mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">04</p>
              <h2 id="spacing-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-spacing">
                Spacing
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                Based on an 8px grid for consistent rhythm and alignment.
              </p>
            </header>

            <div className="rounded-lg border border-border/50 overflow-hidden" role="table" aria-label="Spacing scale">
              <div className="hidden sm:flex items-center gap-6 px-6 py-3 bg-accent/50 text-xs text-muted-foreground font-medium border-b border-border/30" role="row">
                <div className="w-16" role="columnheader">Token</div>
                <div className="w-16" role="columnheader">Value</div>
                <div className="w-12" role="columnheader">Scale</div>
                <div className="flex-1" role="columnheader">Preview</div>
              </div>
              {spacingScale.map((item, i) => (
                <div
                  key={item.name}
                  data-testid={`row-spacing-${item.name}`}
                  role="row"
                  className={`flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 ${
                    i !== spacingScale.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <div className="w-12 sm:w-16 flex-shrink-0" role="cell">
                    <code className="text-xs font-mono font-medium text-foreground" data-testid={`text-spacing-name-${item.name}`}>{item.name}</code>
                  </div>
                  <div className="w-12 sm:w-16 flex-shrink-0 text-xs font-mono text-muted-foreground" role="cell">
                    {item.value}
                  </div>
                  <div className="w-10 sm:w-12 flex-shrink-0 text-xs text-muted-foreground" role="cell">
                    {item.multiplier}
                  </div>
                  <div className="flex-1" role="cell">
                    <div
                      className="h-3 rounded-sm"
                      style={{ width: item.value, backgroundColor: "var(--gray-300)", minWidth: "4px" }}
                      aria-label={`${item.value} spacing bar`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Padding", desc: "16px compact, 24px cards, 32-48px page sections" },
                { title: "Gap", desc: "8px tight, 16px grouped, 24-32px between sections" },
                { title: "Border Radius", desc: "8px default, 10px buttons, 12-16px cards" },
              ].map((item) => (
                <article key={item.title} className="p-4 sm:p-6 rounded-lg border border-border/50 bg-card/30" data-testid={`card-spacing-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />

          <section id="ui-components" aria-labelledby="ui-components-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <header className="max-w-3xl mb-8 sm:mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">05</p>
              <h2 id="ui-components-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-ui-components">
                UI Components
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                Core UI elements with their styling specs. Every component follows the tokens above.
              </p>
            </header>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Buttons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">Primary Button</h4>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                  <span
                    data-testid="button-demo-primary"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium"
                    style={{ backgroundColor: "var(--foreground)", color: "var(--background)", borderRadius: "10px", border: "1px solid var(--muted-foreground)" }}
                    role="presentation"
                  >
                    Start a project
                  </span>
                  <span
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium opacity-50"
                    style={{ backgroundColor: "var(--foreground)", color: "var(--background)", borderRadius: "10px", border: "1px solid var(--muted-foreground)" }}
                    role="presentation"
                  >
                    Disabled
                  </span>
                </div>
                <dl className="space-y-2">
                  {[
                    { prop: "Background", val: tok.gray900 },
                    { prop: "Text", val: tok.white },
                    { prop: "Border", val: tok.gray500 },
                    { prop: "Radius", val: "10px" },
                  ].map((s) => (
                    <div key={s.prop} className="flex items-center gap-3 text-xs">
                      <dt className="text-muted-foreground w-20">{s.prop}</dt>
                      <dd className="font-mono text-foreground">{s.val}</dd>
                    </div>
                  ))}
                </dl>
              </article>

              <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">Secondary Button</h4>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                  <span
                    data-testid="button-demo-secondary"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium border border-border/50"
                    style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderRadius: "0px" }}
                    role="presentation"
                  >
                    View our work
                  </span>
                  <span
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium border border-border/50 opacity-50"
                    style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderRadius: "0px" }}
                    role="presentation"
                  >
                    Disabled
                  </span>
                </div>
                <dl className="space-y-2">
                  {[
                    { prop: "Background", val: tok.gray50 },
                    { prop: "Text", val: tok.gray900 },
                    { prop: "Radius", val: "0px" },
                  ].map((s) => (
                    <div key={s.prop} className="flex items-center gap-3 text-xs">
                      <dt className="text-muted-foreground w-20">{s.prop}</dt>
                      <dd className="font-mono text-foreground">{s.val}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Input Fields</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">Text Input</h4>
                <input
                  type="text"
                  placeholder="Enter your email"
                  data-testid="input-demo-text"
                  aria-label="Demo text input"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                />
                <dl className="mt-4 space-y-2">
                  {[
                    { prop: "Height", val: "40px" },
                    { prop: "Padding", val: "0 16px" },
                    { prop: "Radius", val: "8px" },
                  ].map((s) => (
                    <div key={s.prop} className="flex items-center gap-3 text-xs">
                      <dt className="text-muted-foreground w-20">{s.prop}</dt>
                      <dd className="font-mono text-foreground">{s.val}</dd>
                    </div>
                  ))}
                </dl>
              </article>

              <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">States</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Focused</label>
                    <input type="text" value="Active input" readOnly aria-label="Focused state demo" className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-ring bg-background text-foreground focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Disabled</label>
                    <input type="text" value="Disabled input" disabled aria-label="Disabled state demo" className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Error</label>
                    <input type="text" value="Error state" readOnly aria-label="Error state demo" className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-red-400 bg-background text-foreground focus:outline-none" />
                  </div>
                </div>
              </article>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Cards &amp; Containers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Default Card", desc: "Subtle background with light border", bg: tokenRefs.gray50, borderCol: tokenRefs.gray100, textColor: undefined, subColor: undefined, specs: { bg: tok.gray50, border: tok.gray100, radius: "8px" } },
                { title: "Elevated Card", desc: "White background with subtle shadow", bg: tokenRefs.white, borderCol: tokenRefs.gray100, textColor: undefined, subColor: undefined, specs: { bg: tok.white, shadow: "sm", radius: "8px" } },
                { title: "Dark Card", desc: "For dark sections and footers", bg: tokenRefs.gray900, borderCol: undefined, textColor: tokenRefs.white, subColor: tokenRefs.gray400, specs: { bg: tok.gray900, text: tok.white, radius: "8px" } },
              ].map((card) => (
                <article
                  key={card.title}
                  className={`rounded-lg p-4 sm:p-6 ${card.borderCol ? "border" : ""}`}
                  style={{ backgroundColor: card.bg, borderColor: card.borderCol }}
                  data-testid={`card-demo-${card.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="w-full h-20 sm:h-24 rounded-md mb-3 sm:mb-4" style={{ backgroundColor: "var(--gray-300)", opacity: card.textColor ? 0.15 : 0.25 }} aria-hidden="true" />
                  <h4 className="text-sm font-medium" style={{ color: card.textColor || undefined }}>{card.title}</h4>
                  <p className="text-xs mt-1" style={{ color: card.subColor || undefined }}>{card.desc}</p>
                  <dl className="mt-3 space-y-1.5">
                    {Object.entries(card.specs).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2 text-[10px]">
                        <dt style={{ color: card.subColor || undefined }} className="text-muted-foreground">{k}</dt>
                        <dd className="font-mono" style={{ color: card.textColor ? "var(--gray-300)" : undefined }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />

          <section id="sections" aria-labelledby="sections-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <header className="max-w-3xl mb-8 sm:mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">06</p>
              <h2 id="sections-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-sections">
                Site Sections
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                Every section available on the site, with its purpose, structure, and the design tokens it uses.
                This is the definitive reference for building and extending pages.
              </p>
            </header>

            <div className="space-y-0 border-t border-border/50">
              {siteSections.map((section, i) => (
                <article
                  key={section.id}
                  className="border-b border-border/50 py-5 sm:py-6"
                  data-testid={`section-ref-${section.id}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                    <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                      <span className="text-xs font-mono" style={{ color: "var(--gray-300)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">{section.name}</h3>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{section.description}</p>
                      <p className="text-xs font-mono mt-2" style={{ color: "var(--gray-400)" }}>{section.tokens}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-lg border border-border/50 bg-card/30">
              <h3 className="text-sm font-semibold text-foreground mb-3">Page Structure</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The homepage follows this exact section order. All sections are wrapped in semantic HTML5 elements
                with proper heading hierarchy (h1 in Hero, h2 per section, h3 for sub-items).
              </p>
              <div className="flex flex-wrap gap-2">
                {siteSections.map((section) => (
                  <span
                    key={section.id}
                    className="text-xs font-mono px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: "var(--gray-100)", color: "var(--muted-foreground)" }}
                  >
                    {section.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <hr className="mx-4 sm:mx-6 lg:mx-16 border-border/50" aria-hidden="true" />

          <section id="guidelines" aria-labelledby="guidelines-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
            <header className="max-w-3xl mb-8 sm:mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">07</p>
              <h2 id="guidelines-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-guidelines">
                Guidelines
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                Principles for applying the design system consistently.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {[
                { num: "01", title: "Hierarchy", desc: "Use size, weight, and color to create clear visual hierarchy. Headings should be semibold (600) and body text regular (400)." },
                { num: "02", title: "Consistency", desc: "Stick to the spacing scale and never use arbitrary values. All spacing should be multiples of 8px." },
                { num: "03", title: "Restraint", desc: "Less is more. Avoid unnecessary decoration, shadows, or color. Let content breathe with generous whitespace." },
                { num: "04", title: "Accessibility", desc: "All text must meet WCAG AA contrast requirements. Interactive elements need visible focus states and semantic HTML." },
              ].map((p) => (
                <article key={p.num} className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30" data-testid={`card-principle-${p.num}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: "var(--gray-300)" }} aria-hidden="true">{p.num}</div>
                    <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </article>
              ))}
            </div>

            <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30 mb-8 sm:mb-12">
              <h3 className="text-base font-semibold text-foreground mb-6">Design Tokens Reference</h3>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <pre className="p-4 sm:p-5 text-xs sm:text-sm leading-relaxed overflow-x-auto" style={{ backgroundColor: "var(--foreground)", color: "var(--gray-300)" }}>
                  <code>{`/* Colors */
--color-primary: ${tok.gray300};
--color-accent: ${tok.gray900};
--color-background: ${tok.white};
--color-text: ${tok.gray900};
--color-link: ${tok.gray500};

/* Typography */
--font-sans: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Spacing */
--space-unit: 8px;
--radius: 8px;
--radius-button: 10px;`}</code>
                </pre>
              </div>
            </article>

            <article className="p-4 sm:p-6 rounded-lg border border-border/50 bg-card/30">
              <h3 className="text-sm font-semibold text-foreground mb-4">Machine-Readable Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This design system is optimized for AI and automated consumption.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-accent px-2 py-0.5 rounded text-muted-foreground">/robots.txt</code>
                  <span className="text-muted-foreground">— Crawler permissions for all major AI bots</span>
                </li>
                <li className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-accent px-2 py-0.5 rounded text-muted-foreground">/llms.txt</code>
                  <span className="text-muted-foreground">— Structured summary for LLM consumption</span>
                </li>
                <li className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-accent px-2 py-0.5 rounded text-muted-foreground">/llms-full.txt</code>
                  <span className="text-muted-foreground">— Complete design system specification for LLMs</span>
                </li>
              </ul>
            </article>
          </section>

          <footer className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12" role="contentinfo">
            <div className="p-6 sm:p-8 rounded-lg" style={{ backgroundColor: "var(--foreground)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <img src={logoHorizontalBlack} alt={`${siteConfig.shortName} logo`} className="h-6 w-auto mb-3" />
                  <p className="text-sm leading-relaxed" style={{ color: "var(--gray-400)" }}>
                    Components maintained by the design team.
                  </p>
                </div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Last updated: February 2026<br />
                  Version 1.0
                </p>
              </div>
            </div>
          </footer>

          <div className="h-8 sm:h-16" />
        </main>
      </div>
    </div>
  );
}
