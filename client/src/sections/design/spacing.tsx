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

export function SpacingSection() {
  return (
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
                className="h-3 rounded-sm bg-gray-300 min-w-1"
                // eslint-disable-next-line no-restricted-syntax -- spacing-scale preview: the bar width is the token value from the spacingScale data table
                style={{ width: item.value }}
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
  );
}
