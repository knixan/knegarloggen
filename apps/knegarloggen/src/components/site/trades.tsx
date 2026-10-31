import {
  BrickWall,
  Grid3x3,
  Hammer,
  HardHat,
  Layers,
  PaintRoller,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const trades: { label: string; icon: LucideIcon }[] = [
  { label: "Snickare", icon: Hammer },
  { label: "Elektriker", icon: Zap },
  { label: "Murare", icon: BrickWall },
  { label: "Golvläggare", icon: Layers },
  { label: "Målare", icon: PaintRoller },
  { label: "VVS-montörer", icon: Wrench },
  { label: "Plattsättare", icon: Grid3x3 },
  { label: "Bygg & renovering", icon: HardHat },
];

export default function Trades() {
  return (
    <section className="py-16 lg:py-20 bg-surface">
      <div className="container mx-auto px-4 text-center">
        <p className="text-base font-bold tracking-[0.1em] uppercase text-accent">
          Hantverkare
        </p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
          Ett verktyg för alla som jobbar med händerna
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          Oavsett bransch hjälper KnegarLoggen dig att samla jobb, timmar,
          material och fakturering på ett och samma ställe.
        </p>

        <ul className="mt-10 mx-auto grid max-w-3xl grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-left">
          {trades.map(({ label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon
                aria-hidden="true"
                className="h-7 w-7 shrink-0 text-primary"
                strokeWidth={1.5}
              />
              <span className="font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
