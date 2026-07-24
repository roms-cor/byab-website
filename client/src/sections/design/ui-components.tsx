import type { TokenText } from "./tokens";

export function UiComponentsSection({ tok }: { tok: TokenText }) {
  return (
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
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-button border border-muted-foreground"
              role="presentation"
            >
              Start a project
            </span>
            <span
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium opacity-50 bg-foreground text-background rounded-button border border-muted-foreground"
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
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium border border-border/50 bg-card text-foreground rounded-none"
              role="presentation"
            >
              View our work
            </span>
            <span
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium border border-border/50 opacity-50 bg-card text-foreground rounded-none"
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
          { title: "Default Card", desc: "Subtle background with light border", cardClass: "bg-gray-50 border border-gray-100", overlayClass: "opacity-25", titleClass: "", subClass: "", valClass: "", specs: { bg: tok.gray50, border: tok.gray100, radius: "8px" } },
          { title: "Elevated Card", desc: "White background with subtle shadow", cardClass: "bg-background border border-gray-100", overlayClass: "opacity-25", titleClass: "", subClass: "", valClass: "", specs: { bg: tok.white, shadow: "sm", radius: "8px" } },
          { title: "Dark Card", desc: "For dark sections and footers", cardClass: "bg-gray-900", overlayClass: "opacity-15", titleClass: "text-background", subClass: "text-gray-400", valClass: "text-gray-300", specs: { bg: tok.gray900, text: tok.white, radius: "8px" } },
        ].map((card) => (
          <article
            key={card.title}
            className={`rounded-lg p-4 sm:p-6 ${card.cardClass}`}
            data-testid={`card-demo-${card.title.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className={`w-full h-20 sm:h-24 rounded-md mb-3 sm:mb-4 bg-gray-300 ${card.overlayClass}`} aria-hidden="true" />
            <h4 className={`text-sm font-medium ${card.titleClass}`}>{card.title}</h4>
            <p className={`text-xs mt-1 ${card.subClass}`}>{card.desc}</p>
            <dl className="mt-3 space-y-1.5">
              {Object.entries(card.specs).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-3xs">
                  <dt className={card.subClass || "text-muted-foreground"}>{k}</dt>
                  <dd className={`font-mono ${card.valClass}`}>{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
