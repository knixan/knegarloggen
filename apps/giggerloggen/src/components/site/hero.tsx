import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const highlights = [
  "30 dagars gratis provperiod",
  "Ingen bindningstid",
  "Fakturera direkt från appen",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen min-w-screen flex flex-col justify-center bg-background">
      {/* Full-bleed background */}
      <Image
        src="/hero-giggerloggen.png"
        alt=""
        fill
        className="object-cover object-top-right"
        priority
        sizes="100vw"
      />

      {/* Gradient overlay: opaque left (text) → transparent right (image) */}
      <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/60 to-background/10 dark:from-background/95 dark:via-background/70 dark:to-background/20" />
      {/* Fallback full overlay for small screens */}
      <div className="absolute inset-0 bg-background/70 min-[900px]:bg-transparent" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
        <div className="flex justify-center min-[900px]:justify-start">
          <div className="w-full max-w-lg space-y-7 text-center min-[900px]:text-left">
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-muted-foreground">
              Enkelt för egenanställda
            </p>

            <h1 className="text-5xl font-black tracking-tight leading-[1.07] sm:text-6xl">
              Mer tid åt{" "}
              <span className="text-primary">kunder.</span>
              <br />
              Mindre{" "}
              <span className="text-secondary">administration.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto min-[900px]:mx-0">
              Giggerloggen hjälper dig att hantera uppdrag, tidrapportering och
              fakturering – allt på ett ställe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center min-[900px]:justify-start gap-3 pt-1">
              <Link
                href="/registrera"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Starta gratis i 30 dagar <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#funktioner"
                className="inline-flex items-center h-11 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Se hur det fungerar →
              </Link>
            </div>

            <ul className="flex flex-col items-center gap-2 pt-1 text-sm text-muted-foreground sm:flex-row sm:justify-center min-[900px]:justify-start sm:gap-5">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-secondary" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
