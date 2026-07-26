import { siteConfig } from "@content/site.config";
import { whyContent } from "@content/why";
import { Reveal } from "./reveal";

export function WhyCta() {
  const { finalCta } = whyContent;
  return (
    <section id="why-cta" aria-labelledby="why-cta-heading" className="border-b border-gray-100">
      <div className="p-16 md:p-24 lg:p-32 bg-white text-center flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-px h-16 bg-gray-100 hidden md:block" aria-hidden="true"></div>

        <Reveal className="flex flex-col items-center">
          <h2
            id="why-cta-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-gray-800 leading-[1.05] mb-8 max-w-3xl px-4"
            data-testid="text-why-cta-title"
          >
            {finalCta.heading}
          </h2>
          <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl mb-16 px-4">{finalCta.description}</p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center justify-center bg-gray-800 text-white hover:bg-accent-yellow hover:text-gray-800 font-mono text-2xs font-bold uppercase tracking-label h-16 px-12 transition-colors mb-20 shadow-why-cta hover:shadow-none"
            data-testid="button-why-final-cta"
          >
            {finalCta.ctaLabel}
          </a>

          <div className="flex flex-col md:flex-row gap-12 md:gap-24 border-t border-gray-100 pt-12 w-full md:w-auto px-8 md:px-0">
            <div className="flex flex-col items-center">
              <div className="font-mono text-4xs text-gray-300 uppercase tracking-label mb-2">{finalCta.emailLabel}</div>
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-2xs text-gray-800 uppercase tracking-label font-medium transition-opacity duration-150 hover:opacity-70"
                data-testid="link-why-email"
              >
                {siteConfig.email}
              </a>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-mono text-4xs text-gray-300 uppercase tracking-label mb-2">{finalCta.basedInLabel}</div>
              <div className="font-mono text-2xs text-gray-800 uppercase tracking-label font-medium">{siteConfig.locations}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
