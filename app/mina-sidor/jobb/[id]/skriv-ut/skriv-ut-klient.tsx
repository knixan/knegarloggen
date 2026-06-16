"use client";

import { useEffect } from "react";
import type { Job } from "@/lib/job-schema";

type Company = {
  name: string;
  orgNummer: string;
  adress: string;
  postnummer: string;
  ort: string;
  telefon: string;
  epost: string;
  fSkatt: boolean;
  momsNummer: string;
  bankgiro: string;
  plusgiro: string;
  swish: string;
  logoUrl: string;
  nastaFakturanummer: number;
  forfallodagar: number;
  drojsmalsranta: number;
  fakturatext: string;
};

type Summary = {
  artiklarSum: number;
  ovrigaSum: number;
  arbetstidSum: number;
  resorSum: number;
  totalExklMoms: number;
  totalTimmar: number;
  totalStracka: number;
  antalResor: number;
  timpris: number;
  milersattning: number;
};

interface Props {
  job: Job;
  company: Company;
  summary: Summary;
}

export default function SkrivUtKlient({ job, company, summary }: Props) {
  const today = new Date().toLocaleDateString("sv-SE");
  const forfalloDate = new Date();
  forfalloDate.setDate(forfalloDate.getDate() + (company.forfallodagar || 30));
  const forfalloStr = forfalloDate.toLocaleDateString("sv-SE");

  const exklMoms = job.fastPris !== undefined && job.fastPris !== null ? job.fastPris : summary.totalExklMoms;
  const moms = exklMoms * 0.25;
  const totalInklMoms = exklMoms + moms;

  const kund = job.customer;
  const kundNamn = kund
    ? kund.typ === "foretag" && kund.foretagsnamn
      ? kund.foretagsnamn
      : kund.namn
    : "Okänd kund";
  const kundAdress = kund?.adress ?? "";
  const kundPostOrt = [kund?.postnummer, kund?.ort].filter(Boolean).join(" ");

  useEffect(() => {
    if (company.logoUrl) {
      const img = new window.Image();
      img.onload = () => window.print();
      img.onerror = () => window.print();
      img.src = company.logoUrl;
    } else {
      window.print();
    }
  }, [company.logoUrl]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a1a; background: white; }
        .sida { padding: 2cm; max-width: 21cm; margin: 0 auto; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 20px; }
        .logo-block { display: flex; align-items: center; gap: 12px; }
        .logo-block img { max-height: 60px; max-width: 160px; object-fit: contain; }
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
        .right { text-align: right; }
        .bold { font-weight: 600; }

        .summering { margin-left: auto; width: 280px; margin-bottom: 24px; }
        .summering table { width: 100%; border-collapse: collapse; }
        .summering td { padding: 4px 0; font-size: 9.5pt; }
        .summering td:last-child { text-align: right; }
        .summering .total-rad td { border-top: 1.5px solid #1a1a1a; font-weight: 700; font-size: 11pt; padding-top: 8px; }
        .summering .moms-rad td { color: #555; font-size: 9pt; }

        .betalning { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .betalning-block h4 { font-size: 8pt; text-transform: uppercase; color: #888; letter-spacing: 0.08em; margin-bottom: 6px; }
        .betalning-block p { font-size: 9.5pt; line-height: 1.6; }

        .fakturatext { font-size: 9pt; color: #555; border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 4px; white-space: pre-wrap; }
        .fskatt { font-size: 8.5pt; color: #555; margin-top: 8px; }

        @media print {
          body { margin: 0; }
          .sida { padding: 1.5cm; }
          @page { margin: 0; size: A4; }
          nav, footer { display: none !important; }
        }
      `}</style>

      <div className="sida">
        {/* Header */}
        <div className="header">
          <div className="logo-block">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="Logotyp" />
            ) : (
              <div className="company-name">{company.name}</div>
            )}
            {company.logoUrl && (
              <div>
                <div className="company-name">{company.name}</div>
                <div className="company-details">
                  {company.orgNummer && <span>Org.nr {company.orgNummer}<br /></span>}
                  {company.adress && <span>{company.adress}<br /></span>}
                  {(company.postnummer || company.ort) && (
                    <span>{company.postnummer} {company.ort}<br /></span>
                  )}
                  {company.telefon && <span>{company.telefon}<br /></span>}
                  {company.epost && <span>{company.epost}</span>}
                </div>
              </div>
            )}
            {!company.logoUrl && (
              <div className="company-details">
                {company.orgNummer && <span>Org.nr {company.orgNummer}<br /></span>}
                {company.adress && <span>{company.adress}<br /></span>}
                {(company.postnummer || company.ort) && (
                  <span>{company.postnummer} {company.ort}<br /></span>
                )}
                {company.telefon && <span>{company.telefon}<br /></span>}
                {company.epost && <span>{company.epost}</span>}
              </div>
            )}
          </div>

          <div className="faktura-info">
            <h1>FAKTURA</h1>
            <table>
              <tbody>
                <tr><td>Fakturanummer</td><td className="bold">{company.nastaFakturanummer}</td></tr>
                <tr><td>Fakturadatum</td><td>{today}</td></tr>
                <tr><td>Förfallodatum</td><td>{forfalloStr}</td></tr>
                <tr><td>Betalningsvillkor</td><td>{company.forfallodagar} dagar netto</td></tr>
                {company.drojsmalsranta > 0 && (
                  <tr><td>Dröjsmålsränta</td><td>{company.drojsmalsranta}%</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kund */}
        <div className="kund-block">
          <h3>Faktureras till</h3>
          <p>
            <strong>{kundNamn}</strong><br />
            {kund?.typ === "foretag" && kund.kontaktperson && (
              <>{kund.kontaktperson}<br /></>
            )}
            {kundAdress && <>{kundAdress}<br /></>}
            {kundPostOrt && <>{kundPostOrt}<br /></>}
            {kund?.epost && <>{kund.epost}<br /></>}
            {kund?.telefon && <>{kund.telefon}</>}
          </p>
          {kund?.personnummer && (
            <p style={{ marginTop: 4, fontSize: "9pt", color: "#555" }}>
              Personnummer: {kund.personnummer}
            </p>
          )}
          {job.rotAvdrag && kund?.fastighetsbeteckning && (
            <p style={{ marginTop: 4, fontSize: "9pt", color: "#555" }}>
              ROT-avdrag · Fastighet: {kund.fastighetsbeteckning}
              {kund.lagenhetsnummer ? ` · Lgh: ${kund.lagenhetsnummer}` : ""}
            </p>
          )}
        </div>

        {/* Fakturaraderna */}
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
            {job.artiklar.map((a, i) => (
              <tr key={i}>
                <td>
                  {a.namn}
                  {a.artikelnr && <span style={{ color: "#888", fontSize: "8.5pt" }}> · {a.artikelnr}</span>}
                  {a.aterforsaljare && <span style={{ color: "#888", fontSize: "8.5pt" }}> · {a.aterforsaljare}</span>}
                </td>
                <td className="right">{a.antal} st</td>
                <td className="right">{a.pris.toLocaleString("sv-SE")} kr</td>
                <td className="right bold">{(a.pris * a.antal).toLocaleString("sv-SE")} kr</td>
              </tr>
            ))}
            {(job.ovrigaKostnader ?? []).map((k, i) => (
              <tr key={`ok-${i}`}>
                <td>{k.beskrivning}</td>
                <td className="right">1 st</td>
                <td className="right">{k.pris.toLocaleString("sv-SE")} kr</td>
                <td className="right bold">{k.pris.toLocaleString("sv-SE")} kr</td>
              </tr>
            ))}
            {summary.totalTimmar > 0 && summary.timpris > 0 && (
              <tr>
                <td>Arbetstid</td>
                <td className="right">{summary.totalTimmar} h</td>
                <td className="right">{summary.timpris.toLocaleString("sv-SE")} kr/h</td>
                <td className="right bold">{summary.arbetstidSum.toLocaleString("sv-SE")} kr</td>
              </tr>
            )}
            {summary.totalStracka > 0 && summary.milersattning > 0 && (
              <tr>
                <td>Resor / milersättning</td>
                <td className="right">{summary.totalStracka} km</td>
                <td className="right">{summary.milersattning.toLocaleString("sv-SE")} kr/km</td>
                <td className="right bold">{summary.resorSum.toLocaleString("sv-SE")} kr</td>
              </tr>
            )}
            {job.utfortArbete && (
              <tr>
                <td colSpan={4} style={{ paddingTop: 12, paddingBottom: 4, color: "#555", fontSize: "9pt" }}>
                  <strong>Utfört arbete:</strong> {job.utfortArbete}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summering */}
        <div className="summering">
          <table>
            <tbody>
              <tr>
                <td>{job.fastPris !== undefined && job.fastPris !== null ? "Fast pris exkl. moms" : "Summa exkl. moms"}</td>
                <td>{exklMoms.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr</td>
              </tr>
              <tr className="moms-rad">
                <td>Moms 25%</td>
                <td>{moms.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr</td>
              </tr>
              {job.rotAvdrag && summary.arbetstidSum > 0 && (
                <tr className="moms-rad">
                  <td>ROT-avdrag 30% (av {summary.arbetstidSum.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr arbete exkl. moms)*</td>
                  <td style={{ color: "#dc2626" }}>
                    −{(summary.arbetstidSum * 0.3).toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr
                  </td>
                </tr>
              )}
              <tr className="total-rad">
                <td>Att betala</td>
                <td>
                  {(job.rotAvdrag && summary.arbetstidSum > 0
                    ? totalInklMoms - summary.arbetstidSum * 0.3
                    : totalInklMoms
                  ).toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Betalningsuppgifter */}
        <div className="betalning">
          <div className="betalning-block">
            <h4>Betalningsuppgifter</h4>
            <p>
              {company.bankgiro && <>Bankgiro: {company.bankgiro}<br /></>}
              {company.plusgiro && <>Plusgiro: {company.plusgiro}<br /></>}
              {company.swish && <>Swish: {company.swish}</>}
            </p>
          </div>
          <div className="betalning-block">
            <h4>Meddelande / OCR</h4>
            <p>{company.nastaFakturanummer}</p>
          </div>
        </div>

        {/* Fakturatext och F-skatt */}
        {company.fakturatext && (
          <p className="fakturatext">{company.fakturatext}</p>
        )}
        {company.fSkatt && (
          <p className="fskatt">✓ Godkänd för F-skatt · Momsreg.nr: {company.momsNummer || `SE${company.orgNummer?.replace("-", "")}01`}</p>
        )}
        {job.rotAvdrag && (
          <p className="fskatt" style={{ marginTop: 4 }}>
            * ROT-avdrag: Avser 30% av arbetskostnad exkl. moms. Hantverkaren ansöker om utbetalning hos Skatteverket.
          </p>
        )}
      </div>
    </>
  );
}
