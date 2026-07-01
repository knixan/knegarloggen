import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CTA() {
  return (
    <section id="priser" className="py-20 px-4">
      <div className="mx-auto max-w-2xl rounded-3xl bg-primary p-12 text-center text-primary-foreground shadow-xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Redo att ta kontroll?
        </h2>
        <p className="mt-4 text-primary-foreground/80">
          Starta din gratis provperiod idag. Inga kortuppgifter krävs de första
          30 dagarna. Därefter 99 kr/månad.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/registrera"
            className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "gap-2")}
          >
            Skapa konto gratis <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/logga-in"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10",
            )}
          >
            Logga in
          </Link>
        </div>
      </div>
    </section>
  );
}
