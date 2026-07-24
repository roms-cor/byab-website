import type { TokenText } from "./tokens";

export function GuidelinesSection({ tok }: { tok: TokenText }) {
  return (
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
              <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm bg-gray-300" aria-hidden="true">{p.num}</div>
              <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </article>
        ))}
      </div>

      <article className="p-6 sm:p-8 rounded-lg border border-border/50 bg-card/30 mb-8 sm:mb-12">
        <h3 className="text-base font-semibold text-foreground mb-6">Design Tokens Reference</h3>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <pre className="p-4 sm:p-5 text-xs sm:text-sm leading-relaxed overflow-x-auto bg-foreground text-gray-300">
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
  );
}
