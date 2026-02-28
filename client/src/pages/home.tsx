import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import logoHorizontalWhite from "@assets/byab-horizontal-logo-white_1772264662585.png";
import photoAnne from "@assets/byab-profiles-neon-square-anne_1772263504235.png";
import photoCecile from "@assets/byab-profiles-neon-square-cecile_1772263504235.png";
import photoGeorges from "@assets/byab-profiles-neon-square-georges_1772263504235.png";
import photoRomain from "@assets/byab-profiles-neon-square-romain_1772263504234.png";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl" role="banner">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="/" aria-label="Home" data-testid="link-logo-home">
          <img src={logoHorizontalWhite} alt="Because You Are Busy — Operations, Transformation & Growth Consultancy" className="h-8 w-auto" data-testid="img-logo-header" />
        </a>
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            {[
              { label: "Services", href: "#services" },
              { label: "Track Record", href: "#work" },
              { label: "Story", href: "#story" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm font-medium transition-opacity duration-150"
                  style={{ color: "#666666" }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#contact"
          data-testid="button-header-cta"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[10px] transition-opacity duration-150"
          style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

const teamMembers = [
  {
    src: photoAnne,
    name: "Anne Grosz",
    role: "Founder & Operations",
    bio: "8 years as Secretary General & CFO at Vatier & Associés. Now leads externalized general secretariat for law firms and SMEs — finance, admin, HR, and ISO compliance.",
    skills: ["General Secretariat", "Finance & Admin", "Law Firm Ops", "ISO Compliance"],
    since: "Since 2015",
  },
  {
    src: photoCecile,
    name: "Cécile Noiriel",
    role: "Operations Conductor",
    bio: "The original 'chef d'orchestre' of BYAB since day one. Ensures every operational detail aligns with the founder's vision — coordination, delivery, and administrative orchestration.",
    skills: ["Project Coordination", "Administrative Org", "Client Delivery", "Process Design"],
    since: "Since 2005",
  },
  {
    src: photoGeorges,
    name: "Georges Grosz",
    role: "Transformation & Data",
    bio: "22+ years as Senior Executive Consultant at CGI. Teaches at Université Paris 1 Panthéon-Sorbonne. Brings systems architecture, data governance, and structured transformation.",
    skills: ["Systems Architecture", "Data Governance", "Project Management", "Business Analysis"],
    since: "Since July 2025",
  },
  {
    src: photoRomain,
    name: "Romain Cornu",
    role: "Growth Engine",
    bio: "Built growth machines at Datananas, Clovis, and MerciApp. CEO of Oysterz. Designs outbound systems, acquisition funnels, and revenue ops that make growth predictable.",
    skills: ["Outbound B2B", "Acquisition Funnels", "Sales Machines", "Revenue Ops"],
    since: "Since 2025",
  },
];

function TeamSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    if (index === active) return;
    setPrev(active);
    setActive(index);
  }, [active]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((a) => {
        setPrev(a);
        return (a + 1) % teamMembers.length;
      });
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const member = teamMembers[active];

  const thumbPositions = [
    { top: "2%", right: "-8%" },
    { bottom: "8%", right: "-12%" },
    { bottom: "-6%", left: "25%" },
  ];

  return (
    <div className="w-full max-w-[380px]" data-testid="team-slider">
      <div className="relative flex flex-col items-center">
        <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]">
          <div
            className="absolute rounded-full slider-ring-1"
            style={{ inset: "-16px", border: "1px solid rgba(0,0,0,0.06)" }}
          />
          <div
            className="absolute rounded-full slider-ring-2"
            style={{ inset: "-34px", border: "1px solid rgba(0,0,0,0.04)" }}
          />
          <div
            className="absolute rounded-full slider-ring-3"
            style={{ inset: "-52px", border: "1px solid rgba(0,0,0,0.02)" }}
          />

          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ zIndex: 3 }}>
            {teamMembers.map((m, i) => (
              <img
                key={m.name}
                src={m.src}
                alt={m.name}
                className="absolute inset-0 w-full h-full rounded-full object-cover"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : (i === prev ? "scale(1.08)" : "scale(0.92)"),
                  transition: "opacity 700ms cubic-bezier(0.4,0,0.2,1), transform 700ms cubic-bezier(0.4,0,0.2,1)",
                  border: "3px solid #FFFFFF",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                }}
                data-testid={i === active ? "img-slider-active" : undefined}
              />
            ))}
          </div>

          <div className="absolute inset-0 slider-orbit" style={{ zIndex: 4 }}>
            {teamMembers.map((m, i) => {
              if (i === active) return null;
              // Distribute remaining members around the circle
              const others = teamMembers.filter((_, idx) => idx !== active);
              const thumbIdx = others.indexOf(m);
              const angle = (thumbIdx * (360 / others.length)) + 45;
              const radius = 170; // Position them on the outer rings
              
              return (
                <div
                  key={m.name}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                  }}
                >
                  <button
                    onClick={() => goTo(i)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden slider-orbit-reverse"
                    style={{
                      border: "2.5px solid #FFFFFF",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "transform 400ms cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    aria-label={`View ${m.name}`}
                    data-testid={`button-slider-${m.name.split(" ")[0].toLowerCase()}`}
                  >
                    <img src={m.src} alt={m.name} className="w-full h-full object-cover" />
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
                className="absolute inset-x-0 text-xl sm:text-2xl font-semibold text-foreground tracking-tight"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 500ms cubic-bezier(0.4,0,0.2,1), transform 500ms cubic-bezier(0.4,0,0.2,1)",
                }}
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
                className="absolute inset-x-0 text-sm font-medium"
                style={{
                  color: "#666666",
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 500ms cubic-bezier(0.4,0,0.2,1) 60ms, transform 500ms cubic-bezier(0.4,0,0.2,1) 60ms",
                }}
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
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#F5F5F5", color: "#666666", border: "1px solid #E5E5E5" }}
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
                className="relative h-1.5 rounded-full cursor-pointer"
                style={{
                  width: i === active ? "28px" : "8px",
                  backgroundColor: i === active ? "#000000" : "#E5E5E5",
                  transition: "width 500ms cubic-bezier(0.4,0,0.2,1), background-color 500ms ease",
                }}
                aria-label={`Go to member ${i + 1}`}
                data-testid={`dot-slider-${i}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="lg:pt-8">
            <p
              className="text-xs uppercase tracking-[0.2em] font-medium mb-6"
              style={{ color: "#666666" }}
              data-testid="text-hero-label"
            >
              Since 2005 — Operations · Transformation · Growth
            </p>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-6xl lg:text-[80px] font-semibold tracking-tight text-foreground leading-[1.02]"
              data-testid="text-hero-title"
            >
              We run what
              <br />
              you can't get to
              <br />
              <span style={{ color: "#999999" }}>anymore.</span>
            </h1>
            <p
              className="text-base sm:text-lg mt-6 sm:mt-8 leading-relaxed max-w-lg"
              style={{ color: "#666666" }}
              data-testid="text-hero-description"
            >
              <strong className="font-medium text-foreground">Because you are busy</strong>, we externalize
              your operations, drive transformation, and engineer growth — so founders
              and managing partners can lead instead of drown.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
              <a
                href="#contact"
                data-testid="button-hero-primary"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-medium transition-opacity duration-150"
                style={{ backgroundColor: "#000000", color: "#FFFFFF", border: "1px solid #666666" }}
              >
                Start a project
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#about"
                data-testid="button-hero-secondary"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border transition-opacity duration-150"
                style={{ backgroundColor: "#F5F5F5", color: "#000000", borderRadius: "0px", borderColor: "#E5E5E5" }}
              >
                Our approach
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <TeamSlider />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <section aria-label="Expertise" className="border-t border-b border-border/50 py-5 overflow-hidden">
      <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, set) => (
          <div key={set} className="flex items-center gap-12 sm:gap-16 shrink-0">
            {["Operations", "Transformation", "Growth", "Outbound", "Data", "Organization", "Finance", "Strategy"].map((word) => (
              <span
                key={`${set}-${word}`}
                className="text-xs uppercase tracking-[0.2em] font-medium"
                style={{ color: "#999999" }}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      num: "01",
      title: "Operational Backbone",
      description: "Externalized general secretariat, admin, and finance — so you stop drowning in back-office and start leading.",
    },
    {
      num: "02",
      title: "Transformation & Data",
      description: "Systems architecture, project governance, and data strategy that turn operational chaos into measurable clarity.",
    },
    {
      num: "03",
      title: "Growth Engine",
      description: "Outbound, acquisition funnels, and predictable sales machines that make your revenue growth inevitable.",
    },
    {
      num: "04",
      title: "Legal Practice Ops",
      description: "Purpose-built admin, finance, and organizational support for law firms where nothing can be improvised.",
    },
  ];

  return (
    <section id="services" aria-labelledby="services-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">What we do</p>
            <h2
              id="services-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
              data-testid="text-section-services"
            >
              Services
            </h2>
          </div>
          <a href="#contact" className="text-sm font-medium flex items-center gap-1.5 transition-opacity duration-150" style={{ color: "#666666" }} data-testid="link-discuss-project">
            Discuss your project <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-lg overflow-hidden border border-border/50">
          {services.map((service) => (
            <article
              key={service.num}
              className="p-6 sm:p-8 lg:p-10"
              style={{ backgroundColor: "#F5F5F5" }}
              data-testid={`card-service-${service.num}`}
            >
              <span className="text-xs font-mono font-medium" style={{ color: "#999999" }}>{service.num}</span>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-3">{service.title}</h3>
              <p className="text-sm leading-relaxed mt-2" style={{ color: "#666666" }}>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  const projects = [
    { title: "B2B SaaS Scale-Up", category: "Growth Engineering", year: "2025" },
    { title: "National Law Firm", category: "Operations Restructuring", year: "2024" },
    { title: "Tech PME", category: "Transformation & Data", year: "2025" },
  ];

  return (
    <section id="work" aria-labelledby="work-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">Track record</p>
          <h2
            id="work-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-work"
          >
            Engagements
          </h2>
        </header>

        <div className="space-y-0 border-t border-border/50">
          {projects.map((project, i) => (
            <article
              key={project.title}
              className="group border-b border-border/50 py-6 sm:py-8"
              data-testid={`card-project-${i}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">{project.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#E5E5E5", color: "#666666" }}>{project.category}</span>
                    <span className="text-xs font-mono" style={{ color: "#999999" }}>{project.year}</span>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-border/50 transition-colors duration-200"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="w-4 h-4" style={{ color: "#666666" }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "20", label: "Years serving founders" },
    { value: "57%", label: "Operating profitability" },
    { value: "3", label: "Expertise pillars" },
    { value: "0€", label: "External debt raised" },
  ];

  return (
    <section aria-label="Key metrics" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="rounded-lg p-8 sm:p-12 lg:p-16" style={{ backgroundColor: "#000000" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style={{ color: "#FFFFFF" }}>{stat.value}</p>
                <p className="text-xs sm:text-sm mt-1.5" style={{ color: "#777777" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">About</p>
            <h2
              id="about-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight"
              data-testid="text-section-about"
            >
              We partner with founders
              who refuse to drown
              in their own operations.
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
              Three forces converge at Because You Are Busy: twenty years of hands-on operational
              leadership in admin, finance, and law firm management — a systems and data
              vision forged across two decades at CGI and the Sorbonne — and a growth engine
              built from the trenches of B2B SaaS, outbound, and acquisition.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mt-4" style={{ color: "#666666" }}>
              Every engagement starts with the same question: what is burying you?
              We find the answer, remove the weight, and turn what was chaos into
              a machine you can read, predict, and scale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Operations-first", "Data-driven", "Growth-engineered"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "#E5E5E5", color: "#666666" }}
                  data-testid={`badge-${tag.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-4 gap-4">
              {[
                { src: photoAnne, name: "Anne Grosz", role: "Operations" },
                { src: photoCecile, name: "Cécile Noiriel", role: "Conductor" },
                { src: photoGeorges, name: "Georges Grosz", role: "Transformation" },
                { src: photoRomain, name: "Romain Cornu", role: "Growth" },
              ].map((member) => (
                <div key={member.name} className="text-center" data-testid={`about-member-${member.name.split(" ")[0].toLowerCase()}`}>
                  <img
                    src={member.src}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto ring-2 ring-border/50"
                    data-testid={`img-about-${member.name.split(" ")[0].toLowerCase()}`}
                  />
                  <p className="text-xs font-medium text-foreground mt-2">{member.name}</p>
                  <p className="text-[10px]" style={{ color: "#777777" }}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Story() {
  const timeline = [
    {
      year: "2005",
      title: "The first seed",
      photo: photoCecile,
      photoAlt: "Cécile Noiriel",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            It all starts on April 1, 2005 with the creation of{" "}
            <a href="https://annuaire-entreprises.data.gouv.fr/entreprise/because-you-are-busy-b-y-a-b-481631471" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab-annuaire">
              Because You Are Busy (B Y A B)
            </a>
            , a consulting firm registered under SIREN 481 631 471. The mission is clear: studies, consulting, and assistance in administrative and commercial organization for SMEs.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Behind this name, ahead of its time, lies a strong conviction: founders don't lack courage or ideas — they lack time and structure to execute them. For nearly twenty years,{" "}
            <a href="https://www.linkedin.com/in/c%C3%A9cile-noiriel-18396327/" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-cecile-linkedin">
              Cécile Noiriel
            </a>{" "}
            has been the "conductor" (chef d'orchestre) of this mission, ensuring that every operational detail aligns with the founder's vision.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            For nearly twenty years,{" "}
            <a href="https://entreprises.lefigaro.fr/b-y-a-b-b-y-a-b-83/entreprise-481631471" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab-figaro">
              BYAB
            </a>{" "}
            will live exactly what it promises its clients: an{" "}
            <a href="https://www.pappers.fr/entreprise/b-y-a-b-because-you-are-busy-481631471" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab-pappers">
              ultra-lean, ultra-profitable structure
            </a>
            , with no fundraising and no hype — revenue around 130,000€, operating profitability above 57%, and near-zero debt.
          </p>
        </>
      ),
    },
    {
      year: "2015",
      title: "Specialization: law firms & SMEs",
      photo: photoAnne,
      photoAlt: "Anne Grosz",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            Ten years after BYAB was born, a second entity extends and specializes the intuition:{" "}
            <a href="https://entreprises.lefigaro.fr/because-you-are-busy-94/entreprise-814783056" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-figaro">
              Because You Are Busy
            </a>{" "}
            (SIREN 814 783 056), created on November 20, 2015 and based at 18 rue Arago, 94400 Vitry-sur-Seine. At its origin:{" "}
            <a href="https://www.linkedin.com/in/annegrosz" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-anne-linkedin">
              Anne Grosz
            </a>
            , who becomes president, then manager of the structure.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Before launching Because You Are Busy, Anne spent eight years as Secretary General and CFO at{" "}
            <a href="https://www.infocession.fr/avocats/vatier-associes" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-vatier">
              Vatier & Associés
            </a>
            , a Paris law firm, where she managed accounting, commercial management, treasury, HR, IT, legal documentation, events, and ISO compliance. She knows the daily reality of a law firm intimately: over-solicited partners, overwhelmed staff, critical deadlines.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            With{" "}
            <a href="https://www.societe.com/societe/because-you-are-busy-814783056.html" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-societe">
              Because You Are Busy
            </a>
            , Anne transforms this experience into an offer: externalized general secretariat for law firms and SMEs — exactly what she embodied internally, now serving multiple clients.
          </p>
        </>
      ),
    },
    {
      year: "2020",
      title: "Consolidation: craft over startup",
      photo: null,
      photoAlt: null,
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            Over the years,{" "}
            <a href="https://www.pappers.fr/entreprise/because-you-are-busy-814783056" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-pappers">
              Because You Are Busy
            </a>{" "}
            evolves legally: initially created as a SAS with 500€ capital, it transforms into a SARL in 2020. Anne moves from president to manager. This shift reflects a deliberate choice — simplify, anchor in a model that is more craft than startup, aligned with the deeply operational nature of the missions.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Accounts are systematically filed with a confidentiality declaration — consistent with a human-scale consulting firm oriented toward discretion and trust with sensitive clients: law firm partners and SME founders.
          </p>
        </>
      ),
    },
    {
      year: "2025",
      title: "Georges: the transformation & data layer",
      photo: photoGeorges,
      photoAlt: "Georges Grosz",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            On July 4, 2025, a new leader joins the company:{" "}
            <a href="https://www.linkedin.com/in/georges-grosz-8aa9613" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-georges-linkedin">
              Georges Grosz
            </a>{" "}
            becomes co-manager alongside Anne. His track record adds a strategic and technological dimension: over 22 years as Senior Executive Consultant at CGI, one of the world's largest IT and management consulting groups, working on transformation, information systems, and data governance. In parallel, he teaches at Université Paris 1 Panthéon-Sorbonne on project management, business analysis, and data.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            With Georges, the story levels up: the administrative right-hand becomes a transformation co-pilot, able to translate business challenges into structured, measurable, tooled decisions.
          </p>
        </>
      ),
    },
    {
      year: "2025–26",
      title: "Romain: the growth machine",
      photo: photoRomain,
      photoAlt: "Romain Cornu",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            At the same time, another path converges:{" "}
            <a href="https://fr.linkedin.com/in/romaincornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-linkedin">
              Romain Cornu
            </a>
            , entrepreneur and B2B growth specialist. His career is built around one thread: building predictable growth machines.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Head of Marketing at Datananas (B2B outbound SaaS).{" "}
            <a href="https://www.avizio.fr/expert/romain-cornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-avizio">
              Head of Growth at Clovis
            </a>
            , where he designs and runs a sales machine aligning marketing and sales. Growth Advisor and investor at MerciApp, structuring the AARRR funnel. Teacher Outbound at GrowthMakers. CEO of{" "}
            <a href="https://www.societe.com/societe/oysterz-884894296.html" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-oysterz-societe">
              Oysterz
            </a>
            {" "}(
            <a href="https://entreprises.lefigaro.fr/oysterz-17/entreprise-884894296" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-oysterz-figaro">
              SIREN 884 894 296
            </a>
            ), a La Rochelle-based firm focused on B2B systems consulting and talent matching. (
            <a href="https://clay.earth/profile/romain-cornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-clay">
              Full profile on Clay
            </a>
            )
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Where Anne and Georges spent decades relieving founders' mental load, Romain spent years creating demand, structuring outbound, and turning commercial processes into machines. When he joins Because You Are Busy, the puzzle is complete.
          </p>
        </>
      ),
    },
  ];

  return (
    <section id="story" aria-labelledby="story-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-12 sm:mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">Our story</p>
          <h2
            id="story-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight"
            data-testid="text-section-story"
          >
            Twenty years of the same intuition:
            founders don't lack ideas — they lack
            time to execute them.
          </h2>
        </header>

        <div className="space-y-0">
          {timeline.map((entry, i) => (
            <article
              key={entry.year}
              className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-4 lg:gap-12 py-10 sm:py-12 border-t border-border/50"
              data-testid={`story-phase-${i}`}
            >
              <div className="flex items-start">
                <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-mono">{entry.year}</span>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {entry.photo && (
                    <img
                      src={entry.photo}
                      alt={entry.photoAlt || ""}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-border/50"
                      data-testid={`img-story-${entry.photoAlt?.split(" ")[0]?.toLowerCase()}`}
                    />
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">{entry.title}</h3>
                </div>
                {entry.content}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 p-8 sm:p-12 rounded-lg" style={{ backgroundColor: "#000000" }}>
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold leading-snug tracking-tight" style={{ color: "#FFFFFF" }} data-testid="text-story-promise">
            "Because you are busy, we do the work that frees your time —
            and we do it in a way that makes your growth more readable,
            more predictable, and better controlled."
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="text-xs font-medium" style={{ color: "#777777" }}>
              Operational depth — Anne, Cécile, BYAB, law firms
            </span>
            <span className="text-xs" style={{ color: "#777777" }}>·</span>
            <span className="text-xs font-medium" style={{ color: "#777777" }}>
              Systems & data vision — Georges, CGI, Sorbonne
            </span>
            <span className="text-xs" style={{ color: "#777777" }}>·</span>
            <span className="text-xs font-medium" style={{ color: "#777777" }}>
              Growth machine — Romain, Datananas, Clovis, MerciApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section aria-label="Client testimonial" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 border-t border-border/50">
      <div className="max-w-[800px] mx-auto text-center">
        <blockquote>
          <p
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-snug tracking-tight"
            data-testid="text-testimonial-quote"
          >
            "They didn't just take work off my plate.
            They rebuilt how my company runs —
            and revenue followed."
          </p>
          <footer className="mt-6 sm:mt-8">
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ backgroundColor: "#999999", color: "#000000" }}
                aria-hidden="true"
              >
                ML
              </div>
              <div className="text-left">
                <cite className="not-italic text-sm font-medium text-foreground" data-testid="text-testimonial-author">M. Laurent</cite>
                <p className="text-xs" style={{ color: "#666666" }}>Managing Partner</p>
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">Contact</p>
            <h2
              id="contact-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight"
              data-testid="text-section-contact"
            >
              Let's take something
              off your plate.
            </h2>
            <p className="text-sm sm:text-base mt-4 leading-relaxed" style={{ color: "#666666" }}>
              Because you are busy, we'll take it from here. Tell us what's burying you
              and we'll get back within 24 hours with a clear plan of action.
            </p>
            <div className="mt-8 space-y-3">
              <p className="text-sm" style={{ color: "#666666" }}>
                <span className="font-medium text-foreground">Email</span>
                <br />hello@becausebusy.com
              </p>
              <p className="text-sm" style={{ color: "#666666" }}>
                <span className="font-medium text-foreground">Based in</span>
                <br />Paris & La Rochelle
              </p>
            </div>
          </div>
          <div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-xs font-medium text-foreground block mb-1.5">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  data-testid="input-contact-name"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-xs font-medium text-foreground block mb-1.5">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  data-testid="input-contact-email"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-xs font-medium text-foreground block mb-1.5">Tell us what's burying you</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="What would you delegate tomorrow if you could?"
                  data-testid="input-contact-message"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                data-testid="button-contact-submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-medium transition-opacity duration-150 w-full justify-center"
                style={{ backgroundColor: "#000000", color: "#FFFFFF", border: "1px solid #666666" }}
              >
                Send message
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-t border-border/50" role="contentinfo">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <img src={logoHorizontalWhite} alt="Because You Are Busy logo" className="h-6 w-auto" />
          <p className="text-xs" style={{ color: "#666666" }}>© 2005–2026 <span itemScope itemType="https://schema.org/Organization"><span itemProp="name">Because You Are Busy</span></span>. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/components"
            data-testid="link-components"
            className="text-xs font-medium flex items-center gap-1 transition-opacity duration-150"
            style={{ color: "#666666" }}
          >
            Components
            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main role="main">
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Stats />
        <About />
        <Story />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
