import { useMemo } from "react";
import { CopyButton } from "./copy-button";
import { tokenRefs, type TokenText } from "./tokens";

const makeBrandColors = (t: TokenText) => [
  { name: "Primary", hex: t.gray300, css: tokenRefs.gray300, swatch: "bg-gray-300", usage: "Backgrounds, subtle accents, decorative fills" },
  { name: "Accent", hex: t.gray900, css: tokenRefs.gray900, swatch: "bg-gray-900", usage: "Buttons, headings, primary CTAs" },
  { name: "Background", hex: t.white, css: tokenRefs.white, swatch: "bg-background", usage: "Page backgrounds, content areas" },
  { name: "Text Primary", hex: t.gray900, css: tokenRefs.gray900, swatch: "bg-gray-900", usage: "Body text, headings" },
  { name: "Link", hex: t.gray500, css: tokenRefs.gray500, swatch: "bg-gray-500", usage: "Links, secondary text, navigation" },
];

const makeExtendedPalette = (t: TokenText) => [
  { name: "Gray 50", hex: t.gray50, css: tokenRefs.gray50, swatch: "bg-gray-50" },
  { name: "Gray 100", hex: t.gray100, css: tokenRefs.gray100, swatch: "bg-gray-100" },
  { name: "Gray 200", hex: t.gray200, css: tokenRefs.gray200, swatch: "bg-gray-200" },
  { name: "Gray 225", hex: t.gray225, css: tokenRefs.gray225, swatch: "bg-gray-225" },
  { name: "Gray 250", hex: t.gray250, css: tokenRefs.gray250, swatch: "bg-gray-250" },
  { name: "Gray 300", hex: t.gray300, css: tokenRefs.gray300, swatch: "bg-gray-300" },
  { name: "Gray 350", hex: t.gray350, css: tokenRefs.gray350, swatch: "bg-gray-350" },
  { name: "Gray 400", hex: t.gray400, css: tokenRefs.gray400, swatch: "bg-gray-400" },
  { name: "Gray 450", hex: t.gray450, css: tokenRefs.gray450, swatch: "bg-gray-450" },
  { name: "Gray 500", hex: t.gray500, css: tokenRefs.gray500, swatch: "bg-gray-500" },
  { name: "Gray 550", hex: t.gray550, css: tokenRefs.gray550, swatch: "bg-gray-550" },
  { name: "Gray 600", hex: t.gray600, css: tokenRefs.gray600, swatch: "bg-gray-600" },
  { name: "Gray 700", hex: t.gray700, css: tokenRefs.gray700, swatch: "bg-gray-700" },
  { name: "Gray 800", hex: t.gray800, css: tokenRefs.gray800, swatch: "bg-gray-800" },
  { name: "Gray 900", hex: t.gray900, css: tokenRefs.gray900, swatch: "bg-gray-900" },
];

export function ColorsSection({ tok }: { tok: TokenText }) {
  const brandColors = useMemo(() => makeBrandColors(tok), [tok]);
  const extendedPalette = useMemo(() => makeExtendedPalette(tok), [tok]);

  return (
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
              className={`w-full aspect-[4/3] rounded-lg mb-3 sm:mb-4 border border-border/50 ${color.swatch}`}
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
            <div key={color.name} className={`flex-1 h-16 sm:h-20 ${color.swatch}`} />
          ))}
        </div>
        <div className="grid grid-cols-5 divide-x divide-border/50">
          {extendedPalette.map((color) => (
            <div key={color.name} className="p-2 sm:p-3" data-testid={`palette-${color.name.toLowerCase().replace(/\s/g, "-")}`}>
              <p className="text-4xs sm:text-3xs font-medium text-foreground truncate">{color.name}</p>
              <code className="text-4xs sm:text-3xs font-mono text-muted-foreground">{color.hex}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <article className="p-4 sm:p-6 rounded-lg border border-border/50 bg-card/30">
          <h3 className="text-sm font-semibold text-foreground mb-4">Accessibility Contrast Ratios</h3>
          <dl className="space-y-3">
            {[
              { pair: "Accent on White", chip: "bg-gray-900 text-background", ratio: "AAA 21:1" },
              { pair: "Link on White", chip: "bg-background text-gray-500 border border-gray-100", ratio: "AA 5.74:1" },
              { pair: "Text on Primary", chip: "bg-gray-300 text-gray-900", ratio: "AA 5.32:1" },
            ].map((item) => (
              <div key={item.pair} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <dt className="sr-only">{item.pair}</dt>
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${item.chip}`}
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
              { dot: "bg-gray-300", name: "Primary", desc: "Large surface areas, section backgrounds, decorative elements" },
              { dot: "bg-gray-900", name: "Accent", desc: "Primary CTAs, important text, interactive elements" },
              { dot: "bg-gray-500", name: "Link", desc: "Clickable elements, secondary labels, navigation" },
            ].map((item) => (
              <div key={item.name} className="flex items-start gap-3">
                <dt>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${item.dot}`} aria-hidden="true" />
                  <span className="sr-only">{item.name}</span>
                </dt>
                <dd><span className="font-medium text-foreground">{item.name}</span> — {item.desc}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
}
