import { ArrowRight } from "lucide-react";
import { siteConfig } from "@content/site.config";
import { TeamSlider } from "./team-slider";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="lg:pt-8">
            <p
              className="text-xs uppercase tracking-eyebrow font-medium mb-6 text-muted-foreground"
              data-testid="text-hero-label"
            >
              Since 2005 — Operations · Transformation · Growth
            </p>
            <h1
              id="hero-heading"
              className="sm:text-6xl lg:text-hero-lg font-semibold tracking-tight text-foreground text-hero"
              data-testid="text-hero-title"
            >
              We run what
              <br />
              you can't get to
              <br />
              <span className="text-gray-450">anymore.</span>
            </h1>
            <p
              className="text-base sm:text-lg mt-6 sm:mt-8 leading-relaxed max-w-lg text-muted-foreground"
              data-testid="text-hero-description"
            >
              <strong className="font-medium text-foreground">{siteConfig.slogan},</strong> we take
              operations, transformation, and growth off the executive desk and run them — so your
              time goes to the decisions only a CEO or COO can make.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
              <a
                href="#contact"
                data-testid="button-hero-primary"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-button text-sm font-medium transition-opacity duration-150 bg-foreground text-background border border-muted-foreground"
              >
                Take work off my desk
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#approach"
                data-testid="button-hero-secondary"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border transition-opacity duration-150 bg-card text-foreground rounded-none border-gray-100"
              >
                See how we operate
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-6 sm:gap-8" data-testid="hero-proof">
              <div>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">20</p>
                <p className="text-xs font-mono mt-1 text-muted-foreground">Years running<br />executive ops</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">57%</p>
                <p className="text-xs font-mono mt-1 text-muted-foreground">Operating<br />profitability</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">0€</p>
                <p className="text-xs font-mono mt-1 text-muted-foreground">External debt<br />raised, ever</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <TeamSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
