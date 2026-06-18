import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
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
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-100 dark:bg-red-900/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
