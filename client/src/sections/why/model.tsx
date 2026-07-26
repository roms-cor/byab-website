import { whyContent } from "@content/why";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

/** Inverted "The Model" section — the page's single dark passage. */
export function WhyModel() {
  const { model } = whyContent;
  return (
    <section id="why-model" aria-labelledby="why-model-heading" className="grid grid-cols-12 border-b border-gray-800">
      <SectionTitle num={model.part} title={model.partTitle} dark />
      <div className="col-span-12 md:col-span-8 lg:col-span-9 p-8 md:p-16 lg:p-24 bg-gray-800 text-white">
        <Reveal>
          <h2
            id="why-model-heading"
            className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-[1.1] mb-20 max-w-2xl pr-4"
            data-testid="text-why-model-title"
          >
            {model.heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
          {model.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i}>
              <div>
                <div className="font-mono text-3xs uppercase tracking-label text-gray-500 mb-5 flex items-center gap-3">
                  <span className="w-3 h-px bg-gray-700" aria-hidden="true"></span>
                  {model.advantagePrefix} 0{i + 1}
                </div>
                <h3 className="text-xl font-medium text-white mb-4 pr-4" data-testid={`text-why-benefit-title-${i}`}>
                  {b.title}
                </h3>
                <p className="text-[15px] text-gray-300 leading-relaxed max-w-sm pr-4">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
