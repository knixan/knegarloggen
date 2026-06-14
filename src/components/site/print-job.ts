// component som genererar en HTML-sträng och öppnar utskriftsfönstret för ett jobb, med all relevant information formaterad på ett snyggt sätt
import { type Job } from "@/lib/job-schema";

/**
 * Genererar en HTML-sträng och öppnar utskriftsfönstret för ett jobb.
 */
export function printJob(
  job: Job,
  summary: {
    artiklarSum: number;
    totalTimmar: number;
    totalStracka: number;
    antalResor: number;
  },
) {
  const status = job.utfort
    ? "Utfört"
    : job.pagaende
      ? "Pågående"
      : "Ej påbörjat";
  const statusFärg = job.utfort
    ? "#dc2626"
    : job.pagaende
      ? "#2563eb"
      : "#6b7280";

  const customerName =
    job.customer?.foretagsnamn?.trim() || job.customer?.namn?.trim() || "Jobb";

  const customerAddress = [
    job.customer?.adress,
    job.customer?.postnummer,
    job.customer?.ort,
  ]
    .filter(Boolean)
    .join(", ");

  const customerPhone = job.customer?.telefon?.trim() || "";
  const customerEmail = job.customer?.epost?.trim() || "";

  const badges = [
    `<span class="badge" style="background:${statusFärg};color:white">${status}</span>`,
    job.rotAvdrag ? `<span class="badge">ROT-avdrag</span>` : "",
    job.fakturerat
      ? `<span class="badge" style="background:#ea580c;color:white">Fakturerat</span>`
      : "",
    job.betalt
      ? `<span class="badge" style="background:#16a34a;color:white">Betalt</span>`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const artiklarHtml =
    job.artiklar.length > 0
      ? `
    <table>
      <thead>
        <tr>
          <th>Artikel</th>
          <th>Återförsäljare</th>
          <th>Art.nr</th>
          <th class="right">Antal</th>
          <th class="right">À-pris</th>
          <th class="right">Summa</th>
        </tr>
      </thead>
      <tbody>
        ${job.artiklar
          .map(
            (a) => `
          <tr>
            <td>${a.namn}</td>
            <td class="muted">${a.aterforsaljare ?? ""}</td>
            <td class="muted">${a.artikelnr ?? ""}</td>
            <td class="right">${a.antal} st</td>
            <td class="right">${a.pris.toLocaleString("sv-SE")} kr</td>
            <td class="right bold">${(a.pris * a.antal).toLocaleString("sv-SE")} kr</td>
          </tr>
        `,
          )
          .join("")}
        <tr class="total-row">
          <td colspan="5">Totalt material</td>
          <td class="right bold">${summary.artiklarSum.toLocaleString("sv-SE")} kr</td>
        </tr>
      </tbody>
    </table>
  `
      : "";

  const resorHtml =
    job.resor.length > 0
      ? `
    <table>
      <thead><tr><th>Datum</th><th class="right">Körd sträcka</th></tr></thead>
      <tbody>
        ${job.resor
          .map(
            (r) => `
          <tr>
            <td>${r.datum}</td>
            <td class="right">${r.stracka} km</td>
          </tr>
        `,
          )
          .join("")}
        <tr class="total-row">
          <td>Totalt</td>
          <td class="right bold">${summary.totalStracka} km</td>
        </tr>
      </tbody>
    </table>
  `
      : "";

  const arbetstidHtml =
    job.arbetstider.length > 0
      ? `
    <table>
      <thead><tr><th>Datum</th><th class="right">Timmar</th></tr></thead>
      <tbody>
        ${job.arbetstider
          .map(
            (a) => `
          <tr>
            <td>${a.datum}</td>
            <td class="right">${a.timmar} h</td>
          </tr>
        `,
          )
          .join("")}
        <tr class="total-row">
          <td>Totalt</td>
          <td class="right bold">${summary.totalTimmar} h</td>
        </tr>
      </tbody>
    </table>
  `
      : "";

  const fönster = window.open("", "_blank");
  if (!fönster) return;

  fönster.document.write(`<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <title>Knegarloggen – ${customerName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a1a; background: white; }
    .sida { padding: 1.5cm 2cm; max-width: 21cm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 16px; }
    .header-left h1 { font-size: 18pt; font-weight: 700; margin-bottom: 2px; }
    .header-left p { font-size: 9pt; color: #555; }
    .header-right { text-align: right; font-size: 9pt; color: #555; }
    .header-right strong { display: block; font-size: 10pt; color: #1a1a1a; }
    .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
    .badge { padding: 2px 10px; border-radius: 999px; font-size: 8pt; font-weight: 700; background: #e5e7eb; color: #1a1a1a; }
    .kontakt { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #f8f8f8; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-size: 9pt; }
    .kontakt-item label { display: block; font-size: 7.5pt; text-transform: uppercase; color: #888; margin-bottom: 2px; letter-spacing: 0.05em; }
    .oversikt { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
    .oversikt-cell { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; }
    .oversikt-cell label { display: block; font-size: 7.5pt; text-transform: uppercase; color: #888; margin-bottom: 3px; }
    .oversikt-cell span { font-size: 13pt; font-weight: 700; }
    section { margin-bottom: 14px; break-inside: avoid; page-break-inside: avoid; }
    section h4 { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.08em; color: #888; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
    th { text-align: left; font-size: 8pt; text-transform: uppercase; color: #888; padding: 4px 6px; border-bottom: 1px solid #ddd; }
    td { padding: 5px 6px; border-bottom: 1px solid #f0f0f0; }
    .right { text-align: right; }
    .bold { font-weight: 700; }
    .muted { color: #777; }
    .total-row td { border-top: 1.5px solid #1a1a1a; border-bottom: none; font-weight: 600; padding-top: 6px; background: #fafafa; }
    .fritext { background: #f8f8f8; border-left: 3px solid #d1d5db; padding: 8px 12px; font-size: 9.5pt; white-space: pre-wrap; border-radius: 0 4px 4px 0; }
    .anteckningar { font-size: 9pt; white-space: pre-wrap; }
    .sidfot { margin-top: 20px; padding-top: 8px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 8pt; color: #aaa; }
  </style>
</head>
<body>
<div class="sida">
  <div class="header">
    <div class="header-left">
      <h1>${customerName}</h1>
      <p>${customerAddress}</p>
    </div>
    <div class="header-right">
      <strong>Knegarloggen</strong>
      Utskrivet ${new Date().toLocaleDateString("sv-SE")}
    </div>
  </div>
  <div class="badges">${badges}</div>
  <div class="kontakt">
    ${customerPhone ? `<div class="kontakt-item"><label>Telefon</label>${customerPhone}</div>` : ""}
    ${customerEmail ? `<div class="kontakt-item"><label>E-post</label>${customerEmail}</div>` : ""}
    ${customerAddress ? `<div class="kontakt-item"><label>Adress</label>${customerAddress}</div>` : ""}
  </div>
  <div class="oversikt">
    <div class="oversikt-cell"><label>Arbetstid</label><span>${summary.totalTimmar} h</span></div>
    <div class="oversikt-cell"><label>Körd sträcka</label><span>${summary.totalStracka} km</span></div>
    <div class="oversikt-cell"><label>Material</label><span>${summary.artiklarSum.toLocaleString("sv-SE")} kr</span></div>
   
  </div>
  ${job.planeratArbete ? `<section><h4>Planerat arbete</h4><div class="fritext">${job.planeratArbete}</div></section>` : ""}
  ${job.utfortArbete ? `<section><h4>Utfört arbete</h4><div class="fritext">${job.utfortArbete}</div></section>` : ""}
  ${job.artiklar.length > 0 || job.ovrigaArtiklar ? `<section><h4>Inköpt material</h4>${artiklarHtml}${job.ovrigaArtiklar ? `<div class="fritext" style="margin-top:8px">${job.ovrigaArtiklar}</div>` : ""}</section>` : ""}
  ${job.resor.length > 0 ? `<section><h4>Resor</h4>${resorHtml}</section>` : ""}
  ${job.arbetstider.length > 0 ? `<section><h4>Arbetstid</h4>${arbetstidHtml}</section>` : ""}
  ${job.anteckningar ? `<section><h4>Interna anteckningar</h4><p class="anteckningar">${job.anteckningar}</p></section>` : ""}
  <div class="sidfot">
    <span>${customerName}${customerAddress ? ` · ${customerAddress}` : ""}</span>
    <span>Knegarloggen</span>
  </div>
</div>
</body>
</html>`);

  fönster.document.close();
  fönster.focus();
  setTimeout(() => {
    fönster.print();
    fönster.close();
  }, 600);
}
