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
    title: "RUT-avdrag",
    description:
      "RUT-avdraget beräknas automatiskt på fakturan utifrån arbetskostnaden – kunden betalar bara sin del direkt.",
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
            Allt du behöver inom städ & trädgård
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Hemfixloggen är byggt specifikt för dig som utför hushållsnära
            tjänster och fakturerar med RUT-avdrag.
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
