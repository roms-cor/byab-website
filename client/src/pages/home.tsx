declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;
declare const __GIT_COMMIT_DATE__: string;

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Globe, Loader2, Mail, MapPin, Menu, X } from "lucide-react";
import { SiLinkedin, SiX } from "react-icons/si";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
const logoHorizontalWhite = "/images/logo-horizontal-white.webp";
const photoAnne256 = "/images/anne-256.webp";
const photoCecile256 = "/images/cecile-256.webp";
const photoGeorges256 = "/images/georges-256.webp";
const photoRomain256 = "/images/romain-256.webp";
const photoAnne128 = "/images/anne-128.webp";
const photoCecile128 = "/images/cecile-128.webp";
const photoGeorges128 = "/images/georges-128.webp";
const photoRomain128 = "/images/romain-128.webp";

function useHeadLinks() {
  useEffect(() => {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) existingCanonical.remove();

    const links = [
      { rel: "canonical", href: "https://becausebusy.com/" },
      { rel: "alternate", hreflang: "en", href: "https://becausebusy.com/" },
      { rel: "alternate", hreflang: "fr", href: "https://becausebusy.com/" },
      { rel: "alternate", hreflang: "x-default", href: "https://becausebusy.com/" },
    ];
    const elements: HTMLLinkElement[] = [];
    links.forEach((attrs) => {
      const link = document.createElement("link");
      Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
      document.head.appendChild(link);
      elements.push(link);
    });
    return () => elements.forEach((el) => el.remove());
  }, []);
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { label: "Services", href: "#services", title: "Our four service pillars: operations, transformation, data, and growth" },
    { label: "Track Record", href: "#work", title: "Recent client engagements and outcomes" },
    { label: "Team", href: "#team", title: "Meet our team of four specialists" },
    { label: "Story", href: "#story", title: "Our history from 2005 to today" },
    { label: "Contact", href: "#contact", title: "Get in touch — email, locations, and contact form" },
  ];

  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const firstLink = menuRef.current?.querySelector("a");
      firstLink?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => { if (mq.matches) setMobileOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white" role="banner">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <a href="/" aria-label="Home" data-testid="link-logo-home">
          <img src={logoHorizontalWhite} alt="Because You Are Busy — Operations, Transformation & Growth Consultancy" width={240} height={48} className="h-[38px] w-auto" {...{fetchpriority: "high"} as any} data-testid="img-logo-header" />
        </a>
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  title={item.title}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm transition-opacity duration-150"
                  style={{ color: "#666666" }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            title="Get in touch — email, locations, and contact form"
            data-testid="button-header-cta"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full transition-opacity duration-150"
            style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
          >
            Get in touch
          </a>
          <button
            ref={triggerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav ref={menuRef} id="mobile-nav" className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-t border-border/50 shadow-lg" aria-label="Mobile navigation">
          <ul className="flex flex-col py-4 px-4 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  title={item.title}
                  onClick={() => { setMobileOpen(false); triggerRef.current?.focus(); }}
                  data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="block py-3 text-base font-medium transition-opacity duration-150"
                  style={{ color: "#333333" }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-3 mt-1 border-t border-border/50">
              <a
                href="#contact"
                onClick={() => { setMobileOpen(false); triggerRef.current?.focus(); }}
                data-testid="button-mobile-cta"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-medium rounded-full transition-opacity duration-150"
                style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
              >
                Get in touch
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

const teamMembers = [
  {
    src: photoCecile256,
    thumb: photoCecile128,
    name: "Cécile Noiriel",
    role: "Founder — B Y A B, 2005",
    bio: "Created B Y A B on April 1, 2005 with a conviction ahead of its time: founders don't lack courage — they lack time and structure. Has run the operation since day one.",
    skills: ["Project Coordination", "Administrative Org", "Client Delivery", "Process Design"],
    since: "Since 2005",
    linkedin: "https://www.linkedin.com/in/c%C3%A9cile-noiriel-18396327/",
  },
  {
    src: photoAnne256,
    thumb: photoAnne128,
    name: "Anne Grosz",
    role: "Founder & Operations",
    bio: "8 years as Secretary General & CFO at Vatier & Associés. Now leads externalized general secretariat for law firms and SMEs — finance, admin, HR, and ISO compliance.",
    skills: ["General Secretariat", "Finance & Admin", "Law Firm Ops", "ISO Compliance"],
    since: "Since 2015",
    linkedin: "https://www.linkedin.com/in/annegrosz",
  },
  {
    src: photoGeorges256,
    thumb: photoGeorges128,
    name: "Georges Grosz",
    role: "Transformation & Data",
    bio: "22+ years as Senior Executive Consultant at CGI. Teaches at Université Paris 1 Panthéon-Sorbonne. Brings the systems architecture discipline that turns chaotic operations into governed infrastructure.",
    skills: ["Systems Architecture", "Data Governance", "Project Management", "Business Analysis"],
    since: "Since July 2025",
    linkedin: "https://www.linkedin.com/in/georges-grosz-8aa9613",
  },
  {
    src: photoRomain256,
    thumb: photoRomain128,
    name: "Romain Cornu",
    role: "Growth Engine",
    bio: "6 years at MerciApp (now GTM & Key Accounts Lead), 4 years leading growth at Clovis. Ex-Datananas, GrowthMakers. Designs go-to-market engines that make growth predictable.",
    skills: ["Go-to-Market", "Acquisition Funnels", "Outbound B2B", "Revenue Ops"],
    since: "Since 2025",
    linkedin: "https://fr.linkedin.com/in/romaincornu",
  },
];

function TeamSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAdvanced = useRef(false);

  const goTo = useCallback((index: number) => {
    if (index === active) return;
    hasAdvanced.current = true;
    setPrev(active);
    setActive(index);
  }, [active]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      hasAdvanced.current = true;
      setActive((a) => {
        setPrev(a);
        return (a + 1) % teamMembers.length;
      });
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const member = teamMembers[active];

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
            {teamMembers.map((m, i) => {
              const isActive = i === active;
              const isFirst = i === 0;
              const isInitialFirst = isFirst && !hasAdvanced.current;
              return (
                <img
                  key={m.name}
                  src={m.src}
                  alt={`${m.name}, ${m.role} at Because You Are Busy`}
                  width={256}
                  height={256}
                  {...(isFirst ? { fetchpriority: "high" } : { fetchpriority: "low" }) as any}
                  decoding={isFirst ? "sync" : "async"}
                  className="absolute inset-0 w-full h-full rounded-full object-cover"
                  style={{
                    opacity: isActive || isInitialFirst ? 1 : 0,
                    transform: isActive || isInitialFirst ? "scale(1)" : (i === prev ? "scale(1.08)" : "scale(0.92)"),
                    ...(isInitialFirst ? {} : { transition: "opacity 700ms cubic-bezier(0.4,0,0.2,1), transform 700ms cubic-bezier(0.4,0,0.2,1)" }),
                    border: "3px solid #FFFFFF",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                  }}
                  data-testid={isActive ? "img-slider-active" : undefined}
                />
              );
            })}
          </div>

          <div className="absolute inset-0 slider-orbit" style={{ zIndex: 4 }}>
            {teamMembers.map((m, i) => {
              if (i === active) return null;
              const others = teamMembers.filter((_, idx) => idx !== active);
              const thumbIdx = others.indexOf(m);
              const angle = (thumbIdx * (360 / others.length)) + 45;
              const radius = 150;
              
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
                    className="w-11 h-11 rounded-full overflow-hidden slider-orbit-reverse"
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
                style={{ backgroundColor: "#F5F5F5", color: "#595959", border: "1px solid #E5E5E5" }}
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
                className="relative flex items-center justify-center cursor-pointer"
                style={{ width: "44px", height: "44px" }}
                aria-label={`Go to member ${i + 1}`}
                data-testid={`dot-slider-${i}`}
              >
                <span
                  className="block h-1.5 rounded-full"
                  style={{
                    width: i === active ? "28px" : "8px",
                    backgroundColor: i === active ? "#000000" : "#E5E5E5",
                    transition: "width 500ms cubic-bezier(0.4,0,0.2,1), background-color 500ms ease",
                  }}
                />
              </button>
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
              className="sm:text-6xl lg:text-[80px] font-semibold tracking-tight text-foreground text-[70px]"
              data-testid="text-hero-title"
            >
              We run what
              <br />
              you can't get to
              <br />
              <span style={{ color: "#767676" }}>anymore.</span>
            </h1>
            <p
              className="text-base sm:text-lg mt-6 sm:mt-8 leading-relaxed max-w-lg"
              style={{ color: "#666666" }}
              data-testid="text-hero-description"
            >
              <strong className="font-medium text-foreground">Because you are busy,</strong> we externalize
              your operations, engineer growth systems, and turn operational chaos into measurable
              clarity — so you lead your company instead of getting buried by it.
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
                href="#approach"
                data-testid="button-hero-secondary"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border transition-opacity duration-150"
                style={{ backgroundColor: "#F5F5F5", color: "#000000", borderRadius: "0px", borderColor: "#E5E5E5" }}
              >
                Our approach
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-6 sm:gap-8" data-testid="hero-proof">
              <div>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">20</p>
                <p className="text-xs font-mono mt-1" style={{ color: "#666666" }}>Years serving<br />founders</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">57%</p>
                <p className="text-xs font-mono mt-1" style={{ color: "#666666" }}>Operating<br />profitability</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">0€</p>
                <p className="text-xs font-mono mt-1" style={{ color: "#666666" }}>External debt<br />raised, ever</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <TeamSlider />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    { text: "Organization", bold: true },
    { text: "Finance", bold: false },
    { text: "Strategy", bold: true },
    { text: "Operations", bold: false },
    { text: "Transformation", bold: true },
    { text: "Growth", bold: false },
    { text: "Outbound", bold: true },
    { text: "Data", bold: false },
  ];

  return (
    <section aria-hidden="true" className="border-t border-b border-border/50 py-5 overflow-hidden">
      <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, set) => (
          <div key={set} className="flex items-center gap-12 sm:gap-16 shrink-0">
            {words.map((word) => (
              <span
                key={`${set}-${word.text}`}
                className={`text-xs uppercase tracking-[0.2em] ${word.bold ? "font-semibold" : "font-medium"}`}
                style={{ color: word.bold ? "#666666" : "#767676" }}
              >
                {word.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function PainRecognition() {
  const pains = [
    {
      num: "01",
      lead: "Your mental bandwidth is consumed by operations",
      rest: " that should run themselves — admin, finance, HR, compliance — instead of by the decisions that actually move the needle.",
    },
    {
      num: "02",
      lead: "Your data is scattered, your processes are improvised",
      rest: ", and every week you're putting out fires instead of building the systems that would prevent them.",
    },
    {
      num: "03",
      lead: "Your growth is stalling",
      rest: " not because the opportunity isn't there, but because no one owns the outbound machine, the funnel architecture, or the commercial pipeline that would capture it.",
    },
  ];

  return (
    <section aria-label="The problem we solve" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "#000000" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight"
            style={{ color: "#FFFFFF" }}
            data-testid="text-section-pain"
          >
            You didn't start a company
            to manage its{" "}
            <span style={{ color: "#949494" }}>back-office.</span>
          </h2>
          <ul className="space-y-0 list-none m-0 p-0">
            {pains.map((pain, i) => (
              <li
                key={pain.num}
                className="grid grid-cols-[24px_1fr] gap-4 items-start py-6"
                style={{ borderBottom: i < pains.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
                data-testid={`pain-item-${pain.num}`}
              >
                <span className="text-xs font-mono pt-0.5" style={{ color: "#666666" }}>{pain.num}</span>
                <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                  <strong className="font-semibold" style={{ color: "#FFFFFF" }}>{pain.lead}</strong>
                  {pain.rest}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      num: "01",
      title: "Operational Backbone",
      description: "Externalized general secretariat, admin, and finance management — so your back-office runs on autopilot and you stop drowning in the details.",
      outcomes: [
        "General secretariat & admin management",
        "Accounting, treasury & financial reporting",
        "HR, legal documentation & ISO compliance",
        "Ideal for law firms, SMEs & growing founders",
      ],
    },
    {
      num: "02",
      title: "Transformation & Data",
      description: "Systems architecture, project governance and data strategy — turning operational chaos into measurable clarity and scalable infrastructure.",
      outcomes: [
        "Systems architecture & tech governance",
        "Data strategy & operational dashboards",
        "Project management & transformation roadmaps",
        "Business analysis & decision enablement",
      ],
    },
    {
      num: "03",
      title: "Growth Engine",
      description: "Outbound systems, acquisition funnels, and predictable commercial pipelines — engineered so that revenue growth becomes systematic, not accidental.",
      outcomes: [
        "Outbound sequence design & automation",
        "Acquisition funnel architecture",
        "Sales process structuring & CRM ops",
        "Growth machine from Datananas, Clovis, MerciApp playbooks",
      ],
    },
    {
      num: "04",
      title: "Legal Practice Ops",
      description: "Purpose-built operational support for law firms — where precision is non-negotiable, nothing can be improvised, and partners need to focus on practice, not paperwork.",
      outcomes: [
        "Partner-facing general secretariat",
        "Finance, compliance & ISO management",
        "Client file & deadline administration",
        "20 years of law firm operational expertise",
      ],
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
              Four ways we<br />take it off your plate.
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
              <span className="text-xs font-mono font-medium" style={{ color: "#767676" }}>{service.num}</span>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-3">{service.title}</h3>
              <p className="text-sm leading-relaxed mt-2" style={{ color: "#666666" }}>{service.description}</p>
              <ul className="mt-4 space-y-2 list-none m-0 p-0">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="text-xs font-mono pl-4 relative" style={{ color: "#666666" }}>
                    <span className="absolute left-0" aria-hidden="true">→</span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "20", suffix: "+", label: "Years of uninterrupted operational service to founders", sub: "Founded 2005 — still running" },
    { value: "57", suffix: "%", label: "Operating profitability — a lean machine that lives what it promises", sub: "No hype. No dilution." },
    { value: "3", suffix: "", label: "Complementary expertise pillars: operations, transformation, growth", sub: "One engagement, full stack" },
    { value: "0", suffix: "€", label: "External debt raised — ever. We grow on our own terms.", sub: "Ultra-lean by design" },
  ];

  return (
    <section aria-label="Key metrics" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="rounded-lg p-8 sm:p-12 lg:p-16" style={{ backgroundColor: "#000000" }}>
          <p className="text-xs uppercase tracking-[0.15em] font-medium mb-10" style={{ color: "#949494" }} data-testid="text-stats-label">
            Because You Are Busy — by the numbers
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-left" data-testid={`stat-${stat.value}`}>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style={{ color: "#FFFFFF" }}>
                  {stat.value}<span style={{ color: "#E8E020" }}>{stat.suffix}</span>
                </p>
                <p className="text-xs sm:text-sm mt-1.5 leading-snug" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
                <p className="text-[10px] font-mono mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.25)" }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const projects = [
    {
      title: "B2B SaaS Scale-Up",
      category: "Growth Engineering",
      year: "2025",
      description: "Outbound architecture, acquisition funnel structuring and sales machine deployment for a French B2B software company in growth phase.",
      outcome: "Pipeline engineered",
    },
    {
      title: "National Law Firm",
      category: "Operations Restructuring",
      year: "2024",
      description: "Full operational restructuring — general secretariat, financial management, ISO compliance and HR processes rebuilt from the ground up.",
      outcome: "Operations rebuilt",
    },
    {
      title: "Tech PME",
      category: "Transformation & Data",
      year: "2025",
      description: "Systems architecture review, data governance framework and operational dashboard deployment. Chaos to measurable clarity.",
      outcome: "Visibility restored",
    },
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
            Recent engagements.
          </h2>
        </header>

        <div className="border border-border/50 rounded-lg overflow-hidden">
          {projects.map((project, i) => (
            <article
              key={project.title}
              className="py-6 sm:py-7 px-6 sm:px-8"
              style={{ borderBottom: i < projects.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
              data-testid={`card-project-${i}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-3 sm:gap-8 items-start sm:items-center">
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#666666" }}>{project.category}</span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm mt-1" style={{ color: "#666666" }}>{project.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-mono" style={{ color: "#767676" }}>{project.year}</span>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: "#E8E020", color: "#000000" }}
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

function About() {
  const pillars = [
    {
      name: "Operations-first",
      desc: "We start where the friction is, not where it looks good. Every engagement is grounded in the messy operational reality, not a top-down strategy deck.",
    },
    {
      name: "Data-driven",
      desc: "Intuition without measurement is noise. We build decision systems so you always know what's working, what's leaking, and what to act on next.",
    },
    {
      name: "Growth-engineered",
      desc: "Freeing your time is only the beginning. We wire your commercial engine so growth becomes predictable, not a function of luck or heroic effort.",
    },
  ];

  return (
    <section id="approach" aria-labelledby="about-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">Our approach</p>
            <h2
              id="about-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight"
              data-testid="text-section-about"
            >
              We partner with founders
              who refuse to keep{" "}
              <span style={{ color: "#767676" }}>drowning.</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mt-6" style={{ color: "#666666" }}>
              Three forces converge at Because You Are Busy: twenty years of hands-on operational
              leadership, the systems architecture discipline of a Senior Executive Consultant,
              and the growth engineering instincts of a serial B2B builder.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mt-4" style={{ color: "#666666" }}>
              Every engagement begins with the same question: <strong className="font-semibold text-foreground">what is burying you?</strong> We
              find it, remove it, and replace it with structure that holds — without the overhead
              of a full internal team.
            </p>
          </div>
          <div>
            <ul className="list-none m-0 p-0 border-t" style={{ borderColor: "#C0C0C0" }}>
              {pillars.map((pillar) => (
                <li
                  key={pillar.name}
                  className="grid grid-cols-[20px_1fr] gap-5 items-start py-5 border-b"
                  style={{ borderColor: "#C0C0C0" }}
                  data-testid={`pillar-${pillar.name.toLowerCase()}`}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: "#000000" }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{pillar.name}</p>
                    <p className="text-sm mt-1" style={{ color: "#666666" }}>{pillar.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" aria-labelledby="team-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-12 sm:mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">Who we are</p>
          <h2
            id="team-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-team"
          >
            Our team.
          </h2>
          <p className="text-sm sm:text-base mt-4 leading-relaxed" style={{ color: "#666666" }}>
            Four complementary profiles — united by a conviction Cécile Noiriel has carried since 2005: founders deserve better than drowning in their own back-office.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-lg overflow-hidden border border-border/50">
          {teamMembers.map((member) => {
            const firstName = member.name.split(" ")[0].toLowerCase();
            return (
              <article
                key={member.name}
                className="flex gap-5 sm:gap-6 p-6 sm:p-8"
                style={{ backgroundColor: "#F5F5F5" }}
                data-testid={`card-team-${firstName}`}
              >
                <img
                  src={member.src}
                  alt={member.name}
                  width={256}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0"
                  style={{ border: "1px solid #E5E5E5" }}
                  data-testid={`img-team-${firstName}`}
                />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground" data-testid={`text-team-name-${firstName}`}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "#767676" }} data-testid={`text-team-role-${firstName}`}>
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: "#666666" }} data-testid={`text-team-bio-${firstName}`}>
                    {member.bio}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="transition-opacity duration-150 hover:opacity-70"
                        style={{ color: "#666666" }}
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
                        className="transition-opacity duration-150 hover:opacity-70"
                        style={{ color: "#666666" }}
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

function Story() {
  const timeline = [
    {
      year: "2005",
      title: "The first seed",
      photo: photoCecile128,
      photoAlt: "Cécile Noiriel",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            It all starts on April 1, 2005 with the creation of{" "}
            <a href="https://annuaire-entreprises.data.gouv.fr/entreprise/because-you-are-busy-b-y-a-b-481631471" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab-annuaire">
              Because You Are Busy (B Y A B)
            </a>
            , a consulting firm registered under SIREN 481 631 471. At its origin:{" "}
            <a href="https://www.linkedin.com/in/c%C3%A9cile-noiriel-18396327/" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-cecile-linkedin">
              Cécile Noiriel
            </a>
            , founder and driving force of the structure from day one. The mission: studies, consulting, and assistance in administrative and commercial organization for SMEs.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Behind this name, ahead of its time, lies a strong conviction: founders don't lack courage or ideas — they lack time and structure to execute them. For nearly twenty years,{" "}
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
      photo: photoAnne128,
      photoAlt: "Anne Grosz",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            Ten years after BYAB was born, a second entity extends and specializes the intuition:{" "}
            <a href="https://entreprises.lefigaro.fr/because-you-are-busy-94/entreprise-814783056" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-figaro">
              Because You Are Busy
            </a>{" "}
            (SIREN 814 783 056), created on November 20, 2015. At its origin:{" "}
            <a href="https://www.linkedin.com/in/annegrosz" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-anne-linkedin">
              Anne Grosz
            </a>
            , who becomes president, then manager.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Before launching, Anne spent eight years as Secretary General and CFO at{" "}
            <a href="https://www.infocession.fr/avocats/vatier-associes" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-vatier">
              Vatier & Associés
            </a>
            , a Paris law firm — managing accounting, HR, IT, legal documentation, events, and ISO compliance. With{" "}
            <a href="https://www.societe.com/societe/because-you-are-busy-814783056.html" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-societe">
              Because You Are Busy
            </a>
            , she transforms this expertise into an externalized offer: exactly what she embodied internally, now serving multiple clients.
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
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
          Over the years,{" "}
          <a href="https://www.pappers.fr/entreprise/because-you-are-busy-814783056" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-byab2-pappers">
            Because You Are Busy
          </a>{" "}
          evolves legally: initially created as a SAS with 500€ capital, it transforms into a SARL, then into an EI for greater simplicity. Accounts are systematically filed with a confidentiality declaration — consistent with a human-scale firm focused on delivery, not visibility.
        </p>
      ),
    },
    {
      year: "2025",
      title: "Georges: the transformation & data layer",
      photo: photoGeorges128,
      photoAlt: "Georges Grosz",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            On July 4, 2025,{" "}
            <a href="https://www.linkedin.com/in/georges-grosz-8aa9613" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-georges-linkedin">
              Georges Grosz
            </a>{" "}
            joins as co-manager alongside Anne. His track record: 22+ years as Senior Executive Consultant at CGI, university lecturer at Paris 1 Panthéon-Sorbonne, decades of systems architecture and data governance work for large French organizations.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            With Georges, the story levels up: the administrative right-hand becomes a transformation co-pilot, capable of rebuilding systems and turning operational chaos into measurable clarity at any scale.
          </p>
        </>
      ),
    },
    {
      year: "2025–26",
      title: "Romain: the growth machine",
      photo: photoRomain128,
      photoAlt: "Romain Cornu",
      content: (
        <>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
            At the same time, another path converges:{" "}
            <a href="https://fr.linkedin.com/in/romaincornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-linkedin">
              Romain Cornu
            </a>
            , B2B growth specialist. Head of Marketing at Datananas, then nearly six years at MerciApp — from Growth Advisor to Investor to GTM & Key Accounts Lead.{" "}
            <a href="https://www.avizio.fr/expert/romain-cornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-avizio">
              Head of Growth at Clovis
            </a>
            {" "}for over four years, and Outbound Teacher at GrowthMakers.{" "}
            <a href="https://clay.earth/profile/romain-cornu" target="_blank" rel="noopener noreferrer" className="underline text-foreground font-medium" data-testid="link-romain-clay">
              Full profile on Clay
            </a>
            .
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-3" style={{ color: "#666666" }}>
            Where Anne and Georges spent decades relieving founders' mental load, Romain spent years building go-to-market engines, structuring outbound, and turning commercial processes into machines. When he joins, the puzzle is complete.
          </p>
        </>
      ),
    },
  ];

  return (
    <section id="story" aria-labelledby="story-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36" style={{ backgroundColor: "#F5F5F5" }}>
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
                      width={128}
                      height={128}
                      loading="lazy"
                      decoding="async"
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
            <span className="text-xs font-medium" style={{ color: "#949494" }}>
              Operational depth — Anne, Cécile, BYAB, law firms
            </span>
            <span className="text-xs" style={{ color: "#949494" }}>·</span>
            <span className="text-xs font-medium" style={{ color: "#949494" }}>
              Systems & data vision — Georges, CGI, Sorbonne
            </span>
            <span className="text-xs" style={{ color: "#949494" }}>·</span>
            <span className="text-xs font-medium" style={{ color: "#949494" }}>
              Growth engine — Romain, MerciApp, Clovis, Datananas
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string | null }) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: (_data, variables) => {
      toast({
        title: "Message saved",
        description: "Your enquiry has been recorded. Your email client will open so you can send it directly.",
      });

      const subject = encodeURIComponent(`New enquiry from ${variables.name}`);
      const body = encodeURIComponent(
        `Name: ${variables.name}\nEmail: ${variables.email}\n\n${variables.message || ""}`
      );
      window.location.href = `mailto:hello@becausebusy.com?subject=${subject}&body=${body}`;

      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Your message could not be saved. Please try again or email us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    mutation.mutate({ name: name.trim(), email: email.trim(), message: message.trim() || null });
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">Contact</p>
            <h2
              id="contact-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight"
              data-testid="text-section-contact"
            >
              Let's take something{" "}
              <span style={{ color: "#767676" }}>off your plate.</span>
            </h2>
            <p className="text-sm sm:text-base mt-4 leading-relaxed" style={{ color: "#666666" }}>
              Because you are busy, we'll take it from here. Tell us what's burying you
              and we'll get back within 24h.
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#666666" }}>Email</span>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  <a href="mailto:hello@becausebusy.com" className="underline" style={{ textDecorationColor: "#E5E5E5" }} data-testid="link-contact-email">hello@becausebusy.com</a>
                </p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "#666666" }}>Based in</span>
                <p className="text-sm font-medium text-foreground mt-0.5">Paris & La Rochelle</p>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-xs font-medium text-foreground block mb-1.5">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  required
                  aria-required="true"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }}
                  disabled={mutation.isPending}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  data-testid="input-contact-name"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors disabled:opacity-50 ${errors.name ? "border-red-400" : "border-border"}`}
                />
                {errors.name && <p id="contact-name-error" className="text-xs mt-1" style={{ color: "#DC2626" }} data-testid="text-error-name">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="text-xs font-medium text-foreground block mb-1.5">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  aria-required="true"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }}
                  disabled={mutation.isPending}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  data-testid="input-contact-email"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors disabled:opacity-50 ${errors.email ? "border-red-400" : "border-border"}`}
                />
                {errors.email && <p id="contact-email-error" className="text-xs mt-1" style={{ color: "#DC2626" }} data-testid="text-error-email">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="text-xs font-medium text-foreground block mb-1.5">Tell us what's burying you</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="What would you delegate tomorrow if you could?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={mutation.isPending}
                  data-testid="input-contact-message"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors resize-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                data-testid="button-contact-submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-medium transition-opacity duration-150 w-full justify-center disabled:opacity-50"
                style={{ backgroundColor: "#000000", color: "#FFFFFF", border: "1px solid #666666" }}
              >
                {mutation.isPending ? (
                  <>
                    Sending...
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerNav = [
    { label: "Services", href: "#services" },
    { label: "Team", href: "#team" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" },
  ];

  const people = [
    { name: "Cécile Noiriel", role: "Founder, B Y A B 2005", linkedin: "https://www.linkedin.com/in/c%C3%A9cile-noiriel-18396327/" },
    { name: "Anne Grosz", role: "Co-founder & Operations", linkedin: "https://www.linkedin.com/in/annegrosz" },
    { name: "Georges Grosz", role: "Transformation & Data", linkedin: "https://www.linkedin.com/in/georges-grosz-8aa9613" },
    { name: "Romain Cornu", role: "Growth Engine", linkedin: "https://fr.linkedin.com/in/romaincornu" },
  ];

  const companies = [
    {
      name: "B Y A B",
      siren: "481 631 471",
      founded: "2005",
      links: [
        { label: "Annuaire Entreprises", href: "https://annuaire-entreprises.data.gouv.fr/entreprise/because-you-are-busy-b-y-a-b-481631471" },
        { label: "Pappers", href: "https://www.pappers.fr/entreprise/b-y-a-b-because-you-are-busy-481631471" },
        { label: "Le Figaro", href: "https://entreprises.lefigaro.fr/b-y-a-b-b-y-a-b-83/entreprise-481631471" },
      ],
    },
    {
      name: "Because You Are Busy",
      siren: "814 783 056",
      founded: "2015",
      links: [
        { label: "Société.com", href: "https://www.societe.com/societe/because-you-are-busy-814783056.html" },
        { label: "Pappers", href: "https://www.pappers.fr/entreprise/because-you-are-busy-814783056" },
        { label: "Le Figaro", href: "https://entreprises.lefigaro.fr/because-you-are-busy-94/entreprise-814783056" },
      ],
    },
  ];

  return (
    <footer className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10 border-t border-border/50" role="contentinfo">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <div>
            <img src={logoHorizontalWhite} alt="Because You Are Busy logo" width={140} height={28} loading="lazy" decoding="async" className="h-7 w-auto mb-4" data-testid="img-footer-logo" />
            <p className="text-xs leading-relaxed" style={{ color: "#666666" }}>
              Operations, transformation & growth consultancy for founders and managing partners since 2005.
            </p>
            <ul className="mt-4 space-y-2 list-none m-0 p-0">
              <li className="flex items-center gap-2">
                <Mail className="w-3 h-3 flex-shrink-0" style={{ color: "#767676" }} aria-hidden="true" />
                <a
                  href="mailto:hello@becausebusy.com"
                  className="text-xs transition-opacity duration-150 hover:opacity-70"
                  style={{ color: "#666666" }}
                  data-testid="link-footer-email"
                >
                  hello@becausebusy.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "#767676" }} aria-hidden="true" />
                <span className="text-xs" style={{ color: "#666666" }} data-testid="text-footer-locations">Paris & La Rochelle</span>
              </li>
            </ul>
            <ul className="mt-3 space-y-1 list-none m-0 p-0">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs transition-opacity duration-150 hover:opacity-70"
                    style={{ color: "#666666" }}
                    data-testid={`link-footer-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/design"
                  className="text-xs flex items-center gap-1 transition-opacity duration-150 hover:opacity-70"
                  style={{ color: "#666666" }}
                  data-testid="link-footer-design"
                >
                  Design <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] font-semibold text-foreground mb-3">People</p>
            <ul className="space-y-3 list-none m-0 p-0">
              {people.map((person) => {
                const first = person.name.split(" ")[0].toLowerCase();
                return (
                  <li key={person.name}>
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-foreground flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-70"
                      data-testid={`link-footer-person-${first}`}
                    >
                      <SiLinkedin className="w-3 h-3 flex-shrink-0" style={{ color: "#767676" }} aria-hidden="true" />
                      {person.name}
                    </a>
                    <p className="text-[11px] mt-0.5 pl-[18px]" style={{ color: "#767676" }}>{person.role}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.15em] font-semibold text-foreground mb-3">Companies</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {companies.map((company) => (
                <div key={company.siren}>
                  <p className="text-xs font-medium text-foreground" data-testid={`text-footer-company-${company.siren.replace(/\s/g, "")}`}>
                    {company.name}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#767676" }}>
                    SIREN {company.siren} · Founded {company.founded}
                  </p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-2 list-none m-0 p-0">
                    {company.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${company.name} on ${link.label}`}
                          className="text-[11px] underline transition-opacity duration-150 hover:opacity-70"
                          style={{ color: "#767676" }}
                          data-testid={`link-footer-registry-${company.siren.replace(/\s/g, "")}-${link.label.toLowerCase().replace(/[.\s]/g, "-")}`}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-10 sm:mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px]" style={{ color: "#767676" }}>
            © 2026 <span itemScope itemType="https://schema.org/Organization"><span itemProp="name">Because You Are Busy</span></span>. All rights reserved.
          </p>
          <p className="text-[10px] hidden sm:block" style={{ color: "#BBBBBB" }} data-testid="text-footer-version">
            v{__APP_VERSION__} · Published {new Date(__BUILD_DATE__).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} {new Date(__BUILD_DATE__).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} · Commit {__GIT_COMMIT_DATE__ ? `${new Date(__GIT_COMMIT_DATE__).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${new Date(__GIT_COMMIT_DATE__).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}` : "—"}
          </p>
          <p className="text-[11px]" style={{ color: "#767676" }} data-testid="text-footer-address">
            18 rue Arago, 94400 Vitry-sur-Seine, France
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  useHeadLinks();
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded" data-testid="link-skip-nav">Skip to content</a>
      <main id="main-content">
        <Hero />
        <Marquee />
        <PainRecognition />
        <Services />
        <Stats />
        <Work />
        <About />
        <Team />
        <Story />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
