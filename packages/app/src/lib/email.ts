import { brand } from "../brand";
import { Resend } from "resend";
import { env } from "./env";

const FROM_NOREPLY = env.RESEND_FROM;

function getResend() {
  return new Resend(env.RESEND_API_KEY);
}

export async function sendVerificationEmail(email: string, url: string) {
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: `Verifiera din e-postadress – ${brand.namn}`,
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
        <p style="margin-top:32px;font-size:12px;color:#aaa">${brand.namn}</p>
      </div>
    `,
  });
  if (error) {
    console.error("Kunde inte skicka verifieringsmejl:", error);
    throw new Error("Kunde inte skicka verifieringsmejl");
  }
}
