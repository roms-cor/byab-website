import { testimonial } from "@content/testimonial";

export function Testimonial() {
  return (
    <section aria-label="Client testimonial" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 border-t border-border/50">
      <div className="max-w-[800px] mx-auto text-center">
        <blockquote>
          <p
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-snug tracking-tight"
            data-testid="text-testimonial-quote"
          >
            "{testimonial.quote}"
          </p>
          <footer className="mt-6 sm:mt-8">
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 bg-gray-300 text-foreground"
                aria-hidden="true"
              >
                {testimonial.initials}
              </div>
              <div className="text-left">
                <cite className="not-italic text-sm font-medium text-foreground" data-testid="text-testimonial-author">{testimonial.author}</cite>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
