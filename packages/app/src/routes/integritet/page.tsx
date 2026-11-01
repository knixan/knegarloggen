import { brand } from "../../brand";

export default function IntegritetspolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        Integritetspolicy för {brand.namn}
      </h1>
      <p className="text-muted-foreground mb-8 italic">
        Senast uppdaterad: 2026-11-01
      </p>

      <div className="space-y-8 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">1. Inledning</h2>
          <p>
            {brand.namn} värnar om din personliga integritet och behandlar
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
            När du använder {brand.namn} kan vi samla in följande uppgifter:
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
                <li>Personnummer (vid exempelvis ROT- och RUT-arbeten)</li>
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
            Personuppgifter sparas så länge kontot är aktivt. När du raderar
            ditt konto raderas kontot, företagsuppgifter, kunder, jobb och
            uppladdade filer direkt ur tjänsten. Uppgifterna kan finnas kvar en
            begränsad tid i våra leverantörers säkerhetskopior innan de skrivs
            över.
          </p>
          <p className="mt-4 text-sm text-muted-foreground italic">
            Enligt bokföringslagen ska fakturor och underlag sparas i 7 år. Det
            ansvaret ligger hos ditt företag – ladda ner dina fakturor innan du
            raderar kontot.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            5. Bilder och dokument
          </h2>
          <p>
            Bilder och dokument som laddas upp till {brand.namn} lagras för att
            tillhandahålla tjänstens funktioner. Användaren äger fortsatt sitt
            material. Materialet används aldrig för marknadsföring eller delas
            med tredje part utan användarens samtycke.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-1">
            6. Delning av uppgifter
          </h2>
          <p>Vi säljer aldrig personuppgifter till tredje part.</p>
          <p className="mt-4">
            <strong>Roller.</strong> För uppgifter om dig som användare är vi
            personuppgiftsansvariga. För uppgifter om dina kunder som du
            registrerar i tjänsten är ditt företag personuppgiftsansvarigt och
            vi personuppgiftsbiträde. Det regleras i
            personuppgiftsbiträdesavtalet (PUB-avtalet) i användarvillkoren.
          </p>
          <p className="mt-4">
            <strong>Underbiträden.</strong> Vi anlitar följande leverantörer för
            att driva tjänsten. De får bara behandla uppgifterna enligt våra
            instruktioner:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Vercel – drift av webbplatsen</li>
            <li>Neon – databas</li>
            <li>UploadThing – lagring av bilder och logotyper</li>
            <li>Stripe – betalning av prenumerationen</li>
            <li>Resend – utskick av e-post (t.ex. verifiering)</li>
          </ul>
          <p className="mt-4">
            Om en leverantör behandlar uppgifter utanför EU/EES sker
            överföringen med stöd av EU-kommissionens standardavtalsklausuler
            eller EU–US Data Privacy Framework.
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
