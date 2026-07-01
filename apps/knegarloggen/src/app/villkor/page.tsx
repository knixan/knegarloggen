export default function AnvandarvillkorPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        Användarvillkor för KnegarLoggen
      </h1>
      <p className="text-muted-foreground mb-8 italic">
        Senast uppdaterad: 2024-05-20
      </p>

      <div className="space-y-8 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">1. Allmänt</h2>
          <p>
            KnegarLoggen är ett webbaserat system för hantverkare och företag
            som vill hantera kunder, arbetstid, material, resor, dokumentation
            och fakturaunderlag. Genom att registrera ett konto och använda
            tjänsten accepterar du dessa villkor.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">2. Konto</h2>
          <p>
            För att använda tjänsten måste du skapa ett konto. Du ansvarar för
            att uppgifterna du lämnar är korrekta, att hålla dina
            inloggningsuppgifter säkra samt för all aktivitet som sker via ditt
            konto.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            3. Gratis provperiod
          </h2>
          <p>
            Nya användare får prova KnegarLoggen kostnadsfritt i 30 dagar. Efter
            provperiodens slut krävs en aktiv prenumeration för fortsatt
            användning.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">4. Betalning</h2>
          <p>
            Betalning kan ske via Stripe, PayPal eller faktura (om
            tillgängligt). Prenumerationsavgifter debiteras enligt den plan som
            användaren valt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            5. Ingen bindningstid
          </h2>
          <p>
            KnegarLoggen har ingen bindningstid. Du kan avsluta din
            prenumeration när som helst. Redan genomförda betalningar
            återbetalas normalt inte.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            6. Utebliven betalning
          </h2>
          <p>
            Vid utebliven betalning förbehåller sig KnegarLoggen rätten att
            begränsa åtkomsten till tjänsten, stänga av kontot eller avsluta
            kontot vid långvarig utebliven betalning.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            7. Användning av tjänsten
          </h2>
          <p>
            Användaren ansvarar för att följa svensk lagstiftning och att inte
            använda tjänsten för olaglig verksamhet eller ladda upp kränkande
            material.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            8. Fakturor och underlag
          </h2>
          <p>
            Användaren ansvarar själv för att kontrollera alla uppgifter,
            säkerställa att fakturor följer gällande regler samt att moms och
            skatter hanteras korrekt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            9. Bilder och material
          </h2>
          <p>
            Användaren ansvarar för allt material som laddas upp till tjänsten
            och intygar att denne har rätt att använda och lagra materialet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            10. Tillgänglighet
          </h2>
          <p>
            Vi strävar efter att tjänsten ska vara tillgänglig dygnet runt.
            Tillfälliga avbrott kan förekomma på grund av underhåll eller
            tekniska problem.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            11. Ansvarsbegränsning
          </h2>
          <p>
            KnegarLoggen ansvarar inte för förlorad data, förlorade
            affärsmöjligheter eller felaktiga uppgifter som registrerats av
            användaren.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            12. Ändringar
          </h2>
          <p>
            KnegarLoggen kan uppdatera dessa villkor vid behov. Väsentliga
            förändringar meddelas användarna i rimlig tid.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-3">13. Kontakt</h2>
          <p>E-post: [Din e-postadress]</p>
          <p>Företag: [Företagsnamn]</p>
          <p>Organisationsnummer: [Organisationsnummer]</p>
        </section>
      </div>
    </main>
  );
}
