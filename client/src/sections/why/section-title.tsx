/**
 * Sticky run-book part label — the left rail of each /why section
 * ("Part 01 · The Problem"). `dark` renders the inverted variant used by
 * the Model section.
 */
export function SectionTitle({ num, title, dark = false }: { num: string; title: string; dark?: boolean }) {
  return (
    <div
      className={`col-span-12 md:col-span-4 lg:col-span-3 p-8 md:p-12 md:border-r border-b md:border-b-0 flex flex-col ${
        dark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-100 bg-white"
      }`}
    >
      <div className="sticky top-12">
        <div
          className="font-mono text-3xs uppercase tracking-label text-gray-300 mb-3"
          data-testid={`text-why-part-${num}`}
        >
          Part {num}
        </div>
        <div
          className={`font-mono text-xs uppercase tracking-label leading-relaxed ${
            dark ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
