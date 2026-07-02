# Knegarloggen

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?style=flat-square&logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-Privat-gray?style=flat-square)](LICENSE)

Monorepo (pnpm workspaces) med jobblogg- och fakturaverktyg för svenska hantverkare, frilansare, konsulter och hushållsnära tjänster. Håll koll på kunder, jobb/uppdrag, material, resor, arbetstid och fakturor – allt på ett ställe.

---

## Appar

| App | Målgrupp | Beskrivning |
|-----|----------|-------------|
| [`apps/knegarloggen`](apps/knegarloggen) | Hantverkare | Jobbhantering med artiklar/material, ROT-avdrag och milersättning |
| [`apps/giggerloggen`](apps/giggerloggen) | Frilansare & konsulter | Uppdragshantering (konsulting, design, utbildning, IT, juridik m.fl.) — inget ROT/RUT |
| [`apps/hemfixloggen`](apps/hemfixloggen) | Städ & trädgård | Uppdragshantering med RUT-avdrag (städning, trädgårdsskötsel, flyttstädning m.fl.) |

Apparna delar samma tekniska grund (Next.js, Prisma, Better Auth, Stripe) men är **helt separata produkter**: egen databas, eget auth och egna miljövariabler per app. Stripe-priser/webhooks är separata per app även om de kan ligga på samma Stripe-konto. Vilken avdragstyp (ROT/RUT/ingen) varje app stödjer är medvetet — se [Databasmodeller](#databasmodeller).

---

## Funktioner

- **Jobb-/uppdragshantering** – Skapa och redigera med status (pågående / utfört / fakturerat / betalt)
- **Kundregister** – Privatpersoner och företagskunder med adress, personnummer/org.nummer
- **Artiklar/material** – Artikelnummer, återförsäljare, inköpspris och utpris (Knegarloggen)
- **Reslogg** – Körda sträckor per datum med automatisk milersättning
- **Arbetstid** – Arbetspass per datum med automatisk timprisberäkning
- **Övriga kostnader** – Fri rad för förbrukningsmaterial, hyrd utrustning m.m.
- **Faktura som PDF/utskrift** – Med logotyp, automatiskt fakturanummer, moms och ROT-/RUT-avdrag
- **Skicka faktura via e-post** – Skickas med Resend, med företagets avsändare och svarskopia
- **ROT-avdrag** (Knegarloggen) – 30 % av arbetskostnad inkl. moms enligt Skatteverkets regler
- **RUT-avdrag** (Hemfixloggen) – 50 % av arbetskostnad inkl. moms. Satsen har ändrats historiskt, så dubbelkolla mot aktuella Skatteverket-regler innan produktionsdrift (`RUT_AVDRAG_RATE` i `uppdrag-schema.ts`)
- **Fast pris** – Fakturera ett fast pris istället för beräknad summa
- **Bilder** – Ladda upp jobb-/uppdragsfoton via UploadThing (Knegarloggen, Hemfixloggen)
- **Prenumeration** – Gratis provperiod, därefter via Stripe
- **Självbetjäning** – Stripe Billing Portal för att hantera/avsluta abonnemang
- **Admin** – Rollbaserad adminpanel för användarhantering
- **GDPR** – Kontoborttagning raderar all data inklusive filer
- **Mörkt/ljust läge** – Systemanpassat tema

---

## Teknisk stack

| Lager       | Teknik                        |
|-------------|-------------------------------|
| Monorepo    | pnpm workspaces               |
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
- [pnpm](https://pnpm.io/) 11+
- En PostgreSQL-databas per app (t.ex. [Neon](https://neon.tech))
- Konton hos [Stripe](https://stripe.com), [Resend](https://resend.com) och [UploadThing](https://uploadthing.com)

### Installation

```bash
git clone https://github.com/knixan/knegarloggen.git
cd knegarloggen
pnpm install
```

### Miljövariabler

Varje app har sin **egen** `.env`-fil i sin egen mapp (inte en delad fil i roten) – appar har olika databaser, auth-secrets och Stripe-priser.

```bash
cp apps/knegarloggen/.env.example apps/knegarloggen/.env
cp apps/giggerloggen/.env.local.example apps/giggerloggen/.env.local
cp apps/hemfixloggen/.env.local.example apps/hemfixloggen/.env.local
```

```env
# Databas
DATABASE_URL="postgresql://USER:PASSWORD@HOST/dbnamn?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="minst-32-tecken-lång-hemlighet"  # openssl rand -base64 32
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# E-post (Resend) – verifiera din domän på resend.com/domains
RESEND_API_KEY="re_..."
RESEND_FROM="noreply@dindomän.se"

# Betalning (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # från: stripe listen --print-secret
STRIPE_PRICE_ID="price_..."

# Filuppladdning (UploadThing)
UPLOADTHING_TOKEN="..."
```

I produktion – sätt `NEXT_PUBLIC_APP_URL` till appens faktiska domän. `NEXT_PUBLIC_`-variabler bäddas in vid byggtid.

### Databas

Kör migrationer per app:

```bash
pnpm --filter knegarloggen exec prisma migrate deploy
pnpm --filter giggerloggen exec prisma migrate deploy
pnpm --filter hemfixloggen exec prisma migrate deploy
```

> Första gången en app kopplas till en helt tom databas finns ingen migrering att köra `deploy` mot. Kör då `pnpm --filter <app> exec prisma migrate dev --name init` istället för att skapa och applicera den första migreringen.

### Stripe webhook lokalt

```bash
# Knegarloggen (port 3000)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Giggerloggen (annan port, t.ex. 3001)
stripe listen --forward-to localhost:3001/api/stripe/webhook

# Hemfixloggen (annan port, t.ex. 3002)
stripe listen --forward-to localhost:3002/api/stripe/webhook
```

### Starta

```bash
pnpm dev                    # Startar alla appar parallellt
pnpm dev:knegarloggen       # Endast Knegarloggen
pnpm dev:giggerloggen       # Endast Giggerloggen
pnpm dev:hemfixloggen       # Endast Hemfixloggen
```

Alla appars dev-server default:ar till port 3000 – kör bara en åt gången med `pnpm dev`, eller starta dem separat i egna terminaler med `--port` om du vill köra flera samtidigt.

Öppna [http://localhost:3000](http://localhost:3000).

---

## Projektstruktur

```
knegarloggen/
├── apps/
│   ├── knegarloggen/              # Jobblogg för hantverkare
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth/[...all]/     # Better Auth handler
│   │   │   │   │   ├── stripe/            # Checkout, portal, webhook
│   │   │   │   │   └── uploadthing/       # Filuppladdning
│   │   │   │   ├── logga-in/ registrera/
│   │   │   │   ├── admin/                 # Adminpanel (kräver roll "admin")
│   │   │   │   └── mina-sidor/            # Skyddade sidor (jobb, kunder, företag, inställningar)
│   │   │   ├── components/
│   │   │   │   ├── button/                # Tema-toggle (re-export från @knegarloggen/ui)
│   │   │   │   ├── minasidor/             # Affärslogik-UI: jobb, kunder, faktura, översikt
│   │   │   │   ├── site/                  # Landningssida (hero, features, navbar, footer)
│   │   │   │   └── ui/                    # Re-export-stubbar mot @knegarloggen/ui
│   │   │   ├── lib/                       # auth, prisma, stripe, email, env, job-actions/-schema
│   │   │   └── types/
│   │   └── prisma/                        # schema.prisma, migrations/, seed.ts
│   ├── giggerloggen/               # Uppdragslogg för frilansare & konsulter
│   │   └── (samma struktur som ovan, med "uppdrag" istället för "jobb", ingen seed.ts)
│   └── hemfixloggen/               # Uppdragslogg för städ & trädgård (RUT)
│       └── (samma struktur som giggerloggen, med RUT istället för inget avdrag)
├── packages/
│   ├── ui/                        # Delade shadcn-komponenter (@knegarloggen/ui)
│   └── stripe/                    # Delad Stripe-klient (@knegarloggen/stripe)
├── pnpm-workspace.yaml
└── package.json
```

---

## Databasmodeller

| Modell        | Beskrivning |
|---------------|-------------|
| `User`        | Hanteras av Better Auth. Har `role`-fält (`user` / `admin`). |
| `Company`     | Företagsuppgifter, fakturainställningar och logotyp per användare. |
| `Customer`    | Privat- eller företagskund kopplad till ett företag. |
| `Job` / `Uppdrag` | Jobb/uppdrag med status, prissättning, fakturanummer och avdragsflagga (`rotAvdrag` i Knegarloggen, `rutAvdrag` i Hemfixloggen — inget avdrag i Giggerloggen). |
| `Article`     | Materialrad per jobb (Knegarloggen). |
| `Trip` / `Resa` | Resrad per datum. |
| `WorkSession` / `Arbetspass` | Arbetspass per datum. |
| `OvrigKostnad`| Övrig kostnad per jobb/uppdrag. |
| `JobImage` / `UppdragImage` | Bild uppladdad via UploadThing (Knegarloggen, Hemfixloggen). |
| `Subscription`| Stripe-prenumeration med status och perioder. |

---

## Prenumerationsflöde

1. Användare registrerar sig → provperiod skapas automatiskt
2. Proven visas i layouten via `TrialGate` – spärrar UI när provperiod gått ut
3. Användaren klickar "Lägg till betalning" → Stripe Checkout öppnas
4. Stripe-webhook (`checkout.session.completed`) aktiverar prenumerationen i DB
5. Löpande events (`customer.subscription.updated`, `customer.subscription.deleted`) håller DB synkad
6. Stripe Billing Portal används för att ändra kortuppgifter eller avsluta

---

## Admin

Adminpanelen nås på `/admin` i respektive app och kräver `role = "admin"`. Sätt första admin direkt i databasen:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'din@epost.se';
```

---

## Scripts

Körs från roten via pnpms inbyggda workspace-stöd (`--filter` kör mot en specifik app):

```bash
pnpm dev                        # Starta alla appar i dev-läge
pnpm dev:knegarloggen           # Starta endast Knegarloggen
pnpm dev:giggerloggen           # Starta endast Giggerloggen
pnpm dev:hemfixloggen           # Starta endast Hemfixloggen
pnpm build                      # Bygg alla appar (prisma generate + next build)
pnpm build:knegarloggen         # Bygg endast Knegarloggen
pnpm build:giggerloggen         # Bygg endast Giggerloggen
pnpm build:hemfixloggen         # Bygg endast Hemfixloggen
pnpm lint                       # ESLint för alla appar
pnpm type-check                 # TypeScript-kontroll för alla appar
```

Per-app scripts (kör inifrån `apps/<app>` eller med `pnpm --filter <app>`):

```bash
npm run db:seed                 # Seed-data (Knegarloggen, kräver prisma/seed.ts)
```

---

## Licens

Privat projekt – alla rättigheter förbehållna.
