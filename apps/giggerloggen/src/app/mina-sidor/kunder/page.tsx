import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function KunderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!company) redirect("/mina-sidor/foretag");

  const customers = await prisma.customer.findMany({
    where: { companyId: company.id },
    orderBy: { namn: "asc" },
    include: { _count: { select: { uppdrag: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kunder</h1>
          <p className="text-sm text-muted-foreground">{customers.length} kunder registrerade</p>
        </div>
        <Link href="/mina-sidor/kunder/ny" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="h-4 w-4" /> Ny kund
        </Link>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Inga kunder ännu.</p>
            <Link href="/mina-sidor/kunder/ny" className={buttonVariants()}>
              Lägg till din första kund
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {customers.map((c: typeof customers[number]) => (
            <Card key={c.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {c.kundTyp === "foretag" ? (
                      <Building2 className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {c.kundTyp === "foretag" ? c.foretagsnamn || c.namn : c.namn}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.epost || c.telefon || (c.kundTyp === "foretag" ? "Företagskund" : "Privatperson")}
                      {" · "}
                      {c._count.uppdrag} uppdrag
                    </p>
                  </div>
                </div>
                <Link
                  href={`/mina-sidor/kunder/${c.id}/redigera`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Redigera
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
