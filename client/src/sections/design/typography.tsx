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

export function TypographySection() {
  return (
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
          <p className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight font-sans" data-testid="text-font-inter">
            Inter
          </p>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 font-sans">
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
              <p className="text-3xs font-mono text-muted-foreground/70 mt-0.5">
                {item.size} / {item.weight} / {item.lineHeight}
              </p>
            </div>
            <p
              role="cell"
              className="text-foreground truncate flex-1 min-w-0"
              // eslint-disable-next-line no-restricted-syntax -- type-scale preview: font metrics come straight from the typographyScale data table
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
  );
}
