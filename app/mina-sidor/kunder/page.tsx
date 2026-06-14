import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCustomers } from "@/lib/job-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, User, Building2, Phone, Mail } from "lucide-react";
import CustomerDeleteButton from "./customer-delete-button";

export default async function KundregisterPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const customers = await getCustomers();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kundregister</h1>
          <p className="text-sm text-muted-foreground">{customers.length} kunder</p>
        </div>
        <Link href="/mina-sidor/kunder/ny">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ny kund
          </Button>
        </Link>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Inga kunder ännu.{" "}
            <Link href="/mina-sidor/kunder/ny" className="underline hover:text-foreground">
              Lägg till din första kund
            </Link>
            .
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between gap-4 pt-5 pb-5">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {c.typ === "foretag" ? (
                      <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="font-semibold truncate">
                      {c.typ === "foretag" && c.foretagsnamn ? c.foretagsnamn : c.namn}
                    </span>
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                      c.typ === "foretag"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {c.typ === "foretag" ? "Företag" : "Privat"}
                    </span>
                  </div>
                  {c.typ === "foretag" && c.kontaktperson && (
                    <p className="text-sm text-muted-foreground">{c.kontaktperson}</p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    {c.telefon && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />{c.telefon}
                      </span>
                    )}
                    {c.epost && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />{c.epost}
                      </span>
                    )}
                    {c.ort && <span>{c.postnummer} {c.ort}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/mina-sidor/kunder/${c.id}/redigera`}>
                    <Button variant="outline" size="icon" aria-label="Redigera">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <CustomerDeleteButton id={c.id} namn={c.typ === "foretag" && c.foretagsnamn ? c.foretagsnamn : c.namn} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
