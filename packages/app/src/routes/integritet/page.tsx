export default function IntegritetspolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        Integritetspolicy för KnegarLoggen
      </h1>
      <p className="text-muted-foreground mb-8 italic">
        Senast uppdaterad: 2024-05-20
      </p>

      <div className="space-y-8 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">1. Inledning</h2>
          <p>
            KnegarLoggen värnar om din personliga integritet och behandlar
            personuppgifter i enlighet med Dataskyddsförordningen (GDPR).
          </p>
          <p className="mt-2">
            Denna integritetspolicy beskriver vilka personuppgifter vi samlar
            in, varför vi samlar in dem och vilka rättigheter du har.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            2. Vilka uppgifter vi samlar in
          </h2>
          <p>
            När du använder KnegarLoggen kan vi samla in följande uppgifter:
          </p>
          <p>
            När du använder KnegarLoggen kan vi samlar in följande uppgifter:
          </p>

          <div className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold mb-2 text-primary">
                Kontouppgifter
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Namn</li>
                <li>E-postadress</li>
                <li>Telefonnummer</li>
                <li>Lösenord (lagras krypterat)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-primary">
                Företagsuppgifter
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Företagsnamn</li>
                <li>Organisationsnummer</li>
                <li>Adress</li>
                <li>Postnummer och ort</li>
                <li>Momsregistreringsnummer</li>
                <li>Bankgiro, Plusgiro eller Swish-nummer</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-primary">
                Kunduppgifter som du registrerar
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Kundnamn</li>
                <li>Adress</li>
                <li>Telefonnummer</li>
                <li>E-postadress</li>
                <li>Organisationsnummer</li>
                <li>Personnummer (vid exempelvis ROT-arbeten)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-primary">
                Övriga uppgifter
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Arbetstider</li>
                <li>Materialregistreringar</li>
                <li>Resor</li>
                <li>Fakturaunderlag</li>
                <li>Bilder och dokument som laddas upp i tjänsten</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            3. Varför vi behandlar personuppgifter
          </h2>
          <p>
            Vi behandlar personuppgifter för att tillhandahålla tjänsten,
            hantera användarkonton, skapa fakturor och arbetsunderlag, ge
            support, förbättra tjänsten samt uppfylla lagkrav.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            4. Hur länge uppgifterna sparas
          </h2>
          <p>
            Personuppgifter sparas så länge kontot är aktivt. Efter att ett
            konto avslutats kan uppgifter sparas under en begränsad tid för
            säkerhetskopiering, juridiska skyldigheter och bokföringskrav.
          </p>
          <p className="mt-4 text-sm text-muted-foreground italic">
            Normalt raderas personuppgifter inom 12 månader efter att kontot
            avslutats, om inte lag kräver längre lagring.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            5. Bilder och dokument
          </h2>
          <p>
            Bilder och dokument som laddas upp till KnegarLoggen lagras för att
            tillhandahålla tjänstens funktioner. Användaren äger fortsatt sitt
            material. Materialet används aldrig för marknadsföring eller delas
            med tredje part utan användarens samtycke.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            6. Delning av uppgifter
          </h2>
          <p>
            Vi säljer aldrig personuppgifter till tredje part. Uppgifter kan
            delas med leverantörer som hjälper oss att driva tjänsten (t.ex.
            hosting och betalningsleverantörer). Dessa leverantörer får endast
            behandla uppgifterna enligt våra instruktioner.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            7. Dina rättigheter
          </h2>
          <p>
            Du har rätt att begära information om vilka uppgifter vi har om dig,
            begära rättelse av felaktiga uppgifter, begära radering av
            uppgifter, invända mot viss behandling eller begära export av dina
            uppgifter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">8. Säkerhet</h2>
          <p>
            Vi använder rimliga tekniska och organisatoriska säkerhetsåtgärder
            för att skydda dina uppgifter mot obehörig åtkomst, förlust eller
            missbruk.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-3">9. Kontakt</h2>
          <p>E-post: [Din e-postadress]</p>
          <p>Företag: [Företagsnamn]</p>
          <p>Organisationsnummer: [Organisationsnummer]</p>
        </section>
      </div>
    </main>
  );
}
