import {
  Camera,
  Clock,
  FileText,
  Package,
  Users,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Jobbhantering",
    description:
      "Följ varje jobb genom hela kedjan, pågående, utfört, fakturerat och betalt. Alltid koll på var varje jobb befinner sig.",
  },
  {
    icon: Users,
    title: "Kundregister",
    description:
      "Privat- och företagskunder med adress, personnummer och fastighetsbeteckning. Allt du behöver för faktura och ROT.",
  },
  {
    icon: Package,
    title: "Material & kostnader",
    description:
      "Lägg in artiklar med artikelnummer och pris direkt på plats. Sluta gissa vad den där ventilen kostade.",
  },
  {
    icon: Clock,
    title: "Tid & resor",
    description:
      "Logga arbetstimmar och körda mil per datum. Timpris och milersättning räknas ut automatiskt.",
  },
  {
    icon: FileText,
    title: "Faktura & ROT-avdrag",
    description:
      "Professionell faktura med ett klick, logotyp, automatiskt fakturanummer, moms och korrekt ROT-avdrag.",
  },
  {
    icon: Camera,
    title: "Bildarkiv",
    description:
      "Fotografera och spara bilder direkt på jobbet. Perfekt för dokumentation och underlag vid reklamationer.",
  },
];

export default function Features() {
  return (
    <section id="funktioner" className="scroll-mt-16 py-20 lg:py-24 bg-surface-tertiary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-base font-bold tracking-[0.1em] uppercase text-accent">
            Funktioner
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            Allt du behöver, inget du inte gör.
          </h2>
          <p className="mt-4 max-w-xs mx-auto text-muted-foreground leading-relaxed">
            Byggt för hantverkare som hellre håller i verktygen än i pennan.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-md bg-surface-card p-5 shadow-md transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-center gap-3">
                <Icon
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 text-primary"
                  strokeWidth={1.5}
                />
                <h3 className="font-bold">{title}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
