import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Job, CompanyInput } from "@/lib/job-schema";
import { beräknaSummering } from "@/lib/job-schema";

export type PdfCompany = CompanyInput & { logoUrl?: string };

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    padding: 57,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 12,
    marginBottom: 18,
  },
  logo: { maxHeight: 50, maxWidth: 130, objectFit: "contain", marginBottom: 6 },
  companyName: { fontFamily: "Helvetica-Bold", fontSize: 15 },
  companyDetails: { fontSize: 8, color: "#555", marginTop: 3, lineHeight: 1.5 },

  fakturaRight: { alignItems: "flex-end" },
  fakturaTitle: { fontFamily: "Helvetica-Bold", fontSize: 20 },
  fakturaRow: { flexDirection: "row", marginTop: 2 },
  fakturaLabel: { fontSize: 8, color: "#777", width: 90 },
  fakturaValue: { fontSize: 8, width: 70, textAlign: "right" },
  fakturaValueBold: { fontFamily: "Helvetica-Bold" },

  kundLabel: {
    fontSize: 7,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  kundBold: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  kundText: { fontSize: 10, lineHeight: 1.5 },
  kundSub: { fontSize: 8, color: "#555", marginTop: 3 },

  tableWrap: { marginBottom: 16 },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 4,
  },
  th: { fontSize: 7, color: "#888", textTransform: "uppercase" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 5,
    alignItems: "flex-start",
  },
  tdDesc: { flex: 1, fontSize: 9 },
  tdDescSub: { fontSize: 8, color: "#888" },
  tdRight: { fontSize: 9, textAlign: "right" },
  tdBold: { fontFamily: "Helvetica-Bold" },
  noteRow: { paddingTop: 8, paddingBottom: 4 },
  noteText: { fontSize: 8, color: "#555" },
  noteBold: { fontFamily: "Helvetica-Bold" },

  summWrap: { alignItems: "flex-end", marginBottom: 18 },
  summBox: { width: 230 },
  summRow: { flexDirection: "row", paddingVertical: 3 },
  summLabel: { flex: 1, fontSize: 9 },
  summValue: { fontSize: 9, textAlign: "right" },
  summMuted: { fontSize: 8, color: "#555" },
  summRot: { fontSize: 8, color: "#dc2626" },
  summDivider: {
    borderTopWidth: 1.5,
    borderTopColor: "#1a1a1a",
    marginTop: 4,
    paddingTop: 6,
  },
  summTotalLabel: { fontFamily: "Helvetica-Bold", fontSize: 11, flex: 1 },
  summTotalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textAlign: "right",
  },

  payGrid: { flexDirection: "row", gap: 20, marginBottom: 16 },
  payBlock: { flex: 1 },
  payLabel: {
    fontSize: 7,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  payText: { fontSize: 9, lineHeight: 1.6 },

  fakturatext: {
    fontSize: 8,
    color: "#555",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    marginTop: 8,
  },
  fskatt: { fontSize: 8, color: "#555", marginTop: 6 },
});

function kr(n: number) {
  return (
    n.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " kr"
  );
}

