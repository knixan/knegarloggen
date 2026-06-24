import {
  CheckCircle2,
  Clock,
  Package,
  Users,
  Receipt,
  Camera,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: CheckCircle2,
    color: "text-emerald-600",
    accent: "border-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    title: "Jobbhantering",
    description:
      "Följ varje jobb genom hela kedjan — pågående, utfört, fakturerat och betalt. Alltid koll på var varje jobb befinner sig.",
  },
  {
    number: "02",
    icon: Users,
    color: "text-blue-600",
    accent: "border-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    title: "Kundregister",
    description:
      "Privat- och företagskunder med adress, personnummer och fastighetsbeteckning. Allt du behöver för faktura och ROT.",
  },
  {
    number: "03",
    icon: Package,
    color: "text-orange-600",
    accent: "border-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    title: "Material & kostnader",
    description:
      "Lägg in artiklar med artikelnummer och pris direkt på plats. Sluta gissa vad den där ventilen kostade.",
  },
  {
    number: "04",
    icon: Clock,
    color: "text-red-600",
    accent: "border-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    title: "Tid & resor",
    description:
      "Logga arbetstimmar och körda mil per datum. Timpris och milersättning räknas ut automatiskt.",
  },
  {
    number: "05",
    icon: Receipt,
    color: "text-purple-600",
    accent: "border-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    title: "Faktura & ROT-avdrag",
    description:
      "Professionell faktura med ett klick — logotyp, automatiskt fakturanummer, moms och korrekt ROT-avdrag.",
  },
  {
    number: "06",
    icon: Camera,
    color: "text-teal-600",
    accent: "border-teal-500",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    title: "Bildarkiv",
    description:
      "Fotografera och spara bilder direkt på jobbet. Perfekt för dokumentation och underlag vid reklamationer.",
  },
];

export default function Features() {
  return (
    <section className="py-28 bg-gray-50 dark:bg-gray-900/20">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="max-w-xl mb-16 space-y-4">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground">
            Funktioner
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Allt du behöver,
            <br />
            inget du inte gör.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Byggt för hantverkare som hellre håller i verktygen än i pennan.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.number}
                className="group relative bg-white dark:bg-gray-950 p-8 flex flex-col gap-5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
              >
                {/* Decorative number */}
                <span className="absolute top-5 right-6 text-6xl font-black text-gray-100 dark:text-gray-800/80 select-none leading-none group-hover:text-gray-200 dark:group-hover:text-gray-700 transition-colors">
                  {f.number}
                </span>

                {/* Icon */}
                <div
                  className={`relative z-10 w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${f.color}`} />
                </div>

                {/* Text */}
                <div className="relative z-10 space-y-2">
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${f.accent} border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
