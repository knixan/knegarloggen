// Gemensam layout för integritetspolicy, villkor och kontakt.
import { brand, ORT } from "../../brand";

/** Datum som visas på juridiksidorna. Uppdatera när texterna ändras. */
export const JURIDIK_UPPDATERAD = "2026-11-17";

export function JuridikSida({
  titel,
  ingress,
  children,
}: {
  titel: string;
  ingress?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-foreground">{titel}</h1>
      <p className="text-muted-foreground mb-2 italic">
        Senast uppdaterad: {JURIDIK_UPPDATERAD}
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Det här är en preliminär version inför lansering. Texten kan komma att
        uppdateras – väsentliga ändringar meddelas i förväg.
      </p>
      {ingress && <div className="mb-8 leading-relaxed">{ingress}</div>}
      <div className="space-y-8 text-foreground leading-relaxed">
        {children}
      </div>
    </main>
  );
}

export function Avsnitt({
  rubrik,
  children,
}: {
  rubrik: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold border-b pb-1">{rubrik}</h2>
      {children}
    </section>
  );
}

export function Lista({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-1">{children}</ul>;
}

export function EpostLank() {
  return (
    <a
      href={`mailto:${brand.kontaktEpost}`}
      className="font-medium underline underline-offset-2 hover:text-primary"
    >
      {brand.kontaktEpost}
    </a>
  );
}

export function KontaktRuta({ rubrik }: { rubrik: string }) {
  return (
    <section className="bg-muted p-6 rounded-lg space-y-1">
      <h2 className="text-xl font-bold mb-3">{rubrik}</h2>
      <p>{brand.namn}</p>
      <p>{ORT}</p>
      <p>
        E-post: <EpostLank />
      </p>
    </section>
  );
}
