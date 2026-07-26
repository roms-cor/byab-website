import { engagements } from "@content/work";
import { testimonial } from "@content/testimonial";
import { whyContent } from "@content/why";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

/** Track-record section — engagements + testimonial from content/. */
export function WhyTrack() {
  const { track } = whyContent;
  return (
    <section id="why-track" aria-labelledby="why-track-heading" className="grid grid-cols-12 border-b border-gray-100 bg-white">
      <SectionTitle num={track.part} title={track.partTitle} />
      <div className="col-span-12 md:col-span-8 lg:col-span-9 p-8 md:p-16 lg:p-24">
        <Reveal>
          <h2
            id="why-track-heading"
            className="text-3xl md:text-5xl font-medium tracking-tight text-gray-800 leading-[1.1] mb-20 pr-4"
            data-testid="text-why-track-title"
          >
            {track.heading}
          </h2>
        </Reveal>

        <div className="space-y-16">
          {engagements.map((eng, i) => (
            <Reveal key={eng.title} delay={i}>
              <article className="flex flex-col lg:flex-row gap-8 lg:gap-16 pb-16 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-full lg:w-1/3 shrink-0">
                  <div className="font-mono text-3xs text-gray-300 uppercase tracking-label mb-4">
                    {eng.year} <span className="mx-2">·</span> {eng.category}
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-8 pr-4" data-testid={`text-why-engagement-${i}`}>
                    {eng.title}
                  </h3>
                  <div className="inline-flex items-center px-4 py-2 bg-accent-yellow text-gray-800 font-mono text-3xs uppercase tracking-label font-bold">
                    {eng.outcome}
                  </div>
                </div>
                <div className="w-full lg:w-2/3 lg:pt-9">
                  <p className="text-base text-muted-foreground leading-relaxed max-w-2xl pr-4">{eng.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <figure className="mt-24 bg-gray-50 p-8 md:p-12 lg:p-16 border border-gray-100 relative max-w-3xl">
            <div className="absolute top-0 left-12 w-px h-8 bg-gray-800 hidden md:block" aria-hidden="true"></div>
            <blockquote
              className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-10 mt-2 pr-4"
              data-testid="text-why-testimonial"
            >
              "{testimonial.quote}"
            </blockquote>
            <figcaption className="flex items-center gap-5">
              <div
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-mono text-xs tracking-label shrink-0"
                aria-hidden="true"
              >
                {testimonial.initials}
              </div>
              <div>
                <div className="text-[15px] font-medium text-gray-800">{testimonial.author}</div>
                <div className="font-mono text-3xs text-muted-foreground uppercase tracking-label mt-1.5">{testimonial.role}</div>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
