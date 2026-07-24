import { siteConfig } from "@content/site.config";
import { timeline } from "@content/timeline";

export function Story() {
  return (
    <section id="story" aria-labelledby="story-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 bg-card">
      <div className="max-w-container mx-auto">
        <header className="mb-12 sm:mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-eyebrow font-medium mb-3 text-muted-foreground" aria-hidden="true">Our story</p>
          <h2
            id="story-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight"
            data-testid="text-section-story"
          >
            Twenty years of the same intuition:
            founders don't lack ideas — they lack
            time to execute them.
          </h2>
        </header>

        <div className="space-y-0">
          {timeline.map((entry, i) => (
            <article
              key={entry.year}
              className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-4 lg:gap-12 py-10 sm:py-12 border-t border-border/50"
              data-testid={`story-phase-${i}`}
            >
              <div className="flex items-start">
                <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-mono">{entry.year}</span>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {entry.photo && (
                    <img
                      src={entry.photo}
                      alt={entry.photoAlt || ""}
                      width={128}
                      height={128}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-border/50"
                      data-testid={`img-story-${entry.photoAlt?.split(" ")[0]?.toLowerCase()}`}
                    />
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">{entry.title}</h3>
                </div>
                {entry.content}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 p-8 sm:p-12 rounded-lg bg-foreground">
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold leading-snug tracking-tight text-background" data-testid="text-story-promise">
            "{siteConfig.slogan}, we do the work that frees your time —
            and we do it in a way that makes your growth more readable,
            more predictable, and better controlled."
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="text-xs font-medium text-gray-350">
              Operational depth — Anne, Cécile, {siteConfig.shortName}, law firms
            </span>
            <span className="text-xs text-gray-350">·</span>
            <span className="text-xs font-medium text-gray-350">
              Systems & data vision — Georges, CGI, Sorbonne
            </span>
            <span className="text-xs text-gray-350">·</span>
            <span className="text-xs font-medium text-gray-350">
              Growth engine — Romain, MerciApp, Clovis, Datananas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
