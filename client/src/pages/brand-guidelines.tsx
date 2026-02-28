import { useState, useEffect, useRef } from "react";
import { Copy, Check, ChevronRight, ArrowDown } from "lucide-react";
import logoSvg from "@assets/logo.svg";

const brandColors = [
  { name: "Primary", hex: "#B5BDC9", hsl: "216, 14%, 75%", usage: "Primary brand color, used for backgrounds and subtle accents" },
  { name: "Accent", hex: "#202124", hsl: "220, 6%, 13%", usage: "Dark accent for buttons, headings, and emphasis" },
  { name: "Background", hex: "#FFFFFF", hsl: "0, 0%, 100%", usage: "Page backgrounds and content areas" },
  { name: "Text Primary", hex: "#1C1D1F", hsl: "220, 6%, 12%", usage: "Main body text and headings" },
  { name: "Link", hex: "#505967", hsl: "215, 12%, 36%", usage: "Links, secondary text, and supporting elements" },
];

const extendedPalette = [
  { name: "Slate 50", hex: "#F8F9FA" },
  { name: "Slate 100", hex: "#EEF0F3" },
  { name: "Slate 200", hex: "#D8DCE2" },
  { name: "Slate 300", hex: "#B5BDC9" },
  { name: "Slate 400", hex: "#8C95A5" },
  { name: "Slate 500", hex: "#505967" },
  { name: "Slate 600", hex: "#3A4250" },
  { name: "Slate 700", hex: "#2A3140" },
  { name: "Slate 800", hex: "#202124" },
  { name: "Slate 900", hex: "#1C1D1F" },
];

