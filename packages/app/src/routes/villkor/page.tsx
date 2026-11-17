import Link from "next/link";
import { brand } from "../../brand";
import { PROVPERIOD_DAGAR } from "../../lib/prenumeration-regel";
import {
  Avsnitt,
  JuridikSida,
  KontaktRuta,
  Lista,
} from "../../components/site/juridik";

export default function AnvandarvillkorPage() {
  const avdrag = brand.skatteavdrag;

  return (
    <JuridikSida
      titel={`Användarvillkor för ${brand.namn}`}
      ingress={
        <p>
          Villkoren gäller mellan dig som användare och {brand.namn}. Genom att
          skapa ett konto godkänner du villkoren och vår{" "}
          <Link href="/integritet" className="underline">
            integritetspolicy
          </Link>
          .
        </p>
      }
    >
      <Avsnitt rubrik="1. Tjänsten">
        <p>
          {brand.namn} är en webbaserad tjänst för {brand.malgrupp} som vill
          hålla ordning på kunder, arbetstid, material, resor, bilder och
          fakturaunderlag.
        </p>
        <p>
          Tjänsten riktar sig till näringsidkare. Genom att skapa ett konto
          intygar du att du använder tjänsten i din yrkesverksamhet och har rätt
          att ingå avtal för företagets räkning.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="2. Konto">
        <p>
          Du ansvarar för att uppgifterna du lämnar är korrekta, att hålla ditt
          lösenord hemligt och för allt som görs via ditt konto. Misstänker du
          att någon annan har kommit åt kontot ska du byta lösenord och kontakta
          oss.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="3. Gratis provperiod">
        <p>
          Nya konton får prova {brand.namn} kostnadsfritt i {PROVPERIOD_DAGAR}{" "}
          dagar. Provperioden kräver inga kortuppgifter och övergår inte
          automatiskt till en betald prenumeration. För att fortsätta efter
          provperioden startar du en prenumeration under Inställningar.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="4. Pris och betalning">
        <p>
          Prenumerationen kostar {brand.prisPerManad} kr per månad exklusive
          moms, om inget annat anges vid köpet. Betalning sker i förskott per
          månad med kort via Stripe och förnyas automatiskt tills du säger upp
          den.
        </p>
        <p>
          Vi får ändra priset. Ett nytt pris meddelas via e-post minst 30 dagar
          innan det börjar gälla, och du kan säga upp prenumerationen innan
          dess.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="5. Uppsägning – ingen bindningstid">
        <p>
          Du kan säga upp prenumerationen när som helst under Inställningar. Den
          gäller då till slutet av den period du redan betalat för. Redan
          betalda perioder återbetalas inte.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="6. Utebliven betalning">
        <p>
          Om en betalning inte går igenom kan åtkomsten till tjänsten begränsas
          tills betalningen är ordnad. Dina uppgifter raderas inte för att en
          betalning uteblir, men vi kan avsluta kontot efter långvarig utebliven
          betalning. Det meddelar vi i så fall i förväg via e-post.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="7. Radera konto">
        <p>
          Du kan radera ditt konto när som helst under Inställningar. Då raderas
          kontot och allt du registrerat direkt och kan inte återställas. Ladda
          ner de fakturor du behöver spara innan du raderar kontot.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="8. Användning av tjänsten">
        <p>Du får inte använda tjänsten för att:</p>
        <Lista>
          <li>bedriva olaglig verksamhet eller upprätta falska fakturor,</li>
          <li>
            ladda upp material som är olagligt, kränkande eller som du inte har
            rätt att använda,
          </li>
          <li>
            försöka komma åt andras uppgifter eller störa tjänstens drift.
          </li>
        </Lista>
        <p>
          Bryter du mot villkoren kan vi stänga av kontot, i allvarliga fall
          utan förvarning.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="9. Fakturor och underlag">
        <p>
          {brand.namn} räknar fram belopp, moms
          {avdrag && ` och ${avdrag.typ}-avdrag`} utifrån de uppgifter du
          registrerar. Du ansvarar själv för att kontrollera uppgifterna, att
          fakturorna uppfyller gällande regler och att moms och skatter
          redovisas rätt.
        </p>
        {avdrag && (
          <p>
            Det är du som utförare som ansöker om utbetalning av {avdrag.typ}
            -avdrag hos Skatteverket och ansvarar för att arbetet och kunden
            uppfyller kraven för avdraget.
          </p>
        )}
        <p>
          Du ansvarar också för att spara fakturor och underlag så länge
          bokföringslagen kräver (7 år). {brand.namn} är inget bokföringssystem
          eller arkiv.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="10. Dina uppgifter och vårt innehåll">
        <p>
          Allt du registrerar och laddar upp – kunder, jobb, bilder och fakturor
          – tillhör dig. Du ger oss rätt att lagra och behandla materialet bara
          i den mån det behövs för att tillhandahålla tjänsten. Du intygar att
          du har rätt att ladda upp materialet.
        </p>
        <p>
          Tjänsten, dess kod, design och varumärke tillhör {brand.namn} och får
          inte kopieras eller återförsäljas.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="11. Tillgänglighet och ändringar i tjänsten">
        <p>
          Vi strävar efter att tjänsten ska vara tillgänglig dygnet runt, men
          kan inte lova att den alltid fungerar utan avbrott, t.ex. vid
          underhåll eller tekniska problem hos oss eller våra leverantörer. Vi
          utvecklar tjänsten löpande och kan ändra, lägga till eller ta bort
          funktioner.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="12. Ansvarsbegränsning">
        <p>
          Tjänsten tillhandahålls i befintligt skick. {brand.namn} ansvarar inte
          för indirekta skador som utebliven vinst, förlorade affärer eller
          följder av felaktiga uppgifter som du registrerat. Vårt samlade ansvar
          är begränsat till det belopp du betalat för tjänsten de senaste 12
          månaderna.
        </p>
        <p>
          Vi ansvarar inte heller för förseningar eller avbrott som beror på
          omständigheter utanför vår kontroll (force majeure), t.ex. fel hos
          leverantörer, myndighetsbeslut eller omfattande nätverksstörningar.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="13. Personuppgiftsbiträdesavtal (PUB-avtal)">
        <p>
          När du registrerar uppgifter om dina kunder är ditt företag
          personuppgiftsansvarigt och {brand.namn} personuppgiftsbiträde. Genom
          att godkänna villkoren ingår vi detta avtal, där {brand.namn} åtar sig
          att:
        </p>
        <Lista>
          <li>
            bara behandla uppgifterna för att tillhandahålla tjänsten och enligt
            dina dokumenterade instruktioner, som består av dessa villkor och
            det du gör i tjänsten,
          </li>
          <li>se till att alla som behandlar uppgifterna har tystnadsplikt,</li>
          <li>
            vidta lämpliga tekniska och organisatoriska säkerhetsåtgärder,
          </li>
          <li>
            bara anlita de underbiträden som anges i integritetspolicyn och
            informera dig i förväg om ändringar, så att du kan invända,
          </li>
          <li>
            hjälpa dig att uppfylla de registrerades rättigheter, t.ex. utdrag
            och radering,
          </li>
          <li>
            meddela dig utan onödigt dröjsmål vid en personuppgiftsincident,
          </li>
          <li>
            ge dig den information som behövs för att visa att avtalet följs,
          </li>
          <li>
            radera uppgifterna när du raderar ditt konto, och ge dig möjlighet
            att ta ut dem innan dess.
          </li>
        </Lista>
        <p>
          Du ansvarar för att du har rättslig grund för att registrera dina
          kunders uppgifter och att du informerar dem om behandlingen.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="14. Ändringar av villkoren">
        <p>
          Vi kan uppdatera villkoren. Väsentliga ändringar meddelas via e-post
          minst 30 dagar innan de börjar gälla. Fortsätter du använda tjänsten
          efter det godkänner du de nya villkoren. Vill du inte det kan du säga
          upp prenumerationen och radera kontot.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="15. Tillämplig lag och tvister">
        <p>
          Svensk lag gäller för villkoren. Tvister som vi inte kan lösa
          tillsammans avgörs av allmän domstol i Sverige.
        </p>
      </Avsnitt>

      <KontaktRuta rubrik="16. Kontakt" />
    </JuridikSida>
  );
}
