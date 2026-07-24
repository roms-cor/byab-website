import { Header } from "@/sections/home/header";
import { Hero } from "@/sections/home/hero";
import { Marquee } from "@/sections/home/marquee";
import { PainRecognition } from "@/sections/home/pain-recognition";
import { Services } from "@/sections/home/services";
import { Stats } from "@/sections/home/stats";
import { Work } from "@/sections/home/work";
import { About } from "@/sections/home/about";
import { Team } from "@/sections/home/team";
import { Story } from "@/sections/home/story";
import { Testimonial } from "@/sections/home/testimonial";
import { Faq } from "@/sections/home/faq";
import { Contact } from "@/sections/home/contact";
import { Footer } from "@/sections/home/footer";

/**
 * Homepage — a thin, ordered assembly of the sections in @/sections/home
 * (one file per section; stateful sections consume hooks from @/hooks).
 * The section order below is the SEO-validated page structure, and this
 * default export is rendered by both the router and the prerender entry.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:text-sm"
      >
        Skip to main content
      </a>
      <main id="main-content" role="main">
        <Hero />
        <Marquee />
        <PainRecognition />
        <Services />
        <Stats />
        <Work />
        <About />
        <Team />
        <Story />
        <Testimonial />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
