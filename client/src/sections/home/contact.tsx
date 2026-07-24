import { ArrowRight, Loader2 } from "lucide-react";
import { siteConfig } from "@content/site.config";
import { useContactForm } from "@/hooks/use-contact-form";

export function Contact() {
  const {
    name,
    email,
    message,
    errors,
    isPending,
    onNameChange,
    onEmailChange,
    onMessageChange,
    handleSubmit,
  } = useContactForm();

  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 bg-card">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-eyebrow font-medium mb-3 text-muted-foreground" aria-hidden="true">Contact</p>
            <h2
              id="contact-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight"
              data-testid="text-section-contact"
            >
              Let's take something{" "}
              <span className="text-gray-450">off your plate.</span>
            </h2>
            <p className="text-sm sm:text-base mt-4 leading-relaxed text-muted-foreground">
              {siteConfig.slogan}, we'll take it from here. Tell us what's burying you
              and we'll get back within 24h.
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</span>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  <a href={`mailto:${siteConfig.email}`} className="underline decoration-gray-100" data-testid="link-contact-email">{siteConfig.email}</a>
                </p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Based in</span>
                <p className="text-sm font-medium text-foreground mt-0.5">{siteConfig.locations}</p>
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
                  onChange={(e) => onNameChange(e.target.value)}
                  disabled={isPending}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  data-testid="input-contact-name"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors disabled:opacity-50 ${errors.name ? "border-red-400" : "border-border"}`}
                />
                {errors.name && <p id="contact-name-error" className="text-xs mt-1 text-red-600" data-testid="text-error-name">{errors.name}</p>}
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
                  onChange={(e) => onEmailChange(e.target.value)}
                  disabled={isPending}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  data-testid="input-contact-email"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors disabled:opacity-50 ${errors.email ? "border-red-400" : "border-border"}`}
                />
                {errors.email && <p id="contact-email-error" className="text-xs mt-1 text-red-600" data-testid="text-error-email">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="text-xs font-medium text-foreground block mb-1.5">Tell us what's burying you</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="What would you delegate tomorrow if you could?"
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  disabled={isPending}
                  data-testid="input-contact-message"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors resize-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                data-testid="button-contact-submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-button text-sm font-medium transition-opacity duration-150 w-full justify-center disabled:opacity-50 bg-foreground text-background border border-muted-foreground"
              >
                {isPending ? (
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
