# Knegarloggen

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Privat-gray?style=flat-square)](LICENSE)

Jobblogg och fakturaverktyg för svenska hantverkare. Håll koll på kunder, material, resor, arbetstid och fakturor – allt på ett ställe.

---

## Funktioner

- **Jobbhantering** – Skapa och redigera jobb med status (pågående / utfört / fakturerat / betalt)
- **Kundregister** – Privatpersoner och företagskunder med adress, personnummer och fastighetsbeteckning
- **Artiklar** – Material med artikelnummer, återförsäljare, inköpspris och utpris
- **Reslogg** – Körda sträckor per datum med automatisk milersättning
- **Arbetstid** – Arbetspass per datum med automatisk timprisberäkning
- **Övriga kostnader** – Fri rad för förbrukningsmaterial, hyrd utrustning m.m.
- **Faktura som PDF** – Professionell PDF med logotyp, automatiskt fakturanummer, moms och ROT-avdrag
- **Skicka faktura via e-post** – Skickas med Resend, med ditt företags avsändare och svarskopia
- **ROT-avdrag** – Korrekt beräkning (30 % av arbetskostnad inkl. moms) enligt Skatteverkets regler
- **Fast pris** – Fakturera ett fast pris istället för beräknad summa
- **Bilder** – Ladda upp jobbfoton via UploadThing
- **Prenumeration** – 30 dagars gratis provperiod, därefter via Stripe (99 kr/mån)
- **Självbetjäning** – Stripe Billing Portal för att hantera/avsluta abonnemang
- **Admin** – Rollbaserad adminpanel för användarhantering
- **GDPR** – Kontoborttagning raderar all data inklusive filer
- **Mörkt/ljust läge** – Systemanpassat tema

---

## Teknisk stack

| Lager       | Teknik                        |
|-------------|-------------------------------|
| Framework   | Next.js 16 (App Router)       |
| Språk       | TypeScript                    |
| Styling     | Tailwind CSS v4 + shadcn/ui   |
| Formulär    | React Hook Form + Zod         |
| ORM         | Prisma 7                      |
| Databas     | PostgreSQL                    |
| Auth        | Better Auth                   |
| Betalning   | Stripe (subscriptions)        |
| E-post      | Resend                        |
| Filuppl.    | UploadThing                   |
| PDF         | @react-pdf/renderer           |
| Deploy      | Vercel                        |

---

## Kom igång

### Förutsättningar

- Node.js 20+
- PostgreSQL-databas (t.ex. [Neon](https://neon.tech))
- Konton hos [Stripe](https://stripe.com), [Resend](https://resend.com) och [UploadThing](https://uploadthing.com)

### Installation

```bash
git clone https://github.com/knixan/knegarloggen.git
cd knegarloggen
npm install
```

### Miljövariabler

Skapa en `.env`-fil i rooten:

```env
# Databas
DATABASE_URL="postgresql://USER:PASSWORD@HOST/knegarloggen?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="minst-32-tecken-lång-hemlighet"  # openssl rand -base64 32
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# E-post (Resend) – verifiera din domän på resend.com/domains
RESEND_API_KEY="re_..."

# Betalning (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # från: stripe listen --print-secret
STRIPE_PRICE_ID="price_..."

# Filuppladdning (UploadThing)
UPLOADTHING_TOKEN="..."
```

I produktion – sätt `NEXT_PUBLIC_APP_URL` till din faktiska domän. `NEXT_PUBLIC_`-variabler bäddas in vid byggtid.

### Databas

```bash
npx prisma migrate deploy
```

### Stripe webhook lokalt

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Starta

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

---

## Projektstruktur

```
knegarloggen/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/     # Better Auth handler
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/      # Skapa Stripe Checkout-session
│   │   │   │   ├── portal/        # Öppna Stripe Billing Portal
│   │   │   │   └── webhook/       # Ta emot Stripe-events
│   │   │   └── uploadthing/       # Filuppladdning
│   │   ├── logga-in/
│   │   ├── registrera/
│   │   ├── admin/                 # Adminpanel (kräver roll "admin")
│   │   └── mina-sidor/            # Skyddade sidor
│   │       ├── foretag/           # Företagsuppgifter
│   │       ├── installningar/     # Prenumeration, lösenord, konto
│   │       ├── jobb/[id]/         # Jobbdetalj, redigera, faktura/utskrift
│   │       ├── kunder/            # Kundregister
│   │       └── nytt-jobb/
│   ├── components/
│   │   ├── site/                  # Landningssida
│   │   ├── minasidor/
│   │   │   ├── faktura/           # PDF-komponent och e-postknapp
│   │   │   ├── foretag/
│   │   │   ├── installningar/
│   │   │   ├── jobb/
│   │   │   ├── kunder/
│   │   │   ├── oversikt/
│   │   │   ├── mina-sidor-nav.tsx
│   │   │   └── trial-gate.tsx     # Spärrar UI när provperiod gått ut
│   │   └── ui/                    # shadcn/ui-komponenter
│   └── lib/
│       ├── auth.ts                # Better Auth-konfiguration
│       ├── auth-client.ts         # Auth-klient (React)
│       ├── auth-server.ts         # Server actions för registrering/inloggning
│       ├── admin-actions.ts       # Server actions för adminpanelen
│       ├── email.ts               # Resend-mallar (verifiering + faktura)
│       ├── env.ts                 # Validerade miljövariabler (Zod)
│       ├── job-actions.ts         # Server actions (CRUD jobb/kunder/företag)
│       ├── job-schema.ts          # Zod-scheman och beräkningsfunktioner
│       ├── prisma.ts              # Prisma-klient
│       └── stripe.ts              # Stripe-klient
├── prisma/
│   └── schema.prisma
└── package.json
```

---

## Databasmodeller

| Modell        | Beskrivning |
|---------------|-------------|
| `User`        | Hanteras av Better Auth. Har `role`-fält (`user` / `admin`). |
| `Company`     | Företagsuppgifter, fakturainställningar och logotyp per användare. |
| `Customer`    | Privat- eller företagskund kopplad till ett företag. |
| `Job`         | Jobb med status, prissättning och fakturanummer. |
| `Article`     | Materialrad per jobb. |
| `Trip`        | Resrad per datum. |
| `WorkSession` | Arbetspass per datum. |
| `OvrigKostnad`| Övrig kostnad per jobb. |
| `JobImage`    | Bild uppladdad via UploadThing. |
| `Subscription`| Stripe-prenumeration med status och perioder. |

---

## Prenumerationsflöde

1. Användare registrerar sig → 30 dagars provperiod skapas automatiskt
2. Proven visas i layouten via `TrialGate` – spärrar UI när provperiod gått ut
3. Användaren klickar "Lägg till betalning" → Stripe Checkout öppnas
4. Stripe-webhook (`checkout.session.completed`) aktiverar prenumerationen i DB
5. Löpande events (`customer.subscription.updated`, `customer.subscription.deleted`) håller DB synkad
6. Stripe Billing Portal används för att ändra kortuppgifter eller avsluta

---

## Admin

Adminpanelen nås på `/admin` och kräver `role = "admin"`. Sätt första admin direkt i databasen:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'din@epost.se';
```

---

## Scripts

```bash
npm run dev          # Starta dev-server
npm run build        # Prisma generate + Next.js build
npm run start        # Starta produktionsserver
npm run lint         # ESLint
npm run type-check   # TypeScript-kontroll
npm run db:seed      # Seed-data (kräver prisma/seed.ts)
```

---

## Licens

Privat projekt – alla rättigheter förbehållna.
