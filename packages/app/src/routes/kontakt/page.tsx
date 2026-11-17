import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { brand, ORT } from "../../brand";
import {
  Avsnitt,
  EpostLank,
  JuridikSida,
  Lista,
} from "../../components/site/juridik";

export default function KontaktPage() {
  return (
    <JuridikSida
      titel="Kontakt"
      ingress={
        <p>
          Har du frågor om {brand.namn}, behöver hjälp med ditt konto eller vill
          lämna synpunkter? Hör av dig så svarar vi så snart vi kan, normalt
          inom ett par arbetsdagar.
        </p>
      }
    >
      <section className="bg-muted p-6 rounded-lg space-y-3">
        <p className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
          <EpostLank />
        </p>
        <p className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>{ORT}</span>
        </p>
      </section>

      <Avsnitt rubrik="Skicka inte känsliga uppgifter via e-post">
        <p>
          Skriv aldrig ditt lösenord, personnummer eller uppgifter om dina
          kunder i ett mejl till oss. Vi frågar aldrig efter ditt lösenord.
          Beskriv i stället problemet och vilken e-postadress kontot är
          registrerat på.
        </p>
      </Avsnitt>

      <Avsnitt rubrik="Frågor om personuppgifter (GDPR)">
        <p className="flex items-start gap-3">
          <ShieldCheck
            className="h-5 w-5 mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <span>
            Vill du ha ett registerutdrag, rätta eller radera uppgifter eller
            invända mot en behandling? Mejla <EpostLank /> från den adress
            kontot är registrerat på och skriv vad du vill att vi gör. Vi kan
            behöva bekräfta din identitet innan vi lämnar ut något, och vi
            svarar inom en månad.
          </span>
        </p>
        <p>Du kan också göra en del själv när du är inloggad:</p>
        <Lista>
          <li>ändra företags- och kunduppgifter under Företag och Kunder,</li>
          <li>säga upp prenumerationen under Inställningar,</li>
          <li>
            radera hela kontot och allt du registrerat under Inställningar.
          </li>
        </Lista>
        <p>
          Läs mer i vår{" "}
          <Link href="/integritet" className="underline">
            integritetspolicy
          </Link>{" "}
          och våra{" "}
          <Link href="/villkor" className="underline">
            användarvillkor
          </Link>
          .
        </p>
      </Avsnitt>
    </JuridikSida>
  );
}
