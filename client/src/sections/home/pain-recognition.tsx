import { painPoints } from "@content/pain";

export function PainRecognition() {
  const pains = painPoints;

  return (
    <section aria-label="The problem we solve" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-foreground">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-background"
            data-testid="text-section-pain"
          >
            You didn't start a company
            to manage its{" "}
            <span className="text-gray-350">back-office.</span>
          </h2>
          <ul className="space-y-0 list-none m-0 p-0 divide-y divide-white-alpha-08">
            {pains.map((pain, i) => (
              <li
                key={pain.num}
                className="grid grid-cols-[24px_1fr] gap-4 items-start py-6"
                data-testid={`pain-item-${pain.num}`}
              >
                <span className="text-xs font-mono pt-0.5 text-muted-foreground">{pain.num}</span>
                <p className="text-base leading-relaxed text-white-alpha-85">
                  <strong className="font-semibold text-background">{pain.lead}</strong>
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
