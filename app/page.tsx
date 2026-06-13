import Image from "next/image";
import { Camera } from "lucide-react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Package,
  Van,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-800">
                <Zap className="h-4 w-4" />
                <span>Enklare vardag för hantverkare</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                Håll koll på dina jobb –
                <br />
                från <span className="text-red-600">planering</span> till{" "}
                <span className="text-blue-600">betalning</span>.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                KnegarLoggen är det smarta verktyget för hantverkare som vill
                slippa papperskaoset. Logga tid, material och resor direkt på
                plats – och få betalt snabbare.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-lg font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 border-none"
                >
                  <Link href="/registrera">
                    Prova en månad gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold"
                >
                  <Link href="/logga-in">Logga in</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Säker lagring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Ingen bindningstid</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full lg:max-w-none">
              <div className="relative z-10 w-full rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-gray-800 bg-muted">
                <Image
                  src="/Knegarloggen-hero.png"
                  alt="KnegarLoggen på dator, platta och mobil"
                  width={1000}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-100 dark:bg-red-900/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              description="Skapa jobb per kund och håll koll på status. Se direkt vad som är pågående, utfört eller fakturerat."
            />
            <FeatureCard
              icon={<Package className="h-6 w-6 text-blue-600" />}
              title="Materialkoll"
              description="Lägg till artiklar med pris och antal direkt i mobilen. Sluta gissa vad den där ventilen kostade."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6 text-red-600" />}
              title="Tidsrapportering"
              description="Logga dina timmar på varje projekt. Perfekt för både löpande räkning och uppföljning av fastpris."
            />
            <FeatureCard
              icon={<Van className="h-6 w-6 text-orange-600" />}
              title="Reselogg"
              description="Glöm inte milersättningen. Logga datum och sträcka för varje resa kopplat till rätt jobb."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-purple-600" />}
              title="Utskriftsvänligt"
              description="Generera snygga sammanställningar för utskrift eller PDF. Proffsigt underlag till dina fakturor."
            />
            <FeatureCard
              icon={<Camera className="h-6 w-6 text-purple-600" />}
              title="Spara bilder på jobb"
              description="Dokumentera arbetet direkt i appen. Perfekt för före- och efterbilder samt underlag till kund."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-blue-600 rounded-[2.5rem] px-8 py-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-black">
                Gör som Kristian – få mer tid över till det du är bäst på.
              </h2>
              <p className="text-xl text-blue-100 font-medium leading-relaxed">
                Sluta oroa dig för borttappade kvitton och glömda timmar.
                Registrera dig idag och upplev skillnaden.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-16 px-12 text-xl font-black rounded-full text-blue-600 hover:scale-105 transition-transform border-none"
                >
                  <Link href="/registrera">Prova en månad gratis</Link>
                </Button>
                <div className="text-left">
                  <p className="text-blue-200 text-sm font-medium">
                    Inga dolda avgifter.
                  </p>
                  <p className="text-blue-200 text-sm font-medium">
                    Inget krångel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
