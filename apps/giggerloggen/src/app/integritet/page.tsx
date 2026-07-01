import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default function IntegritetPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Integritetspolicy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Giggerloggen värnar om din personliga integritet. Denna policy
            beskriver hur vi samlar in, lagrar och behandlar dina personuppgifter.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Vilka uppgifter samlar vi in?</h2>
          <p>
            Vi samlar in namn, e-postadress och de uppgifter du anger om ditt
            företag, kunder och uppdrag. Vi samlar inte in fler uppgifter än vad
            som behövs för att tillhandahålla tjänsten.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Hur används uppgifterna?</h2>
          <p>
            Dina uppgifter används enbart för att tillhandahålla Giggerloggens
            tjänster – dvs. att visa dina uppdrag, generera fakturor och
            hantera din prenumeration.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Radering</h2>
          <p>
            Du kan när som helst radera ditt konto från inställningssidan.
            Alla dina uppgifter raderas permanent.
          </p>
          <p>
            Har du frågor?{" "}
            <Link href="mailto:kontakt@giggerloggen.se" className="text-primary hover:underline">
              Kontakta oss
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
