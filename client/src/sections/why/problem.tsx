import { painPoints } from "@content/pain";
import { whyContent } from "@content/why";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

export function WhyProblem() {
  const { problem } = whyContent;
  return (
    <section id="why-problem" aria-labelledby="why-problem-heading" className="grid grid-cols-12 border-b border-gray-100">
      <SectionTitle num={problem.part} title={problem.partTitle} />
      <div className="col-span-12 md:col-span-8 lg:col-span-9 p-8 md:p-16 lg:p-24 bg-gray-50">
        <Reveal>
          <h2
            id="why-problem-heading"
            className="text-3xl md:text-5xl font-medium tracking-tight text-gray-800 leading-[1.1] mb-16 max-w-3xl pr-4"
            data-testid="text-why-problem-title"
          >
            {problem.heading}
          </h2>
        </Reveal>

        <div className="space-y-12 max-w-3xl">
          {painPoints.map((pain, i) => (
            <Reveal key={pain.num} delay={i}>
              <div className="flex gap-6 lg:gap-8 items-start">
                <div className="font-mono text-xs text-gray-300 pt-1 shrink-0">{pain.num}</div>
                <p className="text-lg md:text-xl leading-relaxed">
                  <span className="font-medium text-gray-800">{pain.lead}</span>
                  <span className="text-muted-foreground">{pain.rest}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={4}>
          <div className="mt-20 pt-10 border-t border-gray-100 max-w-3xl">
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-gray-800 mr-2">{problem.whyAloneLead}</span>
              {problem.whyAloneText}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