export function FakturaPdf({
  job,
  company,
  fakturanummer,
}: {
  job: Job;
  company: PdfCompany;
  fakturanummer: number;
}) {
  const summary = beräknaSummering(job);
  const today = new Date().toLocaleDateString("sv-SE");
  const forfalloDate = new Date();
  forfalloDate.setDate(forfalloDate.getDate() + (company.forfallodagar ?? 30));
  const forfalloStr = forfalloDate.toLocaleDateString("sv-SE");

  const exklMoms = job.fastPris != null ? job.fastPris : summary.totalExklMoms;
  const moms = exklMoms * 0.25;
  const totalInklMoms = exklMoms + moms;
  const rotAvdrag =
    job.rotAvdrag && summary.arbetstidSum > 0
      ? summary.arbetstidSum * 1.25 * 0.3
      : 0;
  const attBetala = totalInklMoms - rotAvdrag;

  const kund = job.customer;
  const kundNamn = kund
    ? kund.typ === "foretag" && kund.foretagsnamn
      ? kund.foretagsnamn
      : kund.namn
    : "Okänd kund";

  const fakturaRader: [string, string, boolean?][] = [
    ["Fakturanummer", String(fakturanummer), true],
    ["Fakturadatum", today],
    ["Förfallodatum", forfalloStr],
    [`Betalningsvillkor`, `${company.forfallodagar ?? 30} dagar netto`],
    ...(company.drojsmalsranta > 0
      ? [[`Dröjsmålsränta`, `${company.drojsmalsranta}%`] as [string, string]]
      : []),
  ];

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* ── Header ── */}
        <View style={S.header}>
          <View>
            {company.logoUrl && <Image src={company.logoUrl} style={S.logo} />}
            <Text style={S.companyName}>{company.name}</Text>
            <View style={S.companyDetails}>
              {company.orgNummer ? (
                <Text>Org.nr {company.orgNummer}</Text>
              ) : null}
              {company.adress ? <Text>{company.adress}</Text> : null}
              {company.postnummer || company.ort ? (
                <Text>
                  {company.postnummer} {company.ort}
                </Text>
              ) : null}
              {company.telefon ? <Text>{company.telefon}</Text> : null}
              {company.epost ? <Text>{company.epost}</Text> : null}
            </View>
          </View>

          <View style={S.fakturaRight}>
            <Text style={S.fakturaTitle}>FAKTURA</Text>
            <View style={{ marginTop: 8 }}>
              {fakturaRader.map(([label, value, bold]) => (
                <View style={S.fakturaRow} key={label}>
                  <Text style={S.fakturaLabel}>{label}</Text>
                  <Text
                    style={[S.fakturaValue, bold ? S.fakturaValueBold : {}]}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Kund ── */}
        <View style={{ marginBottom: 18 }}>
          <Text style={S.kundLabel}>Faktureras till</Text>
          <Text style={S.kundBold}>{kundNamn}</Text>
          {kund?.typ === "foretag" && kund.kontaktperson ? (
            <Text style={S.kundText}>{kund.kontaktperson}</Text>
          ) : null}
          {kund?.adress ? <Text style={S.kundText}>{kund.adress}</Text> : null}
          {kund?.postnummer || kund?.ort ? (
            <Text style={S.kundText}>
              {kund.postnummer} {kund.ort}
            </Text>
          ) : null}
          {kund?.epost ? <Text style={S.kundText}>{kund.epost}</Text> : null}
          {kund?.telefon ? (
            <Text style={S.kundText}>{kund.telefon}</Text>
          ) : null}
          {kund?.personnummer ? (
            <Text style={S.kundSub}>Personnummer: {kund.personnummer}</Text>
          ) : null}
          {job.rotAvdrag && kund?.fastighetsbeteckning ? (
            <Text style={S.kundSub}>
              ROT-avdrag · Fastighet: {kund.fastighetsbeteckning}
              {kund.lagenhetsnummer ? ` · Lgh: ${kund.lagenhetsnummer}` : ""}
            </Text>
          ) : null}
        </View>

        {/* ── Artikelrader ── */}
        <View style={S.tableWrap}>
          <View style={S.tableHead}>
            <Text style={[S.th, { flex: 1 }]}>Beskrivning</Text>
            <Text style={[S.th, { width: 44, textAlign: "right" }]}>Antal</Text>
            <Text style={[S.th, { width: 62, textAlign: "right" }]}>
              À-pris
            </Text>
            <Text style={[S.th, { width: 68, textAlign: "right" }]}>
              Belopp
            </Text>
          </View>

          {job.artiklar.map((a, i) => (
            <View style={S.row} key={i}>
              <View style={{ flex: 1 }}>
                <Text style={S.tdDesc}>{a.namn}</Text>
                {a.artikelnr || a.aterforsaljare ? (
                  <Text style={S.tdDescSub}>
                    {[a.artikelnr, a.aterforsaljare]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                ) : null}
              </View>
              <Text style={[S.tdRight, { width: 44 }]}>{a.antal} st</Text>
              <Text style={[S.tdRight, { width: 62 }]}>{kr(a.pris)}</Text>
              <Text style={[S.tdRight, S.tdBold, { width: 68 }]}>
                {kr(a.pris * a.antal)}
              </Text>
            </View>
          ))}

          {(job.ovrigaKostnader ?? []).map((k, i) => (
            <View style={S.row} key={`ok-${i}`}>
              <Text style={[S.tdDesc, { flex: 1 }]}>{k.beskrivning}</Text>
              <Text style={[S.tdRight, { width: 44 }]}>1 st</Text>
              <Text style={[S.tdRight, { width: 62 }]}>{kr(k.pris)}</Text>
              <Text style={[S.tdRight, S.tdBold, { width: 68 }]}>
                {kr(k.pris)}
              </Text>
            </View>
          ))}

          {summary.totalTimmar > 0 && summary.timpris > 0 && (
            <View style={S.row}>
              <Text style={[S.tdDesc, { flex: 1 }]}>Arbetstid</Text>
              <Text style={[S.tdRight, { width: 44 }]}>
                {summary.totalTimmar} h
              </Text>
              <Text style={[S.tdRight, { width: 62 }]}>
                {kr(summary.timpris)}/h
              </Text>
              <Text style={[S.tdRight, S.tdBold, { width: 68 }]}>
                {kr(summary.arbetstidSum)}
              </Text>
            </View>
          )}

          {summary.totalStracka > 0 && summary.milersattning > 0 && (
            <View style={S.row}>
              <Text style={[S.tdDesc, { flex: 1 }]}>Resor / milersättning</Text>
              <Text style={[S.tdRight, { width: 44 }]}>
                {summary.totalStracka} km
              </Text>
              <Text style={[S.tdRight, { width: 62 }]}>
                {kr(summary.milersattning)}/km
              </Text>
              <Text style={[S.tdRight, S.tdBold, { width: 68 }]}>
                {kr(summary.resorSum)}
              </Text>
            </View>
          )}

          {job.utfortArbete && (
            <View style={S.noteRow}>
              <Text style={S.noteText}>
                <Text style={S.noteBold}>Utfört arbete: </Text>
                {job.utfortArbete}
              </Text>
            </View>
          )}
        </View>

        {/* ── Summering ── */}
        <View style={S.summWrap}>
          <View style={S.summBox}>
            <View style={S.summRow}>
              <Text style={S.summLabel}>
                {job.fastPris != null
                  ? "Fast pris exkl. moms"
                  : "Summa exkl. moms"}
              </Text>
              <Text style={S.summValue}>{kr(exklMoms)}</Text>
            </View>
            <View style={S.summRow}>
              <Text style={[S.summLabel, S.summMuted]}>Moms 25%</Text>
              <Text style={[S.summValue, S.summMuted]}>{kr(moms)}</Text>
            </View>
            {rotAvdrag > 0 && (
              <View style={S.summRow}>
                <Text style={[S.summLabel, S.summMuted]}>
                  ROT-avdrag 30% (av {kr(summary.arbetstidSum * 1.25)} inkl.
                  moms)*
                </Text>
                <Text style={[S.summValue, S.summRot]}>−{kr(rotAvdrag)}</Text>
              </View>
            )}
            <View style={[S.summRow, S.summDivider]}>
              <Text style={S.summTotalLabel}>Att betala</Text>
              <Text style={S.summTotalValue}>{kr(attBetala)}</Text>
            </View>
          </View>
        </View>

        {/* ── Betalningsuppgifter ── */}
        {(company.bankgiro || company.plusgiro || company.swish) && (
          <View style={S.payGrid}>
            <View style={S.payBlock}>
              <Text style={S.payLabel}>Betalningsuppgifter</Text>
              {company.bankgiro ? (
                <Text style={S.payText}>Bankgiro: {company.bankgiro}</Text>
              ) : null}
              {company.plusgiro ? (
                <Text style={S.payText}>Plusgiro: {company.plusgiro}</Text>
              ) : null}
              {company.swish ? (
                <Text style={S.payText}>Swish: {company.swish}</Text>
              ) : null}
            </View>
            <View style={S.payBlock}>
              <Text style={S.payLabel}>Meddelande / OCR</Text>
              <Text style={S.payText}>{fakturanummer}</Text>
            </View>
          </View>
        )}

        {/* ── Footer ── */}
        {company.fakturatext ? (
          <Text style={S.fakturatext}>{company.fakturatext}</Text>
        ) : null}
        {company.fSkatt && (
          <Text style={S.fskatt}>
            {"✓"} Godkänd för F-skatt · Momsreg.nr:{" "}
            {company.momsNummer ||
              `SE${(company.orgNummer ?? "").replace("-", "")}01`}
          </Text>
        )}
        {job.rotAvdrag && (
          <Text style={S.fskatt}>
            * ROT-avdrag: Avser 30% av arbetskostnad inkl. moms. Hantverkaren
            ansöker om utbetalning hos Skatteverket.
          </Text>
        )}
      </Page>
    </Document>
  );
}
