import { ArrowDown } from "lucide-react";
import { siteConfig } from "@content/site.config";

export function OverviewSection() {
  return (
    <section id="overview" aria-labelledby="overview-heading" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
      <article className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-xs font-medium text-muted-foreground mb-6 sm:mb-8" data-testid="badge-design-system">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" aria-hidden="true" />
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-sm font-medium transition-opacity duration-150 bg-foreground text-background"
          >
            Explore system
            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <a
            href="#sections"
            data-testid="link-site-sections"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-sm font-medium border border-border/50 text-muted-foreground transition-opacity duration-150 bg-card"
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
            <p className="text-3xs sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
            <p className="text-base sm:text-lg font-semibold text-foreground mt-1" data-testid={`text-stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}>{item.value}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
