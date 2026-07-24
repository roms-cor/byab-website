import { Globe } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { teamMembers } from "@content/team";

export function Team() {
  return (
    <section id="team" aria-labelledby="team-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-container mx-auto">
        <header className="mb-12 sm:mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-eyebrow font-medium mb-3 text-muted-foreground" aria-hidden="true">Who we are</p>
          <h2
            id="team-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-team"
          >
            Our team.
          </h2>
          <p className="text-sm sm:text-base mt-4 leading-relaxed text-muted-foreground">
            Four complementary profiles — united by a conviction {teamMembers[0].name} has carried since 2005: founders deserve better than drowning in their own back-office.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-lg overflow-hidden border border-border/50">
          {teamMembers.map((member) => {
            const firstName = member.name.split(" ")[0].toLowerCase();
            return (
              <article
                key={member.name}
                className="flex gap-5 sm:gap-6 p-6 sm:p-8 bg-card"
                data-testid={`card-team-${firstName}`}
              >
                <img
                  src={member.src}
                  alt={member.name}
                  width={256}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                  data-testid={`img-team-${firstName}`}
                />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground" data-testid={`text-team-name-${firstName}`}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mt-0.5 text-gray-450" data-testid={`text-team-role-${firstName}`}>
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed mt-3 text-muted-foreground" data-testid={`text-team-bio-${firstName}`}>
                    {member.bio}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="transition-opacity duration-150 hover:opacity-70 text-muted-foreground"
                        data-testid={`link-team-linkedin-${firstName}`}
                      >
                        <SiLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} website`}
                        className="transition-opacity duration-150 hover:opacity-70 text-muted-foreground"
                        data-testid={`link-team-website-${firstName}`}
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