const typographyScale = [
  { name: "Display", size: "64px", weight: "600", lineHeight: "1.1", tracking: "-0.02em", tag: "h1" },
  { name: "Heading 1", size: "48px", weight: "600", lineHeight: "1.15", tracking: "-0.02em", tag: "h1" },
  { name: "Heading 2", size: "36px", weight: "600", lineHeight: "1.2", tracking: "-0.015em", tag: "h2" },
  { name: "Heading 3", size: "28px", weight: "600", lineHeight: "1.25", tracking: "-0.01em", tag: "h3" },
  { name: "Heading 4", size: "22px", weight: "600", lineHeight: "1.3", tracking: "-0.005em", tag: "h4" },
  { name: "Body Large", size: "18px", weight: "400", lineHeight: "1.6", tracking: "0em", tag: "p" },
  { name: "Body", size: "16px", weight: "400", lineHeight: "1.6", tracking: "0em", tag: "p" },
  { name: "Body Small", size: "14px", weight: "400", lineHeight: "1.5", tracking: "0em", tag: "p" },
  { name: "Caption", size: "12px", weight: "500", lineHeight: "1.4", tracking: "0.02em", tag: "span" },
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

const sections = [
  { id: "overview", label: "Overview" },
  { id: "logo", label: "Logo" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "components", label: "Components" },
  { id: "guidelines", label: "Guidelines" },
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
      style={{ background: copied ? "hsl(216, 12%, 92%)" : "transparent" }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function ColorSwatch({ color }: { color: typeof brandColors[0] }) {
  return (
    <div data-testid={`swatch-${color.name.toLowerCase().replace(/\s/g, "-")}`} className="group">
      <div
        className="w-full aspect-[4/3] rounded-lg mb-4 border border-border/50 transition-transform duration-200"
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground" data-testid={`text-color-name-${color.name.toLowerCase().replace(/\s/g, "-")}`}>{color.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5" data-testid={`text-color-usage-${color.name.toLowerCase().replace(/\s/g, "-")}`}>{color.usage}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1">
          <code className="text-xs font-mono text-muted-foreground">{color.hex}</code>
          <CopyButton text={color.hex} />
        </div>
      </div>
    </div>
  );
}

function SideNav({ activeSection }: { activeSection: string }) {
  return (
    <nav className="space-y-0.5">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          data-testid={`link-nav-${section.id}`}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
            activeSection === section.id
              ? "text-foreground font-medium bg-accent"
              : "text-muted-foreground"
          }`}
        >
          {activeSection === section.id && (
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
          )}
          <span>{section.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function BrandGuidelines() {
  const [activeSection, setActiveSection] = useState("overview");
  const mainRef = useRef<HTMLDivElement>(null);

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

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSvg} alt="Logo" className="h-5" data-testid="img-logo-header" />
            <span className="text-border/80 text-sm font-light">/</span>
            <span className="text-sm font-medium text-muted-foreground">Brand Guidelines</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono px-2 py-1 rounded-md bg-accent">v1.0</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] py-8 px-4 border-r border-border/50">
          <SideNav activeSection={activeSection} />
        </aside>

        <main ref={mainRef} className="flex-1 min-w-0">
          <section id="overview" className="px-6 lg:px-16 py-16 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-xs font-medium text-muted-foreground mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B5BDC9]" />
                Design System
              </div>
              <h1
                className="text-5xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05]"
                data-testid="text-hero-title"
              >
                Brand<br />Guidelines
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mt-6 leading-relaxed max-w-xl">
                A comprehensive guide to our visual identity, design tokens, and component library. 
                Everything you need to build consistent, beautiful interfaces.
              </p>
              <div className="flex items-center gap-4 mt-10">
                <a
                  href="#colors"
                  data-testid="button-explore-system"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium transition-colors duration-150"
                  style={{ backgroundColor: "#202124", color: "#F3F4F6" }}
                >
                  Explore system
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Font Family", value: "Inter" },
                { label: "Base Unit", value: "8px" },
                { label: "Border Radius", value: "8px" },
                { label: "Color Scheme", value: "Light" },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-lg border border-border/50 bg-card/50" data-testid={`card-stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
                  <p className="text-lg font-semibold text-foreground mt-1.5" data-testid={`text-stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mx-6 lg:mx-16 border-t border-border/50" />

          <section id="logo" className="px-6 lg:px-16 py-16 lg:py-24">
            <div className="max-w-3xl mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">01</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-logo">
                Logo
              </h2>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Our logo is the cornerstone of our brand identity. Use it consistently across all touchpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative rounded-lg border border-border/50 bg-white p-12 flex items-center justify-center min-h-[200px]">
                <img src={logoSvg} alt="Logo on light" className="h-8" data-testid="img-logo-light" />
                <span className="absolute bottom-4 left-4 text-xs text-muted-foreground font-medium">Light background</span>
              </div>
              <div className="relative rounded-lg border border-border/50 p-12 flex items-center justify-center min-h-[200px]" style={{ backgroundColor: "#202124" }}>
                <img src={logoSvg} alt="Logo on dark" className="h-8 invert" data-testid="img-logo-dark" />
                <span className="absolute bottom-4 left-4 text-xs font-medium" style={{ color: "#8C95A5" }}>Dark background</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center mb-4">
                  <span className="text-xs font-bold text-foreground">48</span>
                </div>
                <p className="text-sm font-medium text-foreground">Minimum Size</p>
                <p className="text-xs text-muted-foreground mt-1">48px width minimum for digital</p>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center mb-4">
                  <span className="text-xs font-bold text-foreground">2x</span>
                </div>
                <p className="text-sm font-medium text-foreground">Clear Space</p>
                <p className="text-xs text-muted-foreground mt-1">2x the height of the logomark around all sides</p>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/50">
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center mb-4">
                  <span className="text-xs font-bold text-foreground">SVG</span>
                </div>
                <p className="text-sm font-medium text-foreground">File Format</p>
                <p className="text-xs text-muted-foreground mt-1">Use SVG for web, PNG for social and print</p>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-lg border border-border/50 bg-card/30">
              <h3 className="text-sm font-semibold text-foreground mb-4">Usage Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { rule: "Maintain original proportions", do: true },
                  { rule: "Use approved color variations only", do: true },
                  { rule: "Ensure adequate contrast against backgrounds", do: true },
                  { rule: "Keep minimum clear space around logo", do: true },
                  { rule: "Do not stretch or distort", do: false },
                  { rule: "Do not add effects or shadows", do: false },
                  { rule: "Do not place on busy backgrounds", do: false },
                  { rule: "Do not rotate or skew", do: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.do ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                      {item.do ? "+" : "-"}
                    </span>
                    <span className="text-muted-foreground">{item.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mx-6 lg:mx-16 border-t border-border/50" />

          <section id="colors" className="px-6 lg:px-16 py-16 lg:py-24">
            <div className="max-w-3xl mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">02</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-colors">
                Colors
              </h2>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Our color palette is designed to be clean, professional, and accessible. 
                Each color has a specific purpose in the design system.
              </p>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Brand Colors</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
              {brandColors.map((color) => (
                <ColorSwatch key={color.name} color={color} />
              ))}
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Extended Palette</h3>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="flex">
                {extendedPalette.map((color) => (
                  <div
                    key={color.name}
                    className="flex-1 h-20 first:rounded-tl-lg last:rounded-tr-lg"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-5 lg:grid-cols-10 divide-x divide-border/50">
                {extendedPalette.map((color) => (
                  <div key={color.name} className="p-3">
                    <p className="text-[10px] font-medium text-foreground truncate">{color.name}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      <code className="text-[10px] font-mono text-muted-foreground">{color.hex}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border/50 bg-card/30">
                <h4 className="text-sm font-semibold text-foreground mb-4">Accessibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#202124", color: "#FFFFFF" }}>Aa</div>
                      <span className="text-sm text-muted-foreground">Accent on White</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">AAA 14.7:1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#FFFFFF", color: "#505967", border: "1px solid #EEF0F3" }}>Aa</div>
                      <span className="text-sm text-muted-foreground">Link on White</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">AA 5.2:1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#B5BDC9", color: "#1C1D1F" }}>Aa</div>
                      <span className="text-sm text-muted-foreground">Text on Primary</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">AA 7.1:1</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border/50 bg-card/30">
                <h4 className="text-sm font-semibold text-foreground mb-4">Color Usage</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: "#B5BDC9" }} />
                    <p><span className="font-medium text-foreground">Primary</span> - Use for large surface areas, section backgrounds, and decorative elements</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: "#202124" }} />
                    <p><span className="font-medium text-foreground">Accent</span> - Use for primary CTAs, important text, and interactive elements</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: "#505967" }} />
                    <p><span className="font-medium text-foreground">Link</span> - Use for clickable elements, secondary labels, and navigation</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-6 lg:mx-16 border-t border-border/50" />

          <section id="typography" className="px-6 lg:px-16 py-16 lg:py-24">
            <div className="max-w-3xl mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">03</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-typography">
                Typography
              </h2>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Inter is our primary typeface, providing excellent readability and a modern aesthetic 
                across all sizes and weights.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Primary Typeface</p>
                <p className="text-5xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Inter
                </p>
                <p className="text-base text-muted-foreground mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 !@#$%^&*()
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {["400", "500", "600", "700"].map((w) => (
                    <span key={w} className="px-2.5 py-1 rounded-md bg-accent text-xs font-mono text-muted-foreground">{w}</span>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Monospace</p>
                <p className="text-5xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  JetBrains
                </p>
                <p className="text-base text-muted-foreground mt-3 font-mono">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 {"<>"} {"{ }"} =&gt; ()
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {["400", "500", "700"].map((w) => (
                    <span key={w} className="px-2.5 py-1 rounded-md bg-accent text-xs font-mono text-muted-foreground">{w}</span>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Type Scale</h3>
            <div className="space-y-0 rounded-lg border border-border/50 overflow-hidden">
              {typographyScale.map((item, i) => (
                <div
                  key={item.name}
                  data-testid={`row-type-${item.name.toLowerCase().replace(/\s/g, "-")}`}
                  className={`flex items-baseline gap-6 lg:gap-10 px-6 py-5 ${
                    i !== typographyScale.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <div className="w-28 lg:w-36 flex-shrink-0">
                    <p className="text-xs text-muted-foreground font-medium" data-testid={`text-type-name-${item.name.toLowerCase().replace(/\s/g, "-")}`}>{item.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{item.size} / {item.lineHeight}</p>
                  </div>
                  <p
                    className="text-foreground truncate flex-1 min-w-0"
                    style={{
                      fontSize: item.size,
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

            <div className="mt-12 p-6 rounded-lg border border-border/50 bg-card/30">
              <h4 className="text-sm font-semibold text-foreground mb-4">Font Weight Usage</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { weight: "Regular (400)", usage: "Body text, descriptions, paragraphs" },
                  { weight: "Medium (500)", usage: "Labels, captions, navigation items" },
                  { weight: "Semibold (600)", usage: "Headings, titles, emphasis" },
                  { weight: "Bold (700)", usage: "Display headings, key metrics" },
                ].map((item) => (
                  <div key={item.weight}>
                    <p className="text-sm font-medium text-foreground">{item.weight}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mx-6 lg:mx-16 border-t border-border/50" />

          <section id="spacing" className="px-6 lg:px-16 py-16 lg:py-24">
            <div className="max-w-3xl mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">04</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-spacing">
                Spacing
              </h2>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Our spacing system is based on an 8px grid, providing consistent rhythm 
                and alignment across all interfaces.
              </p>
            </div>

            <div className="rounded-lg border border-border/50 overflow-hidden">
              {spacingScale.map((item, i) => (
                <div
                  key={item.name}
                  data-testid={`row-spacing-${item.name}`}
                  className={`flex items-center gap-6 px-6 py-4 ${
                    i !== spacingScale.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <div className="w-16 flex-shrink-0">
                    <code className="text-xs font-mono font-medium text-foreground" data-testid={`text-spacing-name-${item.name}`}>{item.name}</code>
                  </div>
                  <div className="w-16 flex-shrink-0 text-xs font-mono text-muted-foreground">
                    {item.value}
                  </div>
                  <div className="w-12 flex-shrink-0 text-xs text-muted-foreground">
                    {item.multiplier}
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-3 rounded-sm"
                      style={{
                        width: item.value,
                        backgroundColor: "#B5BDC9",
                        minWidth: "4px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-border/50 bg-card/30">
                <p className="text-sm font-semibold text-foreground mb-2">Padding</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use consistent padding within components: 16px for compact elements, 24px for cards, 
                  and 32-48px for page sections.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/30">
                <p className="text-sm font-semibold text-foreground mb-2">Gap</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use 8px between tightly related elements, 16px between grouped items, 
                  and 24-32px between distinct sections.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/30">
                <p className="text-sm font-semibold text-foreground mb-2">Border Radius</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Default radius is 8px. Use 10px for buttons, 6px for small elements, 
                  and 12-16px for cards and containers.
                </p>
              </div>
            </div>
          </section>

          <div className="mx-6 lg:mx-16 border-t border-border/50" />

          <section id="components" className="px-6 lg:px-16 py-16 lg:py-24">
            <div className="max-w-3xl mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">05</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-components">
                Components
              </h2>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Core UI components with their styling specifications. Every component follows 
                the design tokens defined above.
              </p>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Buttons</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">Primary Button</p>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    data-testid="button-demo-primary"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-colors duration-150"
                    style={{
                      backgroundColor: "#202124",
                      color: "#F3F4F6",
                      borderRadius: "10px",
                      border: "1px solid #505967",
                    }}
                  >
                    Start for free
                  </button>
                  <button
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-colors duration-150 opacity-50 cursor-not-allowed"
                    style={{
                      backgroundColor: "#202124",
                      color: "#F3F4F6",
                      borderRadius: "10px",
                      border: "1px solid #505967",
                    }}
                    disabled
                  >
                    Disabled
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Background</span>
                    <code className="font-mono text-foreground">#202124</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Text</span>
                    <code className="font-mono text-foreground">#F3F4F6</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Border</span>
                    <code className="font-mono text-foreground">#505967</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Radius</span>
                    <code className="font-mono text-foreground">10px</code>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">Secondary Button</p>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    data-testid="button-demo-secondary"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-colors duration-150 border border-border/50"
                    style={{
                      backgroundColor: "#FAFAFB",
                      color: "#232529",
                      borderRadius: "0px",
                    }}
                  >
                    Ask Attio
                  </button>
                  <button
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-colors duration-150 border border-border/50 opacity-50 cursor-not-allowed"
                    style={{
                      backgroundColor: "#FAFAFB",
                      color: "#232529",
                      borderRadius: "0px",
                    }}
                    disabled
                  >
                    Disabled
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Background</span>
                    <code className="font-mono text-foreground">#FAFAFB</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Text</span>
                    <code className="font-mono text-foreground">#232529</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Radius</span>
                    <code className="font-mono text-foreground">0px</code>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Input Fields</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">Text Input</p>
                <input
                  type="text"
                  placeholder="Enter your email"
                  data-testid="input-demo-text"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Height</span>
                    <code className="font-mono text-foreground">40px</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Padding</span>
                    <code className="font-mono text-foreground">0 16px</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-20">Radius</span>
                    <code className="font-mono text-foreground">8px</code>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-6">States</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value="Active input"
                    readOnly
                    className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-ring bg-background text-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    value="Disabled input"
                    disabled
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                  />
                  <input
                    type="text"
                    value="Error state"
                    readOnly
                    className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-red-400 bg-background text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Cards & Containers</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border/50 bg-card/50 p-6">
                <div className="w-full h-24 rounded-md mb-4" style={{ backgroundColor: "#B5BDC9", opacity: 0.3 }} />
                <p className="text-sm font-medium text-foreground">Default Card</p>
                <p className="text-xs text-muted-foreground mt-1">Subtle background with light border</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">bg</span>
                    <code className="font-mono text-foreground">#F8F9FA</code>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">border</span>
                    <code className="font-mono text-foreground">#EEF0F3</code>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">radius</span>
                    <code className="font-mono text-foreground">8px</code>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm border border-border/30">
                <div className="w-full h-24 rounded-md mb-4" style={{ backgroundColor: "#B5BDC9", opacity: 0.2 }} />
                <p className="text-sm font-medium text-foreground">Elevated Card</p>
                <p className="text-xs text-muted-foreground mt-1">White background with subtle shadow</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">bg</span>
                    <code className="font-mono text-foreground">#FFFFFF</code>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">shadow</span>
                    <code className="font-mono text-foreground">sm</code>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">radius</span>
                    <code className="font-mono text-foreground">8px</code>
                  </div>
                </div>
              </div>
              <div className="rounded-lg p-6" style={{ backgroundColor: "#202124" }}>
                <div className="w-full h-24 rounded-md mb-4" style={{ backgroundColor: "#B5BDC9", opacity: 0.15 }} />
                <p className="text-sm font-medium" style={{ color: "#F3F4F6" }}>Dark Card</p>
                <p className="text-xs mt-1" style={{ color: "#8C95A5" }}>For dark sections and footers</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span style={{ color: "#8C95A5" }}>bg</span>
                    <code className="font-mono" style={{ color: "#B5BDC9" }}>#202124</code>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span style={{ color: "#8C95A5" }}>text</span>
                    <code className="font-mono" style={{ color: "#B5BDC9" }}>#F3F4F6</code>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span style={{ color: "#8C95A5" }}>radius</span>
                    <code className="font-mono" style={{ color: "#B5BDC9" }}>8px</code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-6 lg:mx-16 border-t border-border/50" />

          <section id="guidelines" className="px-6 lg:px-16 py-16 lg:py-24">
            <div className="max-w-3xl mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">06</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground" data-testid="text-section-guidelines">
                Guidelines
              </h2>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Best practices and principles for applying the design system consistently.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: "#B5BDC9" }}>01</div>
                  <h3 className="text-base font-semibold text-foreground">Hierarchy</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Use size, weight, and color to create clear visual hierarchy. Headings should be 
                  semibold (600) and body text regular (400). Use muted foreground for secondary 
                  information.
                </p>
              </div>
              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: "#B5BDC9" }}>02</div>
                  <h3 className="text-base font-semibold text-foreground">Consistency</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Stick to the spacing scale and never use arbitrary values. All spacing 
                  should be multiples of 8px. Maintain consistent padding and gaps throughout 
                  the interface.
                </p>
              </div>
              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: "#B5BDC9" }}>03</div>
                  <h3 className="text-base font-semibold text-foreground">Restraint</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Less is more. Avoid unnecessary decoration, shadows, or color. Let content 
                  breathe with generous whitespace. Every element should serve a clear purpose.
                </p>
              </div>
              <div className="p-8 rounded-lg border border-border/50 bg-card/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: "#B5BDC9" }}>04</div>
                  <h3 className="text-base font-semibold text-foreground">Accessibility</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All text must meet WCAG AA contrast requirements. Interactive elements need 
                  visible focus states. Use semantic HTML and proper ARIA labels for screen readers.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-lg border border-border/50 bg-card/30 mb-12">
              <h3 className="text-base font-semibold text-foreground mb-6">Design Tokens Reference</h3>
              <div className="rounded-lg border border-border/50 overflow-hidden font-mono text-xs">
                <div className="bg-[#202124] text-[#B5BDC9] p-5 leading-relaxed">
                  <div className="text-[#8C95A5]">{"/* Design Tokens */"}</div>
                  <div className="mt-2">
                    <span className="text-[#B5BDC9]">--color-primary:</span> <span className="text-white">#B5BDC9</span>;
                  </div>
                  <div>
                    <span className="text-[#B5BDC9]">--color-accent:</span> <span className="text-white">#202124</span>;
                  </div>
                  <div>
                    <span className="text-[#B5BDC9]">--color-background:</span> <span className="text-white">#FFFFFF</span>;
                  </div>
                  <div>
                    <span className="text-[#B5BDC9]">--color-text:</span> <span className="text-white">#1C1D1F</span>;
                  </div>
                  <div>
                    <span className="text-[#B5BDC9]">--color-link:</span> <span className="text-white">#505967</span>;
                  </div>
                  <div className="mt-3 text-[#8C95A5]">{"/* Typography */"}</div>
                  <div>
                    <span className="text-[#B5BDC9]">--font-sans:</span> <span className="text-white">'Inter', sans-serif</span>;
                  </div>
                  <div>
                    <span className="text-[#B5BDC9]">--font-mono:</span> <span className="text-white">'JetBrains Mono', monospace</span>;
                  </div>
                  <div className="mt-3 text-[#8C95A5]">{"/* Spacing */"}</div>
                  <div>
                    <span className="text-[#B5BDC9]">--space-unit:</span> <span className="text-white">8px</span>;
                  </div>
                  <div>
                    <span className="text-[#B5BDC9]">--radius:</span> <span className="text-white">8px</span>;
                  </div>
                  <div>
                    <span className="text-[#B5BDC9]">--radius-button:</span> <span className="text-white">10px</span>;
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: "#202124" }}>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoSvg} alt="Logo" className="h-4 invert" />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#8C95A5" }}>
                This brand guidelines document is maintained by the design team. For questions, 
                updates, or asset requests, reach out to the brand team.
              </p>
              <p className="text-xs mt-4" style={{ color: "#505967" }}>
                Last updated: February 2026 &middot; Version 1.0
              </p>
            </div>
          </section>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
