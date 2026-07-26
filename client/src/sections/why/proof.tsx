import { stats } from "@content/stats";
import { Reveal } from "./reveal";

/** Full-bleed stat wall — numbers straight from content/stats.ts. */
export function WhyProof() {
  return (
    <section aria-label="Key numbers" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-gray-100 bg-white">
      {stats.map((stat, i) => (
        <Reveal
          key={stat.label}
          delay={i}
          className={`p-8 md:p-12 border-gray-100 border-b lg:border-b-0 ${i !== 3 ? "lg:border-r" : ""} ${
            i === 0 || i === 1 ? "md:border-b-0 md:border-r" : ""
          } ${i === 2 ? "md:border-r" : ""} flex flex-col justify-between min-h-[320px]`}
        >
          <div className="text-6xl md:text-7xl font-light tracking-tighter text-gray-800 mb-8" data-testid={`text-why-stat-value-${i}`}>
            {stat.value}
            {stat.suffix}
          </div>
          <div>
            <div className="text-[15px] font-medium text-gray-800 leading-snug mb-4" data-testid={`text-why-stat-label-${i}`}>
              {stat.label}
            </div>
            <div className="font-mono text-3xs text-gray-300 uppercase tracking-label leading-relaxed">
              {stat.sub}
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
