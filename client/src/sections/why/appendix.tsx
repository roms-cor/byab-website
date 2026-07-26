import { useState, type FormEvent } from "react";
import { resolvedFaq } from "@content/faq";
import { siteConfig } from "@content/site.config";
import { whyContent } from "@content/why";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

/**
 * Objection-handling appendix: a subset of content/faq.ts (selected via
 * whyContent.appendix.faqIndexes) + a low-commitment email capture.
 * Native <details>/<summary> (same pattern as the homepage FAQ) keeps every
 * answer inside the prerendered HTML for non-JS crawlers.
 */
export function WhyAppendix() {
  const { appendix } = whyContent;
  const selectedFaq = appendix.faqIndexes
    .map((i) => resolvedFaq[i])
    .filter((f): f is (typeof resolvedFaq)[number] => Boolean(f));

  const [email, setEmail] = useState("");
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(appendix.capture.mailtoSubject);
    const body = encodeURIComponent(`Please add ${email} to your occasional notes.`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="why-appendix" aria-labelledby="why-appendix-heading" className="grid grid-cols-12 bg-gray-50">
      <SectionTitle num={appendix.part} title={appendix.partTitle} />
      <div className="col-span-12 md:col-span-8 lg:col-span-9 p-8 md:p-16 lg:p-24">
        <Reveal>
          <h2
            id="why-appendix-heading"
            className="text-2xl md:text-3xl font-medium tracking-tight text-gray-800 leading-[1.1] mb-16 pr-4"
            data-testid="text-why-appendix-title"
          >
            {appendix.heading}
          </h2>
        </Reveal>

        <div className="mb-24 max-w-3xl">
          <Reveal delay={1}>
            {selectedFaq.map((item, i) => (
              <details key={item.question} className="group border-b border-gray-100" data-testid={`why-faq-item-${i}`}>
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-left text-[15px] font-medium text-gray-800" data-testid={`text-why-faq-question-${i}`}>
                    {item.question}
                  </h3>
                  <span
                    className="text-lg font-mono leading-none flex-shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-45 text-gray-300"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="text-[15px] text-muted-foreground leading-relaxed pb-6 pr-8">{item.answer}</p>
              </details>
            ))}
          </Reveal>
        </div>

        <Reveal delay={2}>
          <div className="border border-gray-100 bg-white p-8 md:p-10 max-w-3xl flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 text-center md:text-left">
              <div className="text-[15px] font-medium text-gray-800 mb-2">{appendix.capture.title}</div>
              <div className="text-[13px] text-gray-300">{appendix.capture.subtitle}</div>
            </div>
            <form className="flex w-full md:w-auto" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={appendix.capture.placeholder}
                aria-label="Email address"
                className="h-12 px-5 bg-gray-50 border border-gray-100 border-r-0 font-mono text-2xs text-gray-800 focus:outline-none focus:border-gray-800 w-full md:w-64 transition-colors"
                data-testid="input-why-email"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-gray-800 text-white font-mono text-3xs uppercase tracking-label hover:bg-gray-500 transition-colors shrink-0 font-bold"
                data-testid="button-why-subscribe"
              >
                {appendix.capture.buttonLabel}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
