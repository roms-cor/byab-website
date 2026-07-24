import { Palette, Type, Grid3X3, Layers, BookOpen, Image, LayoutTemplate } from "lucide-react";

/** Section registry: drives both the side navigation and the page's active-section observer. */
export const navSections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "logo", label: "Logo", icon: Image },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "spacing", label: "Spacing", icon: Grid3X3 },
  { id: "ui-components", label: "UI Components", icon: Layers },
  { id: "sections", label: "Site Sections", icon: LayoutTemplate },
  { id: "guidelines", label: "Guidelines", icon: BookOpen },
];

export function SideNav({ activeSection }: { activeSection: string }) {
  return (
    <nav aria-label="Page sections">
      <ul className="space-y-0.5 list-none p-0 m-0">
        {navSections.map((section) => {
          const Icon = section.icon;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-testid={`link-nav-${section.id}`}
                aria-current={activeSection === section.id ? "true" : undefined}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                  activeSection === section.id
                    ? "text-foreground font-medium bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
