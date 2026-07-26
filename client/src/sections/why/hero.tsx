import { useEffect, useState } from "react";
import { siteConfig } from "@content/site.config";
import { whyContent } from "@content/why";
import { Reveal } from "./reveal";

const isServer = typeof window === "undefined";

/** Gauge bar target widths + stagger, by index (static literals so the
 *  Tailwind scanner sees them — classes can't be composed from content). */
const GAUGE_WIDTHS = ["w-[85%]", "w-full"] as const;
const GAUGE_DELAYS = ["delay-500", "delay-700"] as const;

/** Decorative operations-console card — the hero's proof motif. */
function RunbookConsole() {
  const { console: c } = whyContent;
  // Bars render at full width during the prerender (no JS = no animation),
  // then grow from zero on the client after first paint.
  const [grown, setGrown] = useState(isServer);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Reveal delay={1} className="w-full max-w-lg">
      <div className="bg-white border border-gray-100 p-6 shadow-runbook flex flex-col gap-6 relative">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="font-mono text-3xs uppercase tracking-label text-gray-800">{c.title}</div>
          <div className="flex gap-2 items-center">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse" aria-hidden="true" />
            <div className="font-mono text-3xs uppercase tracking-label text-gray-800">{c.statusLabel}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-end gap-3">
            <div className="text-5xl font-medium tracking-tighter text-gray-800 leading-none" data-testid="text-why-console-uptime">
              {c.uptimeValue}
            </div>
            <div className="font-mono text-3xs text-muted-foreground uppercase mb-1">{c.uptimeLabel}</div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="grid grid-cols-2 gap-6">
            {c.gauges.map((g, i) => (
              <div key={g.label}>
                <div className="font-mono text-4xs text-gray-300 uppercase mb-1">{g.label}</div>
                <div className="text-sm text-gray-800">{g.value}</div>
                <div className="h-1 w-full bg-gray-50 mt-2 overflow-hidden">
                  <div
                    className={`h-full bg-gray-800 transition-all duration-1000 ease-out motion-reduce:transition-none ${GAUGE_DELAYS[i] ?? ""} ${grown ? (GAUGE_WIDTHS[i] ?? "w-full") : "w-0"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-5 font-mono text-3xs text-muted-foreground leading-relaxed border border-gray-100">
          {c.terminalLines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
          <span className="text-gray-800 animate-pulse" aria-hidden="true">_</span>
        </div>
      </div>
    </Reveal>
  );
}

export function WhyHero() {
  const { hero } = whyContent;
  return (
    <header className="grid grid-cols-12 min-h-[90vh] border-b border-gray-100">
      <div className="col-span-12 lg:col-span-5 flex flex-col justify-between p-8 md:p-12 lg:p-16 border-r border-gray-100 bg-white z-10 relative">
        <div>
          <nav aria-label="Site" className="mb-16">
            <a
              href="/"
              className="font-mono text-xs font-bold uppercase tracking-label text-gray-800 transition-opacity duration-150 hover:opacity-70"
              data-testid="link-why-home"
            >
              {siteConfig.name}
            </a>
          </nav>
          <Reveal delay={1}>
            <p className="font-mono text-3xs uppercase tracking-label text-muted-foreground mb-8 flex items-center gap-3">
              <span className="w-4 h-px bg-gray-500" aria-hidden="true"></span>
              {hero.kicker}
            </p>
            <h1
              className="text-5xl md:text-6xl font-medium tracking-tight text-gray-800 leading-[1.05] mb-8 pr-4"
              data-testid="text-why-hero-title"
            >
              {hero.heading}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-md" data-testid="text-why-hero-description">
              {hero.description}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center justify-center bg-gray-800 hover:bg-foreground text-white font-mono text-2xs uppercase tracking-label h-14 px-8 transition-all hover:pr-6 group"
              data-testid="button-why-hero-cta"
            >
              {hero.ctaLabel}
              <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-3 transition-all" aria-hidden="true">
                →
              </span>
            </a>
          </Reveal>
        </div>
        <p className="font-mono text-3xs text-gray-300 uppercase tracking-label mt-16 md:mt-24">
          {hero.volumeLine}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-7 bg-gray-50 p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-dots" aria-hidden="true"></div>
        <RunbookConsole />
      </div>
    </header>
  );
}
