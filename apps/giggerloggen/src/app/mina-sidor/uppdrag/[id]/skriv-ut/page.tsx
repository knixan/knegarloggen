import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { beraknaTotal } from "@/lib/uppdrag-schema";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function SkrivUtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
  if (!company) redirect("/mina-sidor/foretag");

  const uppdrag = await prisma.uppdrag.findFirst({
    where: { id, companyId: company.id },
    include: {
      customer: true,
      arbetspass: { orderBy: { datum: "asc" } },
      resor: { orderBy: { datum: "asc" } },
      ovrigaKostnader: true,
    },
  });

  if (!uppdrag) notFound();

  const totals = beraknaTotal(uppdrag);
  const today = formatDate(new Date());

  return (
    <div className="max-w-2xl mx-auto p-8 print:p-0 font-sans text-sm">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          {company.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logoUrl} alt="Logga" className="max-h-16 max-w-32 object-contain mb-2" />
          )}
          <p className="font-bold text-lg">{company.namn || session.user.name}</p>
          {company.orgNummer && <p className="text-xs text-gray-500">Org.nr: {company.orgNummer}</p>}
          {company.adress && <p className="text-xs">{company.adress}, {company.postnummer} {company.stad}</p>}
          {company.telefon && <p className="text-xs">{company.telefon}</p>}
          {company.epost && <p className="text-xs">{company.epost}</p>}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">FAKTURA</p>
          {uppdrag.fakturaNummer && (
            <p className="text-sm">Nr: {uppdrag.fakturaNummer}</p>
          )}
          <p className="text-xs text-gray-500">Datum: {today}</p>
        </div>
      </div>

      {/* Customer */}
      {uppdrag.customer && (
        <div className="mb-8">
          <p className="font-semibold">Faktureras till:</p>
          <p>{uppdrag.customer.foretagsnamn || uppdrag.customer.namn}</p>
          {uppdrag.customer.orgNummer && <p className="text-xs">Org.nr: {uppdrag.customer.orgNummer}</p>}
          {uppdrag.customer.adress && <p className="text-xs">{uppdrag.customer.adress}</p>}
          {uppdrag.customer.postnummer && (
            <p className="text-xs">{uppdrag.customer.postnummer} {uppdrag.customer.stad}</p>
          )}
        </div>
      )}

      {/* Uppdrag */}
      <div className="mb-6">
        <p className="font-semibold text-base">{uppdrag.titel}</p>
        {uppdrag.beskrivning && <p className="text-gray-600 text-xs">{uppdrag.beskrivning}</p>}
      </div>

      {/* Arbetspass */}
      {uppdrag.prisTyp === "timme" && uppdrag.arbetspass.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-1">Arbetstid ({uppdrag.timpris} kr/h)</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Datum</th>
                <th className="text-left py-1">Beskrivning</th>
                <th className="text-right py-1">Timmar</th>
                <th className="text-right py-1">Summa</th>
              </tr>
            </thead>
            <tbody>
              {uppdrag.arbetspass.map((a: { id: string; datum: Date; beskrivning: string | null; timmar: number }) => (
                <tr key={a.id} className="border-b border-gray-100">
                  <td className="py-1">{formatDate(new Date(a.datum))}</td>
                  <td className="py-1">{a.beskrivning || "—"}</td>
                  <td className="text-right py-1">{a.timmar}</td>
                  <td className="text-right py-1">{formatCurrency(a.timmar * uppdrag.timpris)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resor */}
      {uppdrag.resor.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-1">Resor ({uppdrag.milersattning} kr/km)</p>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {uppdrag.resor.map((r: { id: string; datum: Date; beskrivning: string | null; stracka: number }) => (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="py-1">{formatDate(new Date(r.datum))}</td>
                  <td className="py-1">{r.beskrivning || "—"}</td>
                  <td className="text-right py-1">{r.stracka} km</td>
                  <td className="text-right py-1">{formatCurrency(r.stracka * uppdrag.milersattning)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Övriga kostnader */}
      {uppdrag.ovrigaKostnader.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-1">Övriga kostnader</p>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {uppdrag.ovrigaKostnader.map((k: { id: string; beskrivning: string; pris: number }) => (
                <tr key={k.id} className="border-b border-gray-100">
                  <td className="py-1">{k.beskrivning}</td>
                  <td className="text-right py-1">{formatCurrency(k.pris)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totals */}
      <div className="border-t pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Totalt exkl. moms</span>
          <span className="font-semibold">{formatCurrency(totals.totalExklMoms)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Moms 25%</span>
          <span>{formatCurrency(totals.moms)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-1">
          <span>Totalt att betala</span>
          <span>{formatCurrency(totals.totalInklMoms)}</span>
        </div>
      </div>

      {/* Payment */}
      {(company.bankgiro || company.plusgiro || company.swish) && (
        <div className="mt-6 text-xs text-gray-600">
          <p className="font-semibold mb-1">Betalningssätt</p>
          {company.bankgiro && <p>Bankgiro: {company.bankgiro}</p>}
          {company.plusgiro && <p>Plusgiro: {company.plusgiro}</p>}
          {company.swish && <p>Swish: {company.swish}</p>}
          {company.betalningsvillkor && (
            <p className="mt-1">Betalningsvillkor: {company.betalningsvillkor} dagar</p>
          )}
        </div>
      )}

      {company.fakturaText && (
        <p className="mt-4 text-xs text-gray-500">{company.fakturaText}</p>
      )}

      <div className="mt-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium"
        >
          Skriv ut / Spara som PDF
        </button>
      </div>
    </div>
  );
}
