import { useEffect } from "react";
import { siteConfig } from "@content/site.config";
import { whyContent } from "@content/why";
import { WhyHero } from "@/sections/why/hero";
import { WhyProof } from "@/sections/why/proof";
import { WhyProblem } from "@/sections/why/problem";
import { WhyHow } from "@/sections/why/how";
import { WhyModel } from "@/sections/why/model";
import { WhyTrack } from "@/sections/why/track";
import { WhyCta } from "@/sections/why/cta";
import { WhyAppendix } from "@/sections/why/appendix";
import { WhyFooter } from "@/sections/why/why-footer";

/**
 * /why — public, indexable conversion page ("executive operations manual"
 * art direction, graduated from the approved canvas mockup). Copy lives in
 * content/why.ts; shared collections (stats, pains, engagements,
 * testimonial, FAQ) come from their own content/ files.
 *
 * The static shell (client/why/index.html.template) carries the real head;
 * this client-side title swap only covers SPA navigation and the dev server.
 */
export default function Why() {
  useEffect(() => {
    document.title = whyContent.seo.title;
    return () => {
      document.title = siteConfig.title;
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-800 selection:bg-accent-yellow selection:text-gray-800 flex flex-col items-center overflow-x-hidden"
      data-testid="why-page-root"
    >
      <a
        href="#why-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background"
      >
        Skip to main content
      </a>
      <div className="w-full max-w-[1280px] bg-white border-x border-gray-100 mx-auto">
        <WhyHero />
        <main id="why-main">
          <WhyProof />
          <WhyProblem />
          <WhyHow />
          <WhyModel />
          <WhyTrack />
          <WhyCta />
          <WhyAppendix />
        </main>
        <WhyFooter />
      </div>
    </div>
  );
}
