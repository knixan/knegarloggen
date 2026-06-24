import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-white dark:bg-gray-950 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[48px_48px] opacity-60" />

      <div className="relative container mx-auto px-4 pt-16 pb-24 lg:pt-28 lg:pb-40">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left – content */}
          <div className="flex-1 max-w-2xl space-y-8 text-center lg:text-left">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground">
              Jobblogg för hantverkare
            </p>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
              Från{" "}
              <span className="bg-linear-to-br from-red-600 to-red-400 bg-clip-text text-transparent">
                jobb
              </span>
              <br />
              till{" "}
              <span className="bg-linear-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">
                faktura.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              Logga tid, material och resor direkt på plats. Skicka
              professionella fakturor med ROT-avdrag – utan papperskrångel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/registrera"
                className="inline-flex items-center gap-2 h-12 px-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors text-sm"
              >
                Prova gratis i 30 dagar
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/logga-in"
                className="inline-flex items-center h-12 px-5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Logga in →
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                99 kr/mån efter provperioden
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Ingen bindningstid
              </span>
            </div>
          </div>

          {/* Right – screenshot */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-6 bg-linear-to-br from-red-500/15 via-transparent to-blue-500/15 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800 shadow-2xl shadow-black/10">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <Image
                src="/Knegarloggen-hero.png"
                alt="KnegarLoggen – jobbvy"
                width={1000}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
