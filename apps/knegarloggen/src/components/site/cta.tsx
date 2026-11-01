import { brand } from "@knegarloggen/app/brand";
import Image from "next/image";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="px-4 py-16 lg:py-20 bg-surface">
      <p className="text-center text-base font-bold tracking-[0.1em] uppercase text-accent mb-8">
        Kom igång idag!
      </p>

      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-md bg-secondary text-secondary-foreground shadow-lg">
        {/* Flik uppe till höger */}
        <Link
          href="/registrera"
          className="absolute right-0 top-0 rounded-bl-md bg-accent px-6 py-2 text-lg font-semibold text-accent-foreground hover:bg-accent/85 transition-colors"
        >
          Gratis 30 dagar
        </Link>

        <div className="flex flex-col items-center gap-8 p-6 pt-16 lg:flex-row lg:gap-12 lg:p-6">
          <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-md lg:h-72 lg:w-[26rem]">
            <Image
              src="/knegare.png"
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 416px, 100vw"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              Redo att sluta
              <br />
              gissa på timmar?
            </h2>
            <ul className="mt-6 space-y-2 lg:pl-4">
              <li>30 dagars gratis provperiod.</li>
              <li>Ingen bindningstid. Avsluta när du vill.</li>
              <li>Därefter {brand.prisPerManad} kr/mån exkl. moms.</li>
              <li className="text-sm opacity-80">+ 49 kr per extra medlem.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
