import {
  Sprout,
  SprayCan,
  Trees,
  PaintRoller,
  Snowflake,
  Dog,
  Home,
  Plus,
} from "lucide-react";

const industries = [
  { icon: SprayCan, label: "Städning" },
  { icon: Sprout, label: "Trädgårdsskötsel" },
  { icon: Trees, label: "Trädfällning" },
  { icon: PaintRoller, label: "Målning & tapetsering" },
  { icon: Snowflake, label: "Snöskottning" },
  { icon: Dog, label: "Djur- & barnpassning" },
  { icon: Home, label: "Flyttstädning" },
  { icon: Plus, label: "Och många fler" },
];

export function Industries() {
  return (
    <section className="border-t border-b bg-muted/30 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Används av företag inom hushållsnära tjänster
        </p>
        <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10">
          {industries.map((industry) => (
            <div
              key={industry.label}
              className="flex flex-col items-center gap-2 w-20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-background shadow-sm">
                <industry.icon className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground text-center leading-tight">
                {industry.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
