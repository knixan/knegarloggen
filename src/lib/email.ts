import { Resend } from "resend";
import { type Job, type CompanyInput, beräknaSummering } from "./job-schema";
import { escapeHtml as e } from "./utils";
import { env } from "./env";

const FROM_NOREPLY = env.RESEND_FROM;
const FROM_FAKTURA = env.RESEND_FROM;

function getResend() {
  return new Resend(env.RESEND_API_KEY);
}

export async function sendVerificationEmail(email: string, url: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: "Verifiera din e-postadress – Knegarloggen",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
        <h2 style="font-size:20px;margin-bottom:16px">Verifiera din e-postadress</h2>
        <p style="margin-bottom:24px">Klicka på knappen nedan för att verifiera din e-postadress och aktivera ditt konto.</p>
        <a href="${url}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
          Verifiera e-post
        </a>
        <p style="margin-top:24px;font-size:13px;color:#666">
          Om knappen inte fungerar, kopiera och klistra in den här länken i din webbläsare:<br>
          <a href="${url}" style="color:#555">${url}</a>
        </p>
        <p style="margin-top:32px;font-size:12px;color:#aaa">Knegarloggen</p>
      </div>
    `,
  });
}

export async function sendJobEmail(
  job: Job,
  company: CompanyInput,
  recipientEmail: string,
  invoiceDate: Date = new Date(),
) {
  const resend = getResend();
  const summary = beräknaSummering(job);

  const customerName = e(
    job.customer?.foretagsnamn?.trim() || job.customer?.namn?.trim() || "Kund",
  );
  const customerAddr = [
    job.customer?.adress,
    job.customer?.postnummer,
    job.customer?.ort,
  ]
    .filter((s): s is string => Boolean(s))
    .map(e)
    .join(", ");

  const eCompanyName = e(company.name);
  const eCompanyOrgNr = e(company.orgNummer);
  const eCompanyAdress = e(company.adress);
  const eCompanyTelefon = e(company.telefon);

  const subject = job.fakturanummer
    ? `Faktura #${job.fakturanummer} från ${company.name}`
    : `Jobbunderlag från ${company.name}`;

  const fakturaHuvud = job.fakturanummer
    ? `<p style="margin:0"><strong>Fakturanummer:</strong> ${job.fakturanummer}</p>`
    : "";

  const forfallodatum =
    job.fakturanummer && company.forfallodagar
      ? (() => {
          const d = new Date(invoiceDate);
          d.setDate(d.getDate() + company.forfallodagar);
          return `<p style="margin:0"><strong>Förfallodatum:</strong> ${d.toLocaleDateString("sv-SE")}</p>`;
        })()
      : "";

  const betalningsrader = [
    company.bankgiro && `Bankgiro: ${e(company.bankgiro)}`,
    company.plusgiro && `Plusgiro: ${e(company.plusgiro)}`,
    company.swish && `Swish: ${e(company.swish)}`,
  ]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");

  const artiklarHtml =
    job.artiklar.length > 0
      ? `
        <h3 style="font-size:13px;text-transform:uppercase;color:#888;letter-spacing:.06em;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:20px 0 10px">Material</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="color:#888;font-size:11px;text-transform:uppercase">
              <th style="text-align:left;padding:4px 6px">Artikel</th>
              <th style="text-align:right;padding:4px 6px">Antal</th>
              <th style="text-align:right;padding:4px 6px">À-pris</th>
              <th style="text-align:right;padding:4px 6px">Summa</th>
            </tr>
          </thead>
          <tbody>
            ${job.artiklar
              .map(
                (a) => `
              <tr style="border-top:1px solid #f0f0f0">
                <td style="padding:5px 6px">${e(a.namn)}</td>
                <td style="text-align:right;padding:5px 6px">${a.antal} st</td>
                <td style="text-align:right;padding:5px 6px">${a.pris.toLocaleString("sv-SE")} kr</td>
                <td style="text-align:right;padding:5px 6px;font-weight:600">${(a.pris * a.antal).toLocaleString("sv-SE")} kr</td>
              </tr>
            `,
              )
              .join("")}
            <tr style="border-top:2px solid #1a1a1a">
              <td colspan="3" style="padding:6px 6px;font-weight:600">Totalt material</td>
              <td style="text-align:right;padding:6px 6px;font-weight:700">${summary.artiklarSum.toLocaleString("sv-SE")} kr</td>
            </tr>
          </tbody>
        </table>
      `
      : "";

  const arbetstidHtml =
    summary.totalTimmar > 0
      ? `
        <h3 style="font-size:13px;text-transform:uppercase;color:#888;letter-spacing:.06em;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:20px 0 10px">Arbetstid</h3>
        <p style="font-size:13px;margin:0">${summary.totalTimmar} h × ${summary.timpris.toLocaleString("sv-SE")} kr/h = <strong>${summary.arbetstidSum.toLocaleString("sv-SE")} kr</strong></p>
      `
      : "";

  const resorHtml =
    summary.totalStracka > 0
      ? `
        <h3 style="font-size:13px;text-transform:uppercase;color:#888;letter-spacing:.06em;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:20px 0 10px">Resor</h3>
        <p style="font-size:13px;margin:0">${summary.totalStracka} km × ${summary.milersattning.toLocaleString("sv-SE")} kr/km = <strong>${summary.resorSum.toLocaleString("sv-SE")} kr</strong></p>
      `
      : "";

  const utfortArbeteHtml = job.utfortArbete
    ? `
        <h3 style="font-size:13px;text-transform:uppercase;color:#888;letter-spacing:.06em;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:20px 0 10px">Utfört arbete</h3>
        <p style="font-size:13px;margin:0;white-space:pre-wrap">${e(job.utfortArbete)}</p>
      `
    : "";

  const totalHtml = `
    <div style="background:#f8f8f8;border-radius:6px;padding:14px 16px;margin-top:20px">
      <p style="margin:0;font-size:15px">Totalt exkl. moms: <strong>${summary.totalExklMoms.toLocaleString("sv-SE")} kr</strong></p>
      ${job.rotAvdrag ? `<p style="margin:6px 0 0;font-size:12px;color:#666">ROT-avdrag kan vara tillämpligt.</p>` : ""}
    </div>
  `;

  const betalningsHtml = betalningsrader
    ? `
        <h3 style="font-size:13px;text-transform:uppercase;color:#888;letter-spacing:.06em;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:20px 0 10px">Betalningsinformation</h3>
        <p style="font-size:13px;margin:0">${betalningsrader}</p>
      `
    : "";

  const fakturatextHtml = company.fakturatext
    ? `<p style="font-size:13px;color:#555;margin-top:20px">${e(company.fakturatext)}</p>`
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="border-bottom:2px solid #1a1a1a;padding-bottom:16px;margin-bottom:20px;display:flex;justify-content:space-between">
        <div>
          <h1 style="font-size:22px;margin:0 0 4px">${customerName}</h1>
          ${customerAddr ? `<p style="font-size:13px;color:#666;margin:0">${customerAddr}</p>` : ""}
        </div>
        <div style="text-align:right;font-size:13px;color:#666">
          <strong style="display:block;color:#1a1a1a;font-size:15px">${eCompanyName}</strong>
          ${eCompanyOrgNr ? `Org.nr: ${eCompanyOrgNr}` : ""}
        </div>
      </div>

      ${
        fakturaHuvud || forfallodatum
          ? `<div style="font-size:13px;margin-bottom:16px;display:grid;gap:4px">${fakturaHuvud}${forfallodatum}</div>`
          : ""
      }

      ${utfortArbeteHtml}
      ${artiklarHtml}
      ${arbetstidHtml}
      ${resorHtml}
      ${totalHtml}
      ${betalningsHtml}
      ${fakturatextHtml}

      <div style="margin-top:32px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:11px;color:#aaa">
        ${eCompanyName}${eCompanyAdress ? ` · ${eCompanyAdress}` : ""}${eCompanyTelefon ? ` · ${eCompanyTelefon}` : ""}
      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM_FAKTURA,
    to: recipientEmail,
    ...(company.epost ? { replyTo: company.epost } : {}),
    subject,
    html,
  });
}
