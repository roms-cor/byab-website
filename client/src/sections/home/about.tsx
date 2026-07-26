import { siteConfig } from "@content/site.config";
import { SectionHeading } from "@/components/section-heading";

export function About() {
  const pillars = [
    {
      name: "Operations-first",
      desc: `${siteConfig.name} starts where the friction is — not where it looks good. Every engagement is grounded in operational reality: 20+ years of law firm and SME back-office, executed hands-on, not delivered as a slide deck.`,
    },
    {
      name: "Data-driven",
      desc: `Intuition without measurement is noise. ${siteConfig.name} builds decision systems — dashboards, governance frameworks, operational metrics — so you steer on numbers you trust: what's working, what's leaking, what to act on next.`,
    },
    {
      name: "Growth-engineered",
      desc: `Freeing your time is only the beginning. ${siteConfig.name} wires your commercial engine — ICP, outbound, funnels, pipeline metrics — so revenue becomes a forecast you stand behind, not a function of luck or heroic effort.`,
    },
  ];

  return (
    <section id="approach" aria-labelledby="about-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 bg-card">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <SectionHeading eyebrow="Our approach" id="about-heading" testId="text-section-about" className="leading-tight">
              We partner with executives
              who refuse to be their company's{" "}
              <span className="text-gray-450">bottleneck.</span>
            </SectionHeading>
            <p className="text-sm sm:text-base leading-relaxed mt-6 text-muted-foreground">
              Three forces converge at {siteConfig.name}: 20+ years of hands-on operational
              leadership (Anne & Cécile), 22+ years of systems architecture consulting at CGI
              (Georges), and a decade of B2B growth engineering across MerciApp, Clovis, and Datananas (Romain).
            </p>
            <p className="text-sm sm:text-base leading-relaxed mt-4 text-muted-foreground">
              Every engagement begins with the same question: <strong className="font-semibold text-foreground">what is burying you?</strong> We
              find it, take it over, and replace it with structure that holds — without the
              headcount, management time, and ramp-up of an internal team. {siteConfig.slogan}, we
              run what you can't get to.
            </p>
          </div>
          <div>
            <ul className="list-none m-0 p-0 border-t border-gray-225">
              {pillars.map((pillar) => (
                <li
                  key={pillar.name}
                  className="grid grid-cols-[20px_1fr] gap-5 items-start py-5 border-b border-gray-225"
                  data-testid={`pillar-${pillar.name.toLowerCase()}`}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{pillar.name}</p>
                    <p className="text-sm mt-1 text-muted-foreground">{pillar.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
