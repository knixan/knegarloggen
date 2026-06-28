import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-white dark:bg-gray-950 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background image – desktop */}
      <Image
        src="/knegarloggen-hero.png"
        alt=""
        fill
        className="hidden lg:block object-cover object-top-right translate-y-0"
        priority
        sizes="100vw"
      />
      {/* Background image – mobile */}
      <Image
        src="/hero-mobile.png"
        alt=""
        fill
        className="block lg:hidden object-cover object-top"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/75" />

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
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

            {/* Steps */}
            <div className="flex items-start justify-center lg:justify-start gap-0">
              {[
                { n: 1, label: "Skapa jobb", color: "bg-blue-600" },
                { n: 2, label: "Logga tid", color: "bg-red-600" },
                { n: 3, label: "Material", color: "bg-blue-600" },
                { n: 4, label: "Skapa faktura", color: "bg-red-600" },
                { n: 5, label: "Få betalt", color: "bg-blue-600" },
              ].map((step, i, arr) => (
                <div key={step.n} className="flex items-start">
                  <div className="flex flex-col items-center gap-2 w-20 sm:w-24">
                    <div
                      className={`${step.color} h-12 w-12 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0`}
                    >
                      {step.n}
                    </div>
                    <span className="text-xs font-bold text-center leading-tight">
                      {step.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="mt-6 flex-1 h-px bg-gray-300 dark:bg-gray-700 min-w-2" />
                  )}
                </div>
              ))}
            </div>

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

            <div className="block lg:hidden w-full pt-4">
              <Image
                src="/knegarlogg-mobile.png"
                alt="KnegarLoggen – app"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Right – screenshot */}
          <div className="flex-1 w-full relative">
           
              {/* <Image
                src="/knegarlogg-heroscreen.png"
                alt="KnegarLoggen – jobbvy"
                width={1000}
                height={600}
                className="w-full h-auto object-cover"
                priority
              /> */}
            </div>
          </div>

        </div>
      
    </section>
  );
}
