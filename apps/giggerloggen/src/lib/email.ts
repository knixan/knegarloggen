import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM ?? "noreply@giggerloggen.se";

export async function sendVerificationEmail(email: string, url: string) {
  await resend.emails.send({
    from,
    to: email,
    subject: "Bekräfta din e-postadress – Giggerloggen",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Välkommen till Giggerloggen!</h2>
        <p>Klicka på länken nedan för att bekräfta din e-postadress och aktivera ditt konto.</p>
        <a href="${url}" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
          Bekräfta e-postadress
        </a>
        <p style="color:#6b7280;font-size:14px;margin-top:24px;">
          Länken är giltig i 24 timmar. Ignorera detta e-postmeddelande om du inte har registrerat dig.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, url: string) {
  await resend.emails.send({
    from,
    to: email,
    subject: "Återställ ditt lösenord – Giggerloggen",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Återställ lösenord</h2>
        <p>Vi har tagit emot en begäran om att återställa lösenordet för ditt konto.</p>
        <a href="${url}" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
          Återställ lösenord
        </a>
        <p style="color:#6b7280;font-size:14px;margin-top:24px;">
          Länken är giltig i 1 timme. Ignorera om du inte begärde detta.
        </p>
      </div>
    `,
  });
}
