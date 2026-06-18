import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
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
  );
}
