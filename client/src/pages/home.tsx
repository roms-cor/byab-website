import { Link } from "wouter";
import { ArrowRight, Zap, Shield, BarChart3, Users, Globe, Layers, ChevronRight, Star, ArrowUpRight } from "lucide-react";
import logoSvg from "@assets/logo.svg";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" role="banner">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-6 sm:gap-8" aria-label="Main navigation">
          <a href="/" aria-label="Home" data-testid="link-logo-home">
            <img src={logoSvg} alt="Attio logo" className="h-5" data-testid="img-logo-header" width="103" height="26" />
          </a>
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {[
              { label: "Product", href: "#features" },
              { label: "Solutions", href: "#solutions" },
              { label: "Pricing", href: "#pricing" },
              { label: "Resources", href: "#resources" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                  className="px-3 py-2 text-sm text-muted-foreground font-medium rounded-md transition-colors duration-150"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#"
            data-testid="link-login"
            className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-md transition-colors duration-150"
          >
            Log in
          </a>
          <a
            href="#cta"
            data-testid="button-header-cta"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[10px] transition-opacity duration-150"
            style={{ backgroundColor: "#202124", color: "#F3F4F6" }}
          >
            Start for free
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-xs font-medium text-muted-foreground mb-6 sm:mb-8" data-testid="badge-hero-label">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#B5BDC9" }} aria-hidden="true" />
          Now available for teams of all sizes
        </div>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05] max-w-4xl mx-auto"
          data-testid="text-hero-title"
        >
          The CRM that
          <br className="hidden sm:block" />
          <span style={{ color: "#505967" }}> works for you</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-4 sm:mt-6 leading-relaxed max-w-2xl mx-auto" data-testid="text-hero-description">
          Powerful, flexible, and intuitive. Build meaningful relationships
          with your customers using a CRM designed for the modern era.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-10">
          <a
            href="#cta"
            data-testid="button-hero-primary"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-medium transition-opacity duration-150 w-full sm:w-auto justify-center"
            style={{ backgroundColor: "#202124", color: "#F3F4F6", border: "1px solid #505967" }}
          >
            Start for free
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href="#features"
            data-testid="button-hero-secondary"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-border/50 transition-opacity duration-150 w-full sm:w-auto justify-center"
            style={{ backgroundColor: "#FAFAFB", color: "#232529", borderRadius: "0px" }}
          >
            See how it works
          </a>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 max-w-4xl mx-auto">
          <div
            className="w-full aspect-[16/9] rounded-lg border border-border/50 relative overflow-hidden"
            style={{ backgroundColor: "#F8F9FA" }}
            data-testid="img-hero-preview"
          >
            <div className="absolute inset-0 flex flex-col">
              <div className="h-10 sm:h-12 border-b border-border/50 flex items-center px-4 gap-2" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D8DCE2" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D8DCE2" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D8DCE2" }} />
                </div>
                <div className="flex-1 mx-8 sm:mx-16">
                  <div className="h-5 sm:h-6 rounded-md max-w-xs mx-auto" style={{ backgroundColor: "#EEF0F3" }} />
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="hidden sm:block w-48 border-r border-border/50 p-3 space-y-2" style={{ backgroundColor: "#FAFAFB" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-7 rounded-md" style={{ backgroundColor: i === 2 ? "#B5BDC9" : "#EEF0F3", opacity: i === 2 ? 0.4 : 0.6 }} />
                  ))}
                </div>
                <div className="flex-1 p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-6 sm:h-8 rounded-md w-1/3" style={{ backgroundColor: "#D8DCE2" }} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-16 sm:h-20 rounded-md" style={{ backgroundColor: "#EEF0F3" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCloud() {
  return (
    <section aria-label="Trusted by leading companies" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium text-center mb-6 sm:mb-8" data-testid="text-logocloud-label">
          Trusted by forward-thinking teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-4 sm:gap-y-6">
          {["Stripe", "Linear", "Notion", "Figma", "Vercel", "Loom"].map((name) => (
            <span
              key={name}
              className="text-sm sm:text-base font-semibold tracking-tight"
              style={{ color: "#B5BDC9" }}
              data-testid={`text-logo-${name.toLowerCase()}`}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Zap,
      title: "Lightning fast",
      description: "Built for speed from the ground up. Every interaction feels instant, so your team can move at the pace of your business.",
    },
    {
      icon: Layers,
      title: "Fully customizable",
      description: "Mold your CRM to fit your workflow, not the other way around. Custom objects, fields, and views built your way.",
    },
    {
      icon: BarChart3,
      title: "Real-time reporting",
      description: "Live dashboards and analytics that update as your data changes. Make decisions with confidence, not guesswork.",
    },
    {
      icon: Users,
      title: "Team collaboration",
      description: "Shared notes, mentions, and activity feeds keep everyone aligned. No more lost context or missed handoffs.",
    },
    {
      icon: Shield,
      title: "Enterprise security",
      description: "SOC 2 certified with SAML SSO, role-based access, and audit logs. Your data stays safe and compliant.",
    },
    {
      icon: Globe,
      title: "API-first platform",
      description: "A powerful REST API and webhooks let you connect to any tool in your stack. Build exactly what you need.",
    },
  ];

  return (
    <section id="features" aria-labelledby="features-heading" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
      <div className="max-w-[1200px] mx-auto">
        <header className="max-w-2xl mb-10 sm:mb-12 lg:mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">Features</p>
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-features"
          >
            Everything you need,<br className="hidden sm:block" /> nothing you don't
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            A CRM that adapts to your process. Powerful enough for complex workflows, simple enough to start in minutes.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="p-5 sm:p-6 rounded-lg border border-border/50"
                style={{ backgroundColor: "#F8F9FA" }}
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#B5BDC9" }}
                  aria-hidden="true"
                >
                  <Icon className="w-4 h-4" style={{ color: "#1C1D1F" }} />
                </div>
                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Connect your data",
      description: "Import contacts, companies, and deals from your existing tools in seconds. We support CSV, Salesforce, HubSpot, and more.",
    },
    {
      step: "02",
      title: "Customize your workspace",
      description: "Build custom objects, views, and automations that match your exact workflow. No code required.",
    },
    {
      step: "03",
      title: "Close more deals",
      description: "Use real-time insights, automated follow-ups, and team collaboration to turn every opportunity into a win.",
    },
  ];

  return (
    <section id="solutions" aria-labelledby="solutions-heading" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <header className="max-w-2xl mb-10 sm:mb-12 lg:mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">How it works</p>
          <h2
            id="solutions-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-howitworks"
          >
            Up and running in minutes
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            No lengthy onboarding or training sessions. Start seeing value from day one.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((item) => (
            <article
              key={item.step}
              className="relative p-6 sm:p-8 rounded-lg border border-border/50"
              style={{ backgroundColor: "#FFFFFF" }}
              data-testid={`card-step-${item.step}`}
            >
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-5 text-sm font-semibold"
                style={{ backgroundColor: "#B5BDC9", color: "#1C1D1F" }}
                aria-hidden="true"
              >
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "We switched from Salesforce and never looked back. The flexibility is unmatched and our team actually enjoys using it.",
      author: "Sarah Chen",
      role: "VP of Sales",
      company: "Arcadia",
      rating: 5,
    },
    {
      quote: "The API-first approach let us build custom integrations in days, not months. It fits perfectly into our engineering workflow.",
      author: "Marcus Rivera",
      role: "CTO",
      company: "Theorem",
      rating: 5,
    },
    {
      quote: "Our pipeline visibility went from guesswork to real-time clarity. The reporting alone was worth the switch.",
      author: "Emma Larsen",
      role: "Head of Revenue",
      company: "Northlight",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <header className="max-w-2xl mb-10 sm:mb-12 lg:mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">Testimonials</p>
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-testimonials"
          >
            Loved by teams everywhere
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="p-5 sm:p-6 rounded-lg border border-border/50 flex flex-col"
              style={{ backgroundColor: "#F8F9FA" }}
              data-testid={`card-testimonial-${i}`}
            >
              <div className="flex items-center gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "#B5BDC9" }} aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-sm text-foreground leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <div className="mt-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: "#B5BDC9", color: "#1C1D1F" }}
                    aria-hidden="true"
                  >
                    {t.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground" data-testid={`text-testimonial-author-${i}`}>{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "For individuals and small teams getting started",
      features: ["Up to 1,000 contacts", "Basic reporting", "Email integration", "Mobile app"],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per user / month",
      description: "For growing teams that need more power",
      features: ["Unlimited contacts", "Advanced reporting", "Custom objects", "API access", "Automations", "Priority support"],
      cta: "Start free trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored pricing",
      description: "For organizations with advanced requirements",
      features: ["Everything in Pro", "SAML SSO", "Audit logs", "Dedicated CSM", "Custom SLA", "Advanced security"],
      cta: "Contact sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 border-t border-border/50">
      <div className="max-w-[1200px] mx-auto">
        <header className="max-w-2xl mx-auto text-center mb-10 sm:mb-12 lg:mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">Pricing</p>
          <h2
            id="pricing-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-pricing"
          >
            Simple, transparent pricing
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`p-5 sm:p-6 rounded-lg border flex flex-col ${
                plan.highlighted ? "border-2" : "border-border/50"
              }`}
              style={{
                backgroundColor: plan.highlighted ? "#FFFFFF" : "#F8F9FA",
                borderColor: plan.highlighted ? "#202124" : undefined,
              }}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.highlighted && (
                <div className="inline-flex self-start items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ backgroundColor: "#202124", color: "#F3F4F6" }}>
                  Popular
                </div>
              )}
              <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground" data-testid={`text-price-${plan.name.toLowerCase()}`}>{plan.price}</span>
                <span className="text-xs text-muted-foreground">/{plan.period}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>

              <ul className="mt-5 space-y-2.5 flex-1 list-none p-0 m-0">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#B5BDC9" }} aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-opacity duration-150 w-full"
                style={
                  plan.highlighted
                    ? { backgroundColor: "#202124", color: "#F3F4F6", borderRadius: "10px", border: "1px solid #505967" }
                    : { backgroundColor: "#FAFAFB", color: "#232529", borderRadius: "0px", border: "1px solid #EEF0F3" }
                }
                data-testid={`button-pricing-${plan.name.toLowerCase()}`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "How long does it take to set up?",
      answer: "Most teams are up and running in under 15 minutes. Import your data, customize your views, and you're ready to go.",
    },
    {
      question: "Can I migrate from another CRM?",
      answer: "Yes. We support one-click migration from Salesforce, HubSpot, Pipedrive, and other major CRMs. CSV imports are also available.",
    },
    {
      question: "Is there a free plan?",
      answer: "Absolutely. Our Free plan includes up to 1,000 contacts and core CRM features. No credit card required to get started.",
    },
    {
      question: "What kind of support do you offer?",
      answer: "All plans include email support. Pro plans get priority support with 4-hour response times. Enterprise plans include a dedicated customer success manager.",
    },
  ];

  return (
    <section id="resources" aria-labelledby="faq-heading" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 border-t border-border/50">
      <div className="max-w-[800px] mx-auto">
        <header className="text-center mb-10 sm:mb-12 lg:mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 sm:mb-3" aria-hidden="true">FAQ</p>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-faq"
          >
            Frequently asked questions
          </h2>
        </header>

        <dl className="space-y-0 rounded-lg border border-border/50 overflow-hidden" data-testid="list-faq">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`p-5 sm:p-6 ${i !== faqs.length - 1 ? "border-b border-border/30" : ""}`}
              data-testid={`faq-item-${i}`}
            >
              <dt className="text-sm font-semibold text-foreground">{faq.question}</dt>
              <dd className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="cta" aria-labelledby="cta-heading" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 border-t border-border/50">
      <div className="max-w-[800px] mx-auto text-center">
        <div className="p-8 sm:p-12 lg:p-16 rounded-lg" style={{ backgroundColor: "#202124" }}>
          <h2
            id="cta-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight"
            style={{ color: "#F3F4F6" }}
            data-testid="text-section-cta"
          >
            Ready to get started?
          </h2>
          <p className="text-sm sm:text-base mt-3 leading-relaxed max-w-lg mx-auto" style={{ color: "#8C95A5" }}>
            Join thousands of teams already using Attio to build better relationships and close more deals.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row items-stretch gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="cta-email">Email address</label>
              <input
                id="cta-email"
                type="email"
                placeholder="Enter your work email"
                data-testid="input-cta-email"
                className="flex-1 px-4 py-2.5 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                style={{ borderColor: "#3A4250", backgroundColor: "#2A3140", color: "#F3F4F6", borderRadius: "8px" }}
              />
              <button
                type="submit"
                data-testid="button-cta-submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-opacity duration-150 flex-shrink-0"
                style={{ backgroundColor: "#FAFAFB", color: "#232529", borderRadius: "0px" }}
              >
                Start free
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </form>
            <p className="text-xs mt-3" style={{ color: "#505967" }}>
              Free forever for small teams. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Integrations", "API", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "Help Center", "Community", "Status"],
    Legal: ["Privacy", "Terms", "Security", "GDPR"],
  };

  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-border/50" role="contentinfo">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-6">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <img src={logoSvg} alt="Attio logo" className="h-5 mb-3" width="103" height="26" />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              The CRM designed for modern teams. Build meaningful relationships at scale.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <nav key={category} aria-label={`${category} links`}>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">{category}</h3>
              <ul className="space-y-2 list-none m-0 p-0">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors duration-150"
                      data-testid={`link-footer-${item.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            2026 Attio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/brand"
              data-testid="link-brand-guidelines"
              className="text-xs font-medium flex items-center gap-1 transition-colors duration-150"
              style={{ color: "#505967" }}
            >
              Brand Guidelines
              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
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
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
