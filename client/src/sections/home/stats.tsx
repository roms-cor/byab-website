import { siteConfig } from "@content/site.config";
import { stats } from "@content/stats";

export function Stats() {
  return (
    <section aria-label="Key metrics" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="max-w-container mx-auto">
        <div className="rounded-lg p-8 sm:p-12 lg:p-16 bg-foreground">
          <p className="text-xs uppercase tracking-label font-medium mb-10 text-gray-350" data-testid="text-stats-label">
            {siteConfig.name} — by the numbers
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-left" data-testid={`stat-${stat.value}`}>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-background">
                  {stat.value}<span className="text-accent-yellow">{stat.suffix}</span>
                </p>
                <p className="text-xs sm:text-sm mt-1.5 leading-snug text-white-alpha-50">{stat.label}</p>
                <p className="text-3xs font-mono mt-1 tracking-wide text-white-alpha-25">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
