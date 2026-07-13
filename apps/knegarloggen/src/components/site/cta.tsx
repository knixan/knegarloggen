import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section className="px-4  py-16 lg:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-secondary">
  

        <div className="relative  flex flex-col items-center gap-8 p-4 lg:flex-row lg:gap-12 lg:p-12">
          {/* Image */}
          <div className="relative h-48 w-full max-w-sm shrink-0 overflow-hidden rounded-2xl lg:h-80 lg:w-102">
            <Image
              src="/knegare.png"
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 320px, 100vw"
            />
          </div>

          {/* Text */}
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-8">
              Kom igång idag
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-primary-foreground leading-[1.05] tracking-tight mb-6">
              Redo att sluta
              <br />
              gissa på timmar?
            </h2>
            <p className="text-primary-foreground text-lg leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
              30 dagars gratis provperiod. Ingen bindningstid. Avsluta när du vill.
              99 kr/mån efteråt.
            </p>
            <Link
              href="/registrera"
              className="inline-flex items-center gap-2 h-14 px-10 bg-primary text-primary-foreground font-bold text-base rounded-lg hover:bg-accent transition-colors"
            >
              Prova gratis i 30 dagar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
