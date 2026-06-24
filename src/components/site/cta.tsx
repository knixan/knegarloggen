import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section className="bg-gray-950 dark:bg-black py-32 relative overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.07)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(37,99,235,0.07)_0%,transparent_60%)]" />

      <div className="relative container mx-auto px-4 text-center max-w-3xl">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500 mb-8">
          Kom igång idag
        </p>
        <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Redo att sluta
          <br />
          gissa på timmar?
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
          30 dagars gratis provperiod. Ingen bindningstid. Avsluta när du vill.
          99 kr/mån efteråt.
        </p>
        <Link
          href="/registrera"
          className="inline-flex items-center gap-2 h-14 px-10 bg-white text-gray-900 font-bold text-base rounded-lg hover:bg-gray-100 transition-colors"
        >
          Prova gratis i 30 dagar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
