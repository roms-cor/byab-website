import { Link } from "wouter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import logoBlack from "@assets/byab-square-logo-black_1772260022058.png";
import logoWhite from "@assets/byab-square-logo-white_1772260022059.png";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl" role="banner">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="/" aria-label="Home" data-testid="link-logo-home">
          <img src={logoBlack} alt="BYAB logo" className="h-7 w-7" data-testid="img-logo-header" />
        </a>
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            {[
              { label: "Services", href: "#services" },
              { label: "Work", href: "#work" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
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

function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-3xl">
          <p
            className="text-xs uppercase tracking-[0.2em] font-medium mb-6"
            style={{ color: "#666666" }}
            data-testid="text-hero-label"
          >
            Premium Growth Agency
          </p>
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-[80px] font-semibold tracking-tight text-foreground leading-[1.02]"
            data-testid="text-hero-title"
          >
            We build brands
            <br />
            that outgrow
            <br />
            <span style={{ color: "#999999" }}>expectations.</span>
          </h1>
          <p
            className="text-base sm:text-lg mt-6 sm:mt-8 leading-relaxed max-w-lg"
            style={{ color: "#666666" }}
            data-testid="text-hero-description"
          >
            Strategy, design, and performance marketing for ambitious companies
            ready to dominate their market.
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
              href="#work"
              data-testid="button-hero-secondary"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border transition-opacity duration-150"
              style={{ backgroundColor: "#F5F5F5", color: "#000000", borderRadius: "0px", borderColor: "#E5E5E5" }}
            >
              View our work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <section aria-label="Clients" className="border-t border-b border-border/50 py-5 overflow-hidden">
      <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, set) => (
          <div key={set} className="flex items-center gap-12 sm:gap-16 shrink-0">
            {["Strategy", "Branding", "Performance", "Creative", "Growth", "Digital", "Content", "Analytics"].map((word) => (
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
      title: "Brand Strategy",
      description: "Positioning, messaging, and market analysis that give your brand an unfair advantage.",
    },
    {
      num: "02",
      title: "Identity Design",
      description: "Visual systems that command attention and build instant recognition across every touchpoint.",
    },
    {
      num: "03",
      title: "Performance Marketing",
      description: "Data-driven campaigns that turn ad spend into predictable, scalable revenue growth.",
    },
    {
      num: "04",
      title: "Web & Digital",
      description: "Conversion-optimized websites and digital experiences that work as hard as your team.",
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
    { title: "Theorem", category: "Brand Identity", year: "2025" },
    { title: "Northlight", category: "Web & Performance", year: "2025" },
    { title: "Arcadia", category: "Full Rebrand", year: "2024" },
  ];

  return (
    <section id="work" aria-labelledby="work-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: "#666666" }} aria-hidden="true">Selected work</p>
          <h2
            id="work-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-work"
          >
            Case Studies
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
    { value: "150+", label: "Projects delivered" },
    { value: "3.2x", label: "Average ROI" },
    { value: "40+", label: "Brands scaled" },
    { value: "98%", label: "Client retention" },
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
              who refuse to settle
              for average.
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#666666" }}>
              We are a collective of strategists, designers, and performance marketers
              who believe great brands are built at the intersection of clarity and ambition.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mt-4" style={{ color: "#666666" }}>
              Every engagement starts with deep understanding. We study your market,
              dissect your competition, and uncover the positioning that makes your growth
              inevitable, not accidental.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Strategy-led", "Data-informed", "Design-obsessed"].map((tag) => (
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
            "They didn't just redesign our brand. They repositioned us
            in the market and our revenue followed."
          </p>
          <footer className="mt-6 sm:mt-8">
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ backgroundColor: "#999999", color: "#000000" }}
                aria-hidden="true"
              >
                SL
              </div>
              <div className="text-left">
                <cite className="not-italic text-sm font-medium text-foreground" data-testid="text-testimonial-author">Sarah Larsen</cite>
                <p className="text-xs" style={{ color: "#666666" }}>CEO, Northlight</p>
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
              Let's build
              something remarkable.
            </h2>
            <p className="text-sm sm:text-base mt-4 leading-relaxed" style={{ color: "#666666" }}>
              Tell us about your project. We'll get back to you within 24 hours
              with a clear plan of action.
            </p>
            <div className="mt-8 space-y-3">
              <p className="text-sm" style={{ color: "#666666" }}>
                <span className="font-medium text-foreground">Email</span>
                <br />hello@agency.com
              </p>
              <p className="text-sm" style={{ color: "#666666" }}>
                <span className="font-medium text-foreground">Based in</span>
                <br />London & New York
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
                <label htmlFor="contact-message" className="text-xs font-medium text-foreground block mb-1.5">Tell us about your project</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="What are you looking to achieve?"
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
          <img src={logoBlack} alt="BYAB logo" className="h-5 w-5" />
          <p className="text-xs" style={{ color: "#666666" }}>2026. All rights reserved.</p>
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
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
