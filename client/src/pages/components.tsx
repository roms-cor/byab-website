import { useState, useEffect } from "react";
import { Copy, Check, ArrowDown, Download, Palette, Type, Grid3X3, Layers, BookOpen, Image, LayoutTemplate } from "lucide-react";
import logoSquareBlack from "@assets/byab-square-logo-black_1772265439751.png";
import logoSquareWhite from "@assets/byab-square-logo-white_1772265439751.png";
import logoHorizontalBlack from "@assets/byab-horizontal-logo-black_1772264662584.png";
import logoHorizontalWhite from "@assets/byab-horizontal-logo-white_1772264662585.png";

const brandColors = [
  { name: "Primary", hex: "#999999", usage: "Backgrounds, subtle accents, decorative fills" },
  { name: "Accent", hex: "#000000", usage: "Buttons, headings, primary CTAs" },
  { name: "Background", hex: "#FFFFFF", usage: "Page backgrounds, content areas" },
  { name: "Text Primary", hex: "#000000", usage: "Body text, headings" },
  { name: "Link", hex: "#666666", usage: "Links, secondary text, navigation" },
];

const extendedPalette = [
  { name: "Gray 50", hex: "#F5F5F5" },
  { name: "Gray 100", hex: "#E5E5E5" },
  { name: "Gray 200", hex: "#CCCCCC" },
  { name: "Gray 300", hex: "#999999" },
  { name: "Gray 400", hex: "#777777" },
  { name: "Gray 500", hex: "#666666" },
  { name: "Gray 600", hex: "#444444" },
  { name: "Gray 700", hex: "#333333" },
  { name: "Gray 800", hex: "#1A1A1A" },
  { name: "Gray 900", hex: "#000000" },
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

const siteSections = [
  { id: "header", name: "Header", description: "Fixed navigation bar with Because Busy logo, anchor links (Services, Track Record, About, Contact), and primary CTA button.", tokens: "bg: Background / backdrop-blur, text: Link (#666666), CTA: Accent (#000000)" },
  { id: "hero", name: "Hero", description: "Full-width intro with 'Since 2005' label, display heading 'We run what you can't get to anymore.', subtitle, and primary + secondary action buttons.", tokens: "heading: Text Primary, accent word: Primary (#999999), buttons: Accent + #F5F5F5" },
  { id: "marquee", name: "Marquee", description: "Infinite horizontal scroll of expertise keywords: Operations, Transformation, Growth, Outbound, Data, Organization, Finance, Strategy.", tokens: "text: Primary (#999999), border: Gray 100" },
  { id: "services", name: "Services", description: "2×2 grid: Operational Backbone, Transformation & Data, Growth Engine, Legal Practice Ops. Numbered cards with title, description, and section header with CTA link.", tokens: "card bg: Gray 50, number: Primary (#999999), text: Link (#666666)" },
  { id: "work", name: "Engagements", description: "Stacked engagement rows with title, category badge, year, and arrow icon. Border-separated list.", tokens: "badge bg: Gray 100, badge text: Link, year: Primary (#999999)" },
  { id: "stats", name: "Stats", description: "Dark panel with 4 key metrics: 20 years, 57% profitability, 3 expertise pillars, 0€ external debt.", tokens: "panel bg: Accent (#000000), values: #FFFFFF, labels: Gray 400" },
  { id: "about", name: "About", description: "Two-column layout: 'We partner with founders who refuse to drown in their own operations.' Three converging forces: operations (Anne), systems & data (Georges), growth (Romain).", tokens: "tags bg: Gray 100, tag text: Link (#666666)" },
  { id: "story", name: "Story", description: "Full company history timeline (2005–2026) with 5 phases: BYAB founding, 2015 law firm specialization, 2020 consolidation, 2025 Georges Grosz joins, 2025–26 Romain Cornu joins. Contains 14 external backlinks to company registries (annuaire-entreprises, Pappers, societe.com, Le Figaro), LinkedIn profiles (Anne Grosz, Georges Grosz, Romain Cornu), Vatier & Associés, Avizio, and Oysterz. Closes with brand promise quote on dark panel.", tokens: "year: Text Primary font-mono, text: Link (#666666), links: Text Primary underline, promise panel: Accent (#000000) bg, #FFFFFF text" },
  { id: "testimonial", name: "Testimonial", description: "Centered blockquote: 'They didn't just take work off my plate. They rebuilt how my company runs — and revenue followed.' — M. Laurent, Managing Partner.", tokens: "avatar bg: Primary (#999999), avatar text: Text Primary" },
  { id: "contact", name: "Contact", description: "Two-column layout with heading 'Let's take something off your plate.' + contact info (hello@becausebusy.com, Paris & La Rochelle) on left, form on right.", tokens: "inputs: default border/bg, submit: Accent (#000000)" },
  { id: "footer", name: "Footer", description: "Minimal bar with Because Busy logo, copyright text (© 2005–2026), and link to Design page.", tokens: "text: Link (#666666)" },
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
      style={{ background: copied ? "hsl(0, 0%, 90%)" : "transparent" }}
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
      style={{ color: "#666666" }}
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

  useEffect(() => {
    document.title = "Design — Because You Are Busy";
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
      document.title = "Because You Are Busy — Operations, Transformation & Growth Consulting Since 2005";
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

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" role="banner">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" aria-label="Home" data-testid="link-logo-home">
              <img src={logoHorizontalWhite} alt="BYAB logo" className="h-12 w-auto" data-testid="img-logo-header" />
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#999999]" aria-hidden="true" />
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
                The single source of truth for the Because Busy brand identity, design tokens,
                UI elements, and site structure. Everything needed to build and extend the site consistently.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
                <a
                  href="#colors"
                  data-testid="button-explore-system"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium transition-opacity duration-150"
                  style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                >
                  Explore system
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href="#sections"
                  data-testid="link-site-sections"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium border border-border/50 text-muted-foreground transition-opacity duration-150"
                  style={{ backgroundColor: "#F5F5F5" }}
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
                { label: "Sections", value: "11", description: "Available site sections" },
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
                  <DownloadButton src={logoSquareBlack} filename="byab-logomark-black.png" />
                </div>
              </figure>
              <figure className="relative rounded-lg border border-border/50 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-4" style={{ backgroundColor: "#000000" }}>
                <img src={logoSquareWhite} alt="Logomark on dark background" className="h-16 sm:h-20 w-16 sm:w-20" data-testid="img-logo-dark" />
                <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs font-medium" style={{ color: "#777777" }}>Dark background</figcaption>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <DownloadButton src={logoSquareWhite} filename="byab-logomark-white.png" />
                </div>
              </figure>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-4 sm:mb-6 uppercase tracking-wider">Horizontal Logo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <figure className="relative rounded-lg border border-border/50 bg-white p-8 sm:p-12 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-4">
                <img src={logoHorizontalWhite} alt="Horizontal logo on light background" className="h-auto w-48 sm:w-64" data-testid="img-logo-horizontal-light" />
                <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs text-muted-foreground font-medium">Light background</figcaption>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <DownloadButton src={logoHorizontalWhite} filename="byab-horizontal-logo-light.png" />
                </div>
              </figure>
              <figure className="relative rounded-lg border border-border/50 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-4" style={{ backgroundColor: "#000000" }}>
                <img src={logoHorizontalBlack} alt="Horizontal logo on dark background" className="h-auto w-48 sm:w-64" data-testid="img-logo-horizontal-dark" />
                <figcaption className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs font-medium" style={{ color: "#777777" }}>Dark background</figcaption>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <DownloadButton src={logoHorizontalBlack} filename="byab-horizontal-logo-dark.png" />
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
              <div className="flex" role="img" aria-label="Extended grayscale palette from white (#F5F5F5) to black (#000000)">
                {extendedPalette.map((color) => (
                  <div key={color.name} className="flex-1 h-16 sm:h-20" style={{ backgroundColor: color.hex }} />
                ))}
              </div>
              <div className="grid grid-cols-5 lg:grid-cols-10 divide-x divide-border/50">
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
                    { pair: "Accent on White", bg: "#000000", fg: "#FFFFFF", ratio: "AAA 21:1" },
                    { pair: "Link on White", bg: "#FFFFFF", fg: "#666666", ratio: "AA 5.74:1", border: true },
                    { pair: "Text on Primary", bg: "#999999", fg: "#000000", ratio: "AA 5.32:1" },
                  ].map((item) => (
                    <div key={item.pair} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <dt className="sr-only">{item.pair}</dt>
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: item.bg, color: item.fg, border: item.border ? "1px solid #E5E5E5" : "none" }}
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
                    { color: "#999999", name: "Primary", desc: "Large surface areas, section backgrounds, decorative elements" },
                    { color: "#000000", name: "Accent", desc: "Primary CTAs, important text, interactive elements" },
                    { color: "#666666", name: "Link", desc: "Clickable elements, secondary labels, navigation" },
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
                      style={{ width: item.value, backgroundColor: "#999999", minWidth: "4px" }}
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
                    style={{ backgroundColor: "#000000", color: "#FFFFFF", borderRadius: "10px", border: "1px solid #666666" }}
                    role="presentation"
                  >
                    Start a project
                  </span>
                  <span
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium opacity-50"
                    style={{ backgroundColor: "#000000", color: "#FFFFFF", borderRadius: "10px", border: "1px solid #666666" }}
                    role="presentation"
                  >
                    Disabled
                  </span>
                </div>
                <dl className="space-y-2">
                  {[
                    { prop: "Background", val: "#000000" },
                    { prop: "Text", val: "#FFFFFF" },
                    { prop: "Border", val: "#666666" },
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
                    style={{ backgroundColor: "#F5F5F5", color: "#000000", borderRadius: "0px" }}
                    role="presentation"
                  >
                    View our work
                  </span>
                  <span
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium border border-border/50 opacity-50"
                    style={{ backgroundColor: "#F5F5F5", color: "#000000", borderRadius: "0px" }}
                    role="presentation"
                  >
                    Disabled
                  </span>
                </div>
                <dl className="space-y-2">
                  {[
                    { prop: "Background", val: "#F5F5F5" },
                    { prop: "Text", val: "#000000" },
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
                { title: "Default Card", desc: "Subtle background with light border", bg: "#F5F5F5", borderCol: "#E5E5E5", textColor: undefined, subColor: undefined, specs: { bg: "#F5F5F5", border: "#E5E5E5", radius: "8px" } },
                { title: "Elevated Card", desc: "White background with subtle shadow", bg: "#FFFFFF", borderCol: "#E5E5E5", textColor: undefined, subColor: undefined, specs: { bg: "#FFFFFF", shadow: "sm", radius: "8px" } },
                { title: "Dark Card", desc: "For dark sections and footers", bg: "#000000", borderCol: undefined, textColor: "#FFFFFF", subColor: "#777777", specs: { bg: "#000000", text: "#FFFFFF", radius: "8px" } },
              ].map((card) => (
                <article
                  key={card.title}
                  className={`rounded-lg p-4 sm:p-6 ${card.borderCol ? "border" : ""}`}
                  style={{ backgroundColor: card.bg, borderColor: card.borderCol }}
                  data-testid={`card-demo-${card.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="w-full h-20 sm:h-24 rounded-md mb-3 sm:mb-4" style={{ backgroundColor: "#999999", opacity: card.textColor ? 0.15 : 0.25 }} aria-hidden="true" />
                  <h4 className="text-sm font-medium" style={{ color: card.textColor || undefined }}>{card.title}</h4>
                  <p className="text-xs mt-1" style={{ color: card.subColor || undefined }}>{card.desc}</p>
                  <dl className="mt-3 space-y-1.5">
                    {Object.entries(card.specs).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2 text-[10px]">
                        <dt style={{ color: card.subColor || undefined }} className="text-muted-foreground">{k}</dt>
                        <dd className="font-mono" style={{ color: card.textColor ? "#999999" : undefined }}>{v}</dd>
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
                      <span className="text-xs font-mono" style={{ color: "#999999" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">{section.name}</h3>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{section.description}</p>
                      <p className="text-xs font-mono mt-2" style={{ color: "#777777" }}>{section.tokens}</p>
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
                    style={{ backgroundColor: "#E5E5E5", color: "#666666" }}
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
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: "#999999" }} aria-hidden="true">{p.num}</div>
                    <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </article>
              ))}
            </div>

            <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30 mb-8 sm:mb-12">
              <h3 className="text-base font-semibold text-foreground mb-6">Design Tokens Reference</h3>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <pre className="p-4 sm:p-5 text-xs sm:text-sm leading-relaxed overflow-x-auto" style={{ backgroundColor: "#000000", color: "#999999" }}>
                  <code>{`/* Colors */
--color-primary: #999999;
--color-accent: #000000;
--color-background: #FFFFFF;
--color-text: #000000;
--color-link: #666666;

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
            <div className="p-6 sm:p-8 rounded-lg" style={{ backgroundColor: "#000000" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <img src={logoHorizontalBlack} alt="BYAB logo" className="h-6 w-auto mb-3" />
                  <p className="text-sm leading-relaxed" style={{ color: "#777777" }}>
                    Components maintained by the design team.
                  </p>
                </div>
                <p className="text-xs" style={{ color: "#666666" }}>
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
