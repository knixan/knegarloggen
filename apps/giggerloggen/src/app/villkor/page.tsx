import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default function VillkorPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Användarvillkor</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Genom att använda Giggerloggen accepterar du dessa användarvillkor.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Tjänsten</h2>
          <p>
            Giggerloggen tillhandahåller ett verktyg för egenanställda att
            hantera uppdrag, fakturor och kundregister. Tjänsten erbjuds
            i befintligt skick.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Prenumeration</h2>
          <p>
            Efter 30 dagars gratis provperiod kostar tjänsten 99 kr/månad.
            Prenumerationen kan avslutas när som helst via inställningssidan.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Ansvarsbegränsning</h2>
          <p>
            Giggerloggen ansvarar inte för eventuella fel i genererade fakturor
            eller ekonomiska beräkningar. Verifiera alltid viktiga uppgifter
            med en redovisningskonsult.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
