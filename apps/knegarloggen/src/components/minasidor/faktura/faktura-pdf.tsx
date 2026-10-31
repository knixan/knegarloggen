import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { FakturaData } from "./faktura-data";

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

// Ritar fakturaData() – samma innehåll som förhandsvisningen (skriv-ut-klient).
export function FakturaPdf({ data }: { data: FakturaData }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* ── Header ── */}
        <View style={S.header}>
          <View>
            {data.foretag.logoUrl && (
              <Image src={data.foretag.logoUrl} style={S.logo} />
            )}
            <Text style={S.companyName}>{data.foretag.namn}</Text>
            <View style={S.companyDetails}>
              {data.foretag.rader.map((rad) => (
                <Text key={rad}>{rad}</Text>
              ))}
            </View>
          </View>

          <View style={S.fakturaRight}>
            <Text style={S.fakturaTitle}>FAKTURA</Text>
            <View style={{ marginTop: 8 }}>
              {data.infoRader.map(({ label, value, fet }) => (
                <View style={S.fakturaRow} key={label}>
                  <Text style={S.fakturaLabel}>{label}</Text>
                  <Text style={[S.fakturaValue, fet ? S.fakturaValueBold : {}]}>
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
          <Text style={S.kundBold}>{data.kund.namn}</Text>
          {data.kund.rader.map((rad) => (
            <Text style={S.kundText} key={rad}>
              {rad}
            </Text>
          ))}
          {data.kund.extra.map((rad) => (
            <Text style={S.kundSub} key={rad}>
              {rad}
            </Text>
          ))}
        </View>

        {/* ── Fakturarader ── */}
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

          {data.rader.map((rad, i) => (
            <View style={S.row} key={i}>
              <View style={{ flex: 1 }}>
                <Text style={S.tdDesc}>{rad.beskrivning}</Text>
                {rad.under ? (
                  <Text style={S.tdDescSub}>{rad.under}</Text>
                ) : null}
              </View>
              <Text style={[S.tdRight, { width: 44 }]}>{rad.antal}</Text>
              <Text style={[S.tdRight, { width: 62 }]}>{rad.aPris}</Text>
              <Text style={[S.tdRight, S.tdBold, { width: 68 }]}>
                {rad.belopp}
              </Text>
            </View>
          ))}

          {data.utfortArbete && (
            <View style={S.noteRow}>
              <Text style={S.noteText}>
                <Text style={S.noteBold}>Utfört arbete: </Text>
                {data.utfortArbete}
              </Text>
            </View>
          )}
        </View>

        {/* ── Summering ── */}
        <View style={S.summWrap}>
          <View style={S.summBox}>
            {data.summering.map((rad) => (
              <View style={S.summRow} key={rad.label}>
                <Text style={[S.summLabel, rad.ton ? S.summMuted : {}]}>
                  {rad.label}
                </Text>
                <Text
                  style={[
                    S.summValue,
                    rad.ton === "dämpad" ? S.summMuted : {},
                    rad.ton === "rot" ? S.summRot : {},
                  ]}
                >
                  {rad.value}
                </Text>
              </View>
            ))}
            <View style={[S.summRow, S.summDivider]}>
              <Text style={S.summTotalLabel}>Att betala</Text>
              <Text style={S.summTotalValue}>{data.attBetala}</Text>
            </View>
          </View>
        </View>

        {/* ── Betalningsuppgifter ── */}
        {data.betalning.length > 0 && (
          <View style={S.payGrid}>
            <View style={S.payBlock}>
              <Text style={S.payLabel}>Betalningsuppgifter</Text>
              {data.betalning.map((rad) => (
                <Text style={S.payText} key={rad}>
                  {rad}
                </Text>
              ))}
            </View>
            <View style={S.payBlock}>
              <Text style={S.payLabel}>Meddelande / OCR</Text>
              <Text style={S.payText}>{data.ocr}</Text>
            </View>
          </View>
        )}

        {/* ── Footer ── */}
        {data.fakturatext ? (
          <Text style={S.fakturatext}>{data.fakturatext}</Text>
        ) : null}
        {data.fotnoter.map((rad) => (
          <Text style={S.fskatt} key={rad}>
            {rad}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
