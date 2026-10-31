"use client";

import dynamic from "next/dynamic";
import type { Job } from "../../../lib/job-schema";
import { fakturaData, type FakturaCompany } from "./faktura-data";
import { Button } from "@knegarloggen/ui/button";
import { Printer } from "lucide-react";

const PdfKnapp = dynamic(() => import("./pdf-knapp").then((m) => m.PdfKnapp), {
  ssr: false,
  loading: () => (
    <Button variant="outline" size="sm" disabled>
      Laddar...
    </Button>
  ),
});

interface Props {
  job: Job;
  company: FakturaCompany;
  fakturanummer: number;
}

// Förhandsvisning/utskrift. Ritar samma fakturaData() som PDF:en
// (faktura-pdf.tsx) – ändra innehåll i faktura-data.ts, inte här.
export default function SkrivUtKlient({ job, company, fakturanummer }: Props) {
  const data = fakturaData(job, company, fakturanummer);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a1a; background: white; }
        .sida { padding: 2cm; max-width: 21cm; margin: 0 auto; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 20px; }
        .logo-block img { display: block; max-height: 60px; max-width: 160px; object-fit: contain; margin-bottom: 6px; }
        .company-name { font-size: 18pt; font-weight: 700; }
        .company-details { font-size: 8.5pt; color: #555; margin-top: 4px; line-height: 1.5; }
        .faktura-info { text-align: right; }
        .faktura-info h1 { font-size: 22pt; font-weight: 700; color: #1a1a1a; }
        .faktura-info table { margin-top: 6px; font-size: 9pt; }
        .faktura-info td { padding: 1px 0 1px 16px; }
        .faktura-info td:first-child { color: #777; padding-left: 0; }

        .kund-block { margin-bottom: 24px; }
        .kund-block h3 { font-size: 8pt; text-transform: uppercase; color: #999; letter-spacing: 0.08em; margin-bottom: 4px; }
        .kund-block p { font-size: 10pt; line-height: 1.5; }

        table.rader { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.rader th { text-align: left; font-size: 8pt; text-transform: uppercase; color: #888; padding: 5px 6px; border-bottom: 1.5px solid #1a1a1a; }
        table.rader td { padding: 6px 6px; border-bottom: 1px solid #eee; font-size: 9.5pt; vertical-align: top; }
        table.rader tr:last-child td { border-bottom: none; }
        .rad-under { display: block; color: #888; font-size: 8.5pt; }
        .right { text-align: right; }
        .bold { font-weight: 600; }

        .summering { margin-left: auto; width: 280px; margin-bottom: 24px; }
        .summering table { width: 100%; border-collapse: collapse; }
        .summering td { padding: 4px 0; font-size: 9.5pt; }
        .summering td:last-child { text-align: right; }
        .summering .total-rad td { border-top: 1.5px solid #1a1a1a; font-weight: 700; font-size: 11pt; padding-top: 8px; }
        .summering .dampad td { color: #555; font-size: 9pt; }
        .summering .rot td { color: #555; font-size: 9pt; }
        .summering .rot td:last-child { color: #dc2626; }

        .betalning { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .betalning-block h4 { font-size: 8pt; text-transform: uppercase; color: #888; letter-spacing: 0.08em; margin-bottom: 6px; }
        .betalning-block p { font-size: 9.5pt; line-height: 1.6; }

        .fakturatext { font-size: 9pt; color: #555; border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 4px; white-space: pre-wrap; }
        .fskatt { font-size: 8.5pt; color: #555; margin-top: 8px; }

        @media print {
          body { margin: 0; }
          .sida { padding: 1.5cm; }
          @page { margin: 0; size: A4; }
          nav, footer, .no-print { display: none !important; }
        }
      `}</style>

      <div
        className="no-print"
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" />
          Skriv ut
        </Button>
        <PdfKnapp data={data} />
      </div>

      <div className="sida">
        {/* Header */}
        <div className="header">
          <div className="logo-block">
            {data.foretag.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.foretag.logoUrl} alt="Logotyp" />
            )}
            <div className="company-name">{data.foretag.namn}</div>
            <div className="company-details">
              {data.foretag.rader.map((rad) => (
                <div key={rad}>{rad}</div>
              ))}
            </div>
          </div>

          <div className="faktura-info">
            <h1>FAKTURA</h1>
            <table>
              <tbody>
                {data.infoRader.map(({ label, value, fet }) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td className={fet ? "bold" : undefined}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kund */}
        <div className="kund-block">
          <h3>Faktureras till</h3>
          <p>
            <strong>{data.kund.namn}</strong>
          </p>
          {data.kund.rader.map((rad) => (
            <p key={rad}>{rad}</p>
          ))}
          {data.kund.extra.map((rad) => (
            <p
              key={rad}
              style={{ marginTop: 4, fontSize: "9pt", color: "#555" }}
            >
              {rad}
            </p>
          ))}
        </div>

        {/* Fakturarader */}
        <table className="rader">
          <thead>
            <tr>
              <th>Beskrivning</th>
              <th className="right">Antal</th>
              <th className="right">À-pris</th>
              <th className="right">Belopp</th>
            </tr>
          </thead>
          <tbody>
            {data.rader.map((rad, i) => (
              <tr key={i}>
                <td>
                  {rad.beskrivning}
                  {rad.under && <span className="rad-under">{rad.under}</span>}
                </td>
                <td className="right">{rad.antal}</td>
                <td className="right">{rad.aPris}</td>
                <td className="right bold">{rad.belopp}</td>
              </tr>
            ))}
            {data.utfortArbete && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    paddingTop: 12,
                    paddingBottom: 4,
                    color: "#555",
                    fontSize: "9pt",
                  }}
                >
                  <strong>Utfört arbete:</strong> {data.utfortArbete}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summering */}
        <div className="summering">
          <table>
            <tbody>
              {data.summering.map((rad) => (
                <tr
                  key={rad.label}
                  className={
                    rad.ton === "avdrag" ? "rot" : rad.ton ? "dampad" : undefined
                  }
                >
                  <td>{rad.label}</td>
                  <td>{rad.value}</td>
                </tr>
              ))}
              <tr className="total-rad">
                <td>Att betala</td>
                <td>{data.attBetala}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Betalningsuppgifter */}
        {data.betalning.length > 0 && (
          <div className="betalning">
            <div className="betalning-block">
              <h4>Betalningsuppgifter</h4>
              {data.betalning.map((rad) => (
                <p key={rad}>{rad}</p>
              ))}
            </div>
            <div className="betalning-block">
              <h4>Meddelande / OCR</h4>
              <p>{data.ocr}</p>
            </div>
          </div>
        )}

        {/* Fakturatext och fotnoter */}
        {data.fakturatext && <p className="fakturatext">{data.fakturatext}</p>}
        {data.fotnoter.map((rad) => (
          <p className="fskatt" key={rad}>
            {rad}
          </p>
        ))}
      </div>
    </>
  );
}
