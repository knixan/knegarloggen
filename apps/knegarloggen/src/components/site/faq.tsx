import { brand } from "@knegarloggen/app/brand";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "Vad händer när provperioden tar slut?",
    answer: `Du behöver inget kort under provperioden. När de 30 dagarna har gått lägger du till kortuppgifter för att fortsätta, ${brand.prisPerManad} kr/mån exkl. moms.`,
  },
  {
    question: "Hur säger jag upp?",
    answer:
      'Under Inställningar klickar du på "Avsluta prenumeration". Ingen bindningstid, och du har tillgång till tjänsten till och med periodens slut.',
  },
  {
    question: "Vad kan jag göra i appen?",
    answer:
      "Skapa jobb, logga tid, resor och material, spara bilder, hålla ett kundregister och skapa fakturor med ROT-avdrag.",
  },
  {
    question: "Är det ett bokföringsprogram?",
    answer:
      "Nej. KnegarLoggen håller koll på jobb, tid, material och fakturor. Bokföringen sköter du som vanligt i ditt bokföringsprogram.",
  },
  {
    question: "Hur fungerar ROT-avdraget?",
    answer:
      "Du lägger in kundens personnummer och fastighetsbeteckning i kundregistret. ROT-avdraget räknas sedan ut automatiskt och visas på fakturan.",
  },
  {
    question: "Kan jag sätta fast pris i stället för löpande räkning?",
    answer:
      "Ja. Bocka i fast pris på jobbet så ersätter det den beräknade summan på fakturan.",
  },
  {
    question: "Kan jag koppla appen till Fortnox?",
    answer:
      "Inte i dagsläget. Du kan ladda ner fakturan som PDF och föra in den i ditt bokföringsprogram.",
  },
  {
    question: "Kan jag skicka fakturan direkt till kunden?",
    answer:
      "Du laddar ner fakturan som PDF och skickar den till kunden själv, till exempel via e-post.",
  },
  {
    question: "Var lagras mina uppgifter?",
    answer: (
      <>
        Dina uppgifter och bilder lagras hos oss och delas aldrig med tredje
        part utan ditt samtycke. Läs mer i vår{" "}
        <Link href="/integritet" className="underline hover:text-foreground">
          integritetspolicy
        </Link>
        .
      </>
    ),
  },
  {
    question: "Följer ni GDPR?",
    answer: (
      <>
        Ja. Vi behandlar personuppgifter enligt dataskyddsförordningen (GDPR)
        och säljer aldrig personuppgifter. Mer finns i vår{" "}
        <Link href="/integritet" className="underline hover:text-foreground">
          integritetspolicy
        </Link>
        .
      </>
    ),
  },
];

export default function Faq() {
  return (
    <section className="px-4 py-16 lg:py-20 bg-surface">
      <h2 className="text-center text-base font-bold tracking-[0.1em] uppercase text-accent mb-8">
        Vanliga frågor
      </h2>

      <div className="mx-auto grid max-w-4xl grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 items-start">
        {faqs.map(({ question, answer }) => (
          <details
            key={question}
            className="group rounded-md bg-surface-card shadow-md open:shadow-lg"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium hover:bg-surface-hover rounded-md [&::-webkit-details-marker]:hidden">
              {question}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
