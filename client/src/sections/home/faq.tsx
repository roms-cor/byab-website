import { resolvedFaq } from "@content/faq";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 border-t border-border/50">
      <div className="max-w-container mx-auto">
        <header className="mb-12 sm:mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-eyebrow font-medium mb-3 text-muted-foreground" aria-hidden="true">FAQ</p>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            data-testid="text-section-faq"
          >
            Frequently asked questions.
          </h2>
        </header>

        <div className="border border-border/50 rounded-lg overflow-hidden divide-y divide-black-alpha-06">
          {resolvedFaq.map((item, i) => (
            <details
              key={item.question}
              className="group"
              open={i === 0}
              data-testid={`faq-item-${i}`}
            >
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none px-6 sm:px-8 py-5 sm:py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold text-foreground" data-testid={`text-faq-question-${i}`}>{item.question}</h3>
                <span
                  className="text-lg font-mono leading-none flex-shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-45 text-gray-450"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="px-6 sm:px-8 pb-6 sm:pb-7 -mt-1 text-sm leading-relaxed max-w-3xl text-muted-foreground" data-testid={`text-faq-answer-${i}`}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
