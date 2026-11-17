import Link from "next/link";
import { brand, ORT } from "../../brand";
import {
  Avsnitt,
  EpostLank,
  JuridikSida,
  KontaktRuta,
  Lista,
} from "../../components/site/juridik";

const avdrag = brand.skatteavdrag?.typ;

export default function IntegritetspolicyPage() {
  return (
    <JuridikSida
      titel={`Integritetspolicy för ${brand.namn}`}
      ingress={
        <p>
          Här beskriver vi vilka personuppgifter vi behandlar när du använder{" "}
          {brand.namn}, varför vi gör det, hur länge vi sparar dem och vilka
          rättigheter du har enligt dataskyddsförordningen (GDPR).
        </p>
      }
    >
      <Avsnitt rubrik="1. Vem ansvarar för dina uppgifter?">
        <p>
          {brand.namn} ({ORT}) är personuppgiftsansvarig för uppgifterna om dig
          som användare. Frågor om hur vi behandlar personuppgifter skickar du
          till <EpostLank />.
        </p>
        <p>
          För uppgifter om <strong>dina kunder</strong> som du registrerar i
          tjänsten är det ditt företag som är personuppgiftsansvarigt och{" "}
          {brand.namn} som är personuppgiftsbiträde. Det regleras i
          personuppgiftsbiträdesavtalet i{" "}
          <Link href="/villkor" className="underline">
            användarvillkoren
          </Link>
          .
        </p>
      </Avsnitt>

      <Avsnitt rubrik="2. Vilka uppgifter vi behandlar">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-primary">Ditt konto</h3>
            <Lista>
              <li>Namn och e-postadress</li>
              <li>Lösenord (lagras bara som ett krypterat hashvärde)</li>
            </Lista>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">Ditt företag</h3>
            <Lista>
              <li>Företagsnamn, organisationsnummer och momsregistrering</li>
              <li>Adress, telefonnummer och e-post</li>
              <li>Bankgiro, plusgiro eller Swish-nummer</li>
              <li>Logotyp</li>
            </Lista>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">
              Dina kunder (som du själv registrerar)
            </h3>
            <Lista>
              <li>Namn, adress, telefonnummer och e-post</li>
              <li>Organisationsnummer</li>
              {avdrag && (
                <li>
                  Personnummer
                  {brand.skatteavdrag?.kraverFastighet &&
                    " samt fastighetsbeteckning eller lägenhetsnummer"}{" "}
                  – bara när det behövs för {avdrag}-avdrag
                </li>
              )}
            </Lista>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">
              Jobb och fakturor
            </h3>
            <Lista>
              <li>Arbetstid, material, resor och anteckningar</li>
              <li>Fakturaunderlag och fakturor</li>
              <li>Bilder och dokument som du laddar upp</li>
            </Lista>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">
              Prenumeration och teknik
            </h3>
            <Lista>
              <li>
                Prenumerationsstatus och betalhistorik. Kortuppgifter hanteras
                av Stripe – vi ser eller sparar aldrig ditt kortnummer.
              </li>
              <li>
                Tekniska uppgifter som IP-adress och webbläsare i serverloggar
                och i inloggningssessionen
              </li>
            </Lista>
          </div>
        </div>
      </Avsnitt>

      <Avsnitt rubrik="3. Varför vi behandlar uppgifterna och med vilket stöd">
        <p>
          Vi behandlar bara uppgifter när vi har stöd för det i GDPR (rättslig
          grund):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-semibold">Ändamål</th>
                <th className="py-2 font-semibold">Rättslig grund</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_tr]:border-b">
              <tr>
                <td>
                  Skapa och driva ditt konto, spara jobb och kunder, skapa
                  fakturor
                </td>
                <td>Avtal (art. 6.1 b)</td>
              </tr>
              <tr>
                <td>
                  Skicka e-post som rör kontot, t.ex. verifiering och
                  lösenordsåterställning
                </td>
                <td>Avtal (art. 6.1 b)</td>
              </tr>
              <tr>
                <td>Ta betalt för prenumerationen och bokföra betalningen</td>
                <td>
                  Avtal (art. 6.1 b) och rättslig förpliktelse enligt
                  bokföringslagen (art. 6.1 c)
                </td>
              </tr>
              <tr>
                <td>Svara på frågor och ge support</td>
                <td>Berättigat intresse (art. 6.1 f)</td>
              </tr>
              <tr>
                <td>
                  Skydda tjänsten mot intrång och missbruk, felsöka och rätta
                  fel
                </td>
                <td>Berättigat intresse (art. 6.1 f)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Vi använder inte dina uppgifter till marknadsföring, profilering eller
          automatiserade beslut, och vi säljer aldrig personuppgifter.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="4. Ditt ansvar för dina kunders uppgifter">
        <p>
          När du registrerar kunder är det du som bestämmer vilka uppgifter som
          sparas och varför. Registrera bara det som behövs för jobbet och
          faktureringen, och informera dina kunder om hur du hanterar deras
          uppgifter.
          {avdrag &&
            ` Personnummer behövs bara för ${avdrag}-avdrag och visas bara på fakturan.`}
        </p>
      </Avsnitt>

      <Avsnitt rubrik="5. Hur länge vi sparar uppgifterna">
        <Lista>
          <li>
            <strong>Så länge du har ett konto</strong> sparas dina uppgifter och
            det du registrerat.
          </li>
          <li>
            <strong>När du raderar kontot</strong> (under Inställningar) raderas
            kontot, företagsuppgifter, kunder, jobb och uppladdade filer direkt
            ur tjänsten.
          </li>
          <li>
            <strong>Uppladdade filer som aldrig sparas</strong> på ett jobb,
            t.ex. om du avbryter ett formulär, raderas automatiskt efter ett
            dygn.
          </li>
          <li>
            <strong>Betalningsunderlag</strong> för din prenumeration sparas i 7
            år enligt bokföringslagen.
          </li>
          <li>
            <strong>Säkerhetskopior</strong> hos våra leverantörer kan innehålla
            uppgifterna en begränsad tid innan de skrivs över.
          </li>
        </Lista>
        <p className="text-sm text-muted-foreground italic">
          Dina egna fakturor ska också sparas i 7 år enligt bokföringslagen. Det
          ansvaret ligger hos ditt företag – ladda ner dina fakturor innan du
          raderar kontot.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="6. Vilka som får del av uppgifterna">
        <p>
          Vi anlitar följande leverantörer (underbiträden) för att driva
          tjänsten. De får bara behandla uppgifterna enligt våra instruktioner
          och har inte rätt att använda dem för egna syften:
        </p>
        <Lista>
          <li>Vercel – drift av webbplatsen</li>
          <li>Neon – databas</li>
          <li>UploadThing – lagring av bilder, dokument och logotyper</li>
          <li>Stripe – betalning av prenumerationen</li>
          <li>Resend – utskick av e-post</li>
        </Lista>
        <p>
          Flera av leverantörerna är amerikanska bolag, och uppgifter kan därför
          överföras till länder utanför EU/EES. Överföringen sker då med stöd av
          EU–US Data Privacy Framework eller EU-kommissionens
          standardavtalsklausuler.
        </p>
        <p>
          Vi lämnar också ut uppgifter till myndigheter om vi är skyldiga enligt
          lag.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="7. Cookies">
        <p>
          Vi använder bara det som behövs för att tjänsten ska fungera, och
          därför behöver vi inget samtycke:
        </p>
        <Lista>
          <li>
            <strong>Inloggningscookie</strong> – håller dig inloggad. Tas bort
            när du loggar ut eller när sessionen går ut.
          </li>
          <li>
            <strong>Temainställning</strong> – om du valt ljust eller mörkt läge
            sparas i din webbläsare (local storage).
          </li>
        </Lista>
        <p>
          Vi använder inga cookies för analys eller marknadsföring. När du
          betalar hos Stripe gäller Stripes egna cookies och integritetspolicy.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="8. Säkerhet">
        <p>
          All trafik är krypterad (HTTPS), lösenord lagras bara som hashvärden
          och varje företag kommer bara åt sina egna uppgifter. Om en
          personuppgiftsincident ändå skulle inträffa anmäler vi den till
          Integritetsskyddsmyndigheten och informerar dig när lagen kräver det.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="9. Dina rättigheter">
        <p>Du har rätt att:</p>
        <Lista>
          <li>få veta vilka uppgifter vi har om dig (registerutdrag),</li>
          <li>få felaktiga uppgifter rättade,</li>
          <li>få dina uppgifter raderade,</li>
          <li>begära att behandlingen begränsas,</li>
          <li>
            få ut uppgifter du själv lämnat i ett maskinläsbart format
            (dataportabilitet),
          </li>
          <li>invända mot behandling som grundas på berättigat intresse.</li>
        </Lista>
        <p>
          Mycket kan du göra själv i tjänsten: ändra uppgifter under Företag och
          Kunder, och radera hela kontot under Inställningar. Övriga
          förfrågningar skickar du till <EpostLank />. Vi svarar inom en månad.
        </p>
        <p>
          Gäller det uppgifter om en kund till ett företag som använder{" "}
          {brand.namn}? Vänd dig då i första hand till det företaget – det är de
          som är personuppgiftsansvariga.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="10. Klagomål">
        <p>
          Är du missnöjd med hur vi behandlar dina personuppgifter får du gärna
          höra av dig till oss först. Du har också rätt att lämna klagomål till
          Integritetsskyddsmyndigheten (IMY),{" "}
          <a
            href="https://www.imy.se"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            imy.se
          </a>
          .
        </p>
      </Avsnitt>

      <KontaktRuta rubrik="11. Kontakt" />
    </JuridikSida>
  );
}
