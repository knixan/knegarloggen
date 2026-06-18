import {
  CheckCircle2,
  Clock,
  Package,
  Users,
  Receipt,
  Camera,
} from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/30 border-y">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Varför välja KnegarLoggen?
          </h2>
          <p className="text-muted-foreground text-lg">
            Vi vet att du hellre håller i verktygen än i pennan. Därför har vi
            byggt ett system som är så enkelt att du faktiskt kommer använda
            det.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
            title="Jobbhantering"
            description="Skapa jobb och följ dem genom hela kedjan — ej påbörjat, pågående, utfört, fakturerat och betalt. Alltid koll på var varje jobb befinner sig."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Kundregister"
            description="Hantera privat- och företagskunder med adress, personnummer, fastighetsbeteckning och organisationsnummer. Allt du behöver för faktura och ROT."
          />
          <FeatureCard
            icon={<Package className="h-6 w-6 text-orange-600" />}
            title="Material & kostnader"
            description="Lägg till artiklar med artikelnummer, återförsäljare och pris. Sluta gissa vad den där ventilen kostade — lägg in den direkt på plats."
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-red-600" />}
            title="Tid & resor"
            description="Logga arbetstimmar och körda mil per datum. Timpris och milersättning räknas ut automatiskt och följer med rakt in i fakturan."
          />
          <FeatureCard
            icon={<Receipt className="h-6 w-6 text-purple-600" />}
            title="Faktura & ROT-avdrag"
            description="Generera en professionell faktura med ett klick — med logotyp, automatiskt fakturanummer, moms och korrekt ROT-avdrag enligt Skatteverkets regler."
          />
          <FeatureCard
            icon={<Camera className="h-6 w-6 text-teal-600" />}
            title="Bildarkiv"
            description="Fotografera och spara bilder direkt på jobbet. Perfekt för före- och efterdokumentation och som underlag vid eventuella reklamationer."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-8 rounded-[2rem] border bg-white dark:bg-gray-950 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5">
      <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
