import { ArrowUpRight } from "lucide-react";
import { services } from "@content/services";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
      <div className="max-w-container mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="text-xs uppercase tracking-eyebrow font-medium mb-3 text-muted-foreground" aria-hidden="true">What we do</p>
            <h2
              id="services-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
              data-testid="text-section-services"
            >
              Four ways we<br />take it off your plate.
            </h2>
          </div>
          <a href="#contact" className="text-sm font-medium flex items-center gap-1.5 transition-opacity duration-150 text-muted-foreground" data-testid="link-discuss-project">
            Discuss your project <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-lg overflow-hidden border border-border/50">
          {services.map((service) => (
            <article
              key={service.num}
              className="p-6 sm:p-8 lg:p-10 bg-card"
              data-testid={`card-service-${service.num}`}
            >
              <span className="text-xs font-mono font-medium text-gray-450">{service.num}</span>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-3">{service.title}</h3>
              <p className="text-sm leading-relaxed mt-2 text-muted-foreground">{service.description}</p>
              <ul className="mt-4 space-y-2 list-none m-0 p-0">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="text-xs font-mono pl-4 relative text-muted-foreground">
                    <span className="absolute left-0" aria-hidden="true">→</span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
