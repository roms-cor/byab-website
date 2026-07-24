import { siteConfig } from "@content/site.config";
import { teamMembers } from "@content/team";
import { useTeamSlider } from "@/hooks/use-team-slider";

export function TeamSlider() {
  const { active, prev, goTo, hasAdvanced } = useTeamSlider(teamMembers.length);

  const member = teamMembers[active];

  return (
    <div className="w-full max-w-[380px]" data-testid="team-slider">
      <div className="relative flex flex-col items-center">
        <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]">
          <div
            className="absolute rounded-full slider-ring-1 -inset-4 border border-black-alpha-06"
          />
          <div
            className="absolute rounded-full slider-ring-2 -inset-[34px] border border-black-alpha-04"
          />
          <div
            className="absolute rounded-full slider-ring-3 -inset-[52px] border border-black-alpha-02"
          />

          <div className="absolute inset-0 rounded-full overflow-hidden z-[3]">
            {teamMembers.map((m, i) => {
              const isActive = i === active;
              const isFirst = i === 0;
              const isInitialFirst = isFirst && !hasAdvanced.current;
              return (
                <img
                  key={m.name}
                  src={m.src}
                  alt={`${m.name}, ${m.role} at ${siteConfig.name}`}
                  width={256}
                  height={256}
                  {...(isFirst ? { fetchpriority: "high" } : { fetchpriority: "low" }) as any}
                  decoding={isFirst ? "sync" : "async"}
                  className={`absolute inset-0 w-full h-full rounded-full object-cover border-[3px] border-background shadow-slider-photo ${
                    isActive || isInitialFirst ? "opacity-100 scale-100" : i === prev ? "opacity-0 scale-[1.08]" : "opacity-0 scale-[0.92]"
                  }${isInitialFirst ? "" : " transition-[opacity,transform] duration-700 ease-in-out"}`}
                  data-testid={isActive ? "img-slider-active" : undefined}
                />
              );
            })}
          </div>

          <div className="absolute inset-0 slider-orbit z-[4]">
            {teamMembers.map((m, i) => {
              if (i === active) return null;
              const others = teamMembers.filter((_, idx) => idx !== active);
              const thumbIdx = others.indexOf(m);
              const angle = (thumbIdx * (360 / others.length)) + 45;
              
              return (
                <div
                  key={m.name}
                  className="absolute left-1/2 top-1/2 [transform:translate(-50%,-50%)_rotate(var(--thumb-angle))_translateY(-150px)]"
                  // eslint-disable-next-line no-restricted-syntax -- orbit geometry: the per-thumb angle rides a --thumb-angle CSS variable consumed by the static transform class above
                  style={{ "--thumb-angle": `${angle}deg` } as React.CSSProperties}
                >
                  <button
                    onClick={() => goTo(i)}
                    className="w-11 h-11 rounded-full overflow-hidden slider-orbit-reverse border-[2.5px] border-background shadow-slider-thumb transition-transform duration-400 ease-in-out hover:scale-[1.2]"
                    aria-label={`View ${m.name}`}
                    data-testid={`button-slider-${m.name.split(" ")[0].toLowerCase()}`}
                  >
                    <img src={m.thumb} alt="" width={128} height={128} decoding="async" className="w-full h-full object-cover" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center w-full mt-[55px] mb-[55px]">
          <div className="overflow-hidden h-[30px] relative">
            {teamMembers.map((m, i) => (
              <p
                key={m.name}
                className={`absolute inset-x-0 text-xl sm:text-2xl font-semibold text-foreground tracking-tight transition-[opacity,transform] duration-500 ease-in-out ${
                  i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3.5"
                }`}
                data-testid={i === active ? "text-slider-name" : undefined}
              >
                {m.name}
              </p>
            ))}
          </div>
          <div className="overflow-hidden h-[20px] relative mt-0.5">
            {teamMembers.map((m, i) => (
              <p
                key={m.role}
                className={`absolute inset-x-0 text-sm font-medium text-muted-foreground transition-[opacity,transform] duration-500 ease-in-out delay-60 ${
                  i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
                }`}
                data-testid={i === active ? "text-slider-role" : undefined}
              >
                {m.role}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mt-4 min-h-[28px]">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="text-2xs font-medium px-2.5 py-1 rounded-full bg-card text-gray-550 border border-gray-100"
                data-testid={`badge-skill-${skill.toLowerCase().replace(/\s/g, "-")}`}
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-5">
            {teamMembers.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative flex items-center justify-center cursor-pointer w-11 h-11"
                aria-label={`Go to member ${i + 1}`}
                data-testid={`dot-slider-${i}`}
              >
                <span
                  className={`block h-1.5 rounded-full [transition:width_500ms_cubic-bezier(0.4,0,0.2,1),background-color_500ms_ease] ${
                    i === active ? "w-7 bg-foreground" : "w-2 bg-gray-100"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
