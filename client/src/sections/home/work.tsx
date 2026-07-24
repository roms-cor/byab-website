import { engagements } from "@content/work";

export function Work() {
  const projects = engagements;

  return (
    <section id="work" aria-labelledby="work-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-container mx-auto">
        <header className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-eyebrow font-medium mb-3 text-muted-foreground" aria-hidden="true">Track record</p>
          <h2
            id="work-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-work"
          >
            Recent engagements.
          </h2>
        </header>

        <div className="border border-border/50 rounded-lg overflow-hidden divide-y divide-black-alpha-06">
          {projects.map((project, i) => (
            <article
              key={project.title}
              className="py-6 sm:py-7 px-6 sm:px-8"
              data-testid={`card-project-${i}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-3 sm:gap-8 items-start sm:items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{project.category}</span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm mt-1 text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-mono text-gray-450">{project.year}</span>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded bg-accent-yellow text-foreground"
                    data-testid={`badge-outcome-${i}`}
                  >
                    {project.outcome}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
