import { whyContent } from "@content/why";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

export function WhyHow() {
  const { how } = whyContent;
  return (
    <section id="why-how" aria-labelledby="why-how-heading" className="grid grid-cols-12 border-b border-gray-100">
      <SectionTitle num={how.part} title={how.partTitle} />
      <div className="col-span-12 md:col-span-8 lg:col-span-9 p-8 md:p-16 lg:p-24 bg-white">
        <Reveal>
          <h2
            id="why-how-heading"
            className="text-3xl md:text-5xl font-medium tracking-tight text-gray-800 leading-[1.1] mb-20 max-w-2xl pr-4"
            data-testid="text-why-how-title"
          >
            {how.heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12">
          {how.steps.map((s, i) => (
            <Reveal key={s.step} delay={i}>
              <div className="flex flex-col relative">
                <div className="font-mono text-3xs text-gray-800 uppercase tracking-label mb-6 border-b border-gray-800 pb-3 inline-block w-12">
                  {s.step}
                </div>
                <h3 className="text-[17px] font-medium text-gray-800 mb-4 pr-4" data-testid={`text-why-step-title-${i}`}>
                  {s.title}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
