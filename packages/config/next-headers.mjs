// Säkerhetsheaders för alla appar (används i apps/<app>/next.config.ts).
//
// CSP:n begränsar bara inbäddning, <base> och formulär – inte skript. En
// strikt skript-CSP kräver nonces i Next.js och måste testas mot Stripe,
// UploadThing och react-pdf först.
const sakerhetsHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

/** Används som `headers` i next.config.ts. */
export async function headers() {
  return [{ source: "/:path*", headers: sakerhetsHeaders }];
}
