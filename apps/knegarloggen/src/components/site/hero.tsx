import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileText,
  Package,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const steps: { label: string; icon: LucideIcon }[] = [
  { label: "Skapa jobb", icon: Wrench },
  { label: "Logga tid", icon: Clock },
  { label: "Material", icon: Package },
  { label: "Skapa faktura", icon: FileText },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-tertiary lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Bild – desktop: högra delen, tonas in från ytfärgen till vänster */}
      <div className="absolute inset-y-0 right-0 hidden w-[62%] lg:block">
        <Image
          src="/hero-mobile.png"
          alt=""
          fill
          className="object-cover object-[65%_center]"
          priority
          sizes="62vw"
        />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-surface-tertiary to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-xl space-y-8 text-center lg:text-left mx-auto lg:mx-0">
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary">
            Jobblogg för hantverkare
          </p>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-foreground">
            Från jobb
            <br />
            till{" "}
            <span className="relative inline-block text-accent">
              faktura
              {/* Penseldrag under ordet */}
              <svg
                aria-hidden="true"
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                className="absolute -bottom-5 left-0 h-4 w-full md:h-5 text-accent"
              >
                <path
                  d="M4 18 C 70 6, 180 2, 296 8 L 294 14 C 190 9, 90 12, 8 22 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="text-accent">!</span>
          </h1>

          {/* Steps */}
          <ol className="flex items-start justify-center lg:justify-start gap-1 sm:gap-2 pt-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className="flex items-start gap-1 sm:gap-2">
                  <div className="flex w-16 sm:w-20 flex-col items-center gap-2">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-4 sm:mt-6 h-4 w-4 shrink-0 text-accent"
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <p className="text-base font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
            Logga tid, material och resor på plats! Skicka professionella
            fakturor med ROT-avdrag, utan papperskrångel!
          </p>

          <Link
            href="/registrera"
            className="inline-flex items-center h-11 px-6 rounded-md bg-accent text-accent-foreground font-semibold text-sm shadow-md hover:bg-accent/85 transition-colors"
          >
            Prova gratis 30 dagar
          </Link>

        </div>
      </div>

      {/* Bild – mobil: under texten */}
      <div className="relative h-72 w-full sm:h-96 lg:hidden">
        <Image
          src="/hero-mobile.png"
          alt=""
          fill
          className="object-cover object-[65%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-surface-tertiary to-transparent" />
      </div>
    </section>
  );
}
