import { Clock, FileText, Users, TrendingUp, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Clock,
    title: "Tidrapportering",
    description:
      "Logga arbetade timmar per uppdrag och datum. Beräkna automatiskt din ersättning baserat på ditt timpris.",
  },
  {
    icon: FileText,
    title: "Fakturering",
    description:
      "Skapa professionella fakturor i PDF-format med ditt företags logga och skicka direkt till kunden.",
  },
  {
    icon: Users,
    title: "Kundregister",
    description:
      "Håll koll på alla dina kunder – privatpersoner och företag – och koppla dem till rätt uppdrag.",
  },
  {
    icon: TrendingUp,
    title: "Ekonomiöversikt",
    description:
      "Se status på alla uppdrag: pågående, utförda, fakturerade och betalda. Full kontroll på kassan.",
  },
  {
    icon: Shield,
    title: "Moms & bokföring",
    description:
      "Beräkning av moms (25%) sker automatiskt. Exportera underlag för enkel bokföring.",
  },
  {
    icon: Zap,
    title: "Reseersättning",
    description:
      "Logga körda kilometer per uppdrag och beräkna automatisk milersättning på fakturan.",
  },
];

export function Features() {
  return (
    <section id="funktioner" className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Allt du behöver som egenanställd
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Giggerloggen är byggt specifikt för dig som fakturerar via
            egenanställningsbolag och säljer din kompetens och tid.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
