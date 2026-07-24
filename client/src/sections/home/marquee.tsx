export function Marquee() {
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
                className={`text-xs uppercase tracking-eyebrow ${word.bold ? "font-semibold text-muted-foreground" : "font-medium text-gray-450"}`}
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
