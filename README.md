# Tre Syskon Appar för att Logga Tjänster och Jobb

## Knegarloggen - Giggerloggen - Hemfixloggen

[![CI](https://github.com/knixan/knegarloggen/actions/workflows/ci.yml/badge.svg)](https://github.com/knixan/knegarloggen/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?style=flat-square&logo=pnpm)](https://pnpm.io/)

Monorepo med tre jobblogg- och fakturaverktyg för svenska småföretagare. Håll koll på kunder, jobb, material, resor, arbetstid och fakturor på ett ställe.

---

## Appar

| App                                      | Målgrupp                                    | Skatteavdrag |
| ---------------------------------------- | ------------------------------------------- | ------------ |
| [`apps/knegarloggen`](apps/knegarloggen) | Hantverkare                                 | ROT 30 %     |
| [`apps/hemfixloggen`](apps/hemfixloggen) | Hushållsnära tjänster (städ, trädgård m.m.) | RUT 50 %     |
| [`apps/giggerloggen`](apps/giggerloggen) | Frilansare och konsulter                    | inget        |

Apparna delar **all kod** i `packages/app` och skiljer sig bara i startsida, färger, bilder och [`brand.ts`](packages/app/src/brand.ts) (namn, logga, målgrupp och skatteavdrag). Varje app är ändå en egen produkt med egen databas, egna miljövariabler och eget Stripe-pris.

ROT och RUT blandas aldrig: varje app har ett skatteavdrag eller inget.

---

## Funktioner

- **Översikt** – nyckeltal (pågående jobb, timmar, att fakturera, obetalt), att göra-listor och varningar för saknade uppgifter
- **Jobb** – status (pågående / utfört / fakturerat / betalt), arbetstid, resor, material med inköpspris och artikelnummer, övriga kostnader, bilder och fast pris
- **Kundregister** – privatpersoner och företag. Fastighetsuppgifter för ROT visas bara i Knegarloggen
- **Faktura** – förhandsvisning, utskrift och PDF från samma fakturamodell, med logga, fakturanummer, moms och ROT-/RUT-avdrag
- **ROT/RUT** – preliminärt avdrag på arbetskostnaden inkl. moms, i jobbformuläret och på fakturan
- **Prenumeration** – 30 dagars provperiod, sedan Stripe. Kontrolleras både i UI och i varje server action
- **Admin** – användare och roller
- **GDPR** – radera konto tar bort all data och alla filer (och avbryts om Stripe-prenumerationen inte kan avslutas)
- **Mobil** – flikrad längst ner med ikoner, mörkt/ljust läge

---

## Teknisk stack

| Lager     | Teknik                                           |
| --------- | ------------------------------------------------ |
| Monorepo  | pnpm workspaces + catalog (gemensamma versioner) |
| Framework | Next.js 16 (App Router, Cache Components)        |
| Språk     | TypeScript                                       |
| Styling   | Tailwind CSS v4 + shadcn/ui                      |
| Formulär  | React Hook Form + zod 4                          |
| Databas   | PostgreSQL (Neon) + Prisma 7                     |
| Auth      | Better Auth                                      |
| Betalning | Stripe                                           |
| E-post    | Resend                                           |
| Filer     | UploadThing                                      |
| PDF       | @react-pdf/renderer                              |
| Test      | Vitest                                           |
| CI        | GitHub Actions                                   |

---

## Projektstruktur

```
knegarloggen/
├── apps/
│   ├── knegarloggen/            # Tunn app: startsida, färger, bilder
│   │   ├── src/app/
│   │   │   ├── page.tsx         # Startsidan (egen per app)
│   │   │   ├── globals.css      # Importerar det delade temat + appens färger
│   │   │   └── …                # Tunna route-filer → @knegarloggen/app/routes/…
│   │   ├── src/components/site/ # Startsidans komponenter (hero, features …)
│   │   ├── src/proxy.ts         # Inloggningsskydd (matcher + delad logik)
│   │   ├── public/              # Logga och bilder
│   │   └── next.config.ts       # NEXT_PUBLIC_APP väljer märke
│   ├── giggerloggen/            # Samma upplägg
│   └── hemfixloggen/            # Samma upplägg
├── packages/
│   ├── app/                     # ALLT gemensamt (@knegarloggen/app)
│   │   ├── src/brand.ts         # Skillnaderna mellan apparna
│   │   ├── src/routes/          # Sidor och API-routes (mina sidor, admin, inloggning …)
│   │   ├── src/components/      # Mina sidor, faktura, navbar, footer
│   │   ├── src/lib/             # Server actions, beräkningar, auth, Stripe, e-post, uppladdning
│   │   ├── src/theme.css        # Delat Tailwind-tema
│   │   └── prisma/              # Ett schema + migreringar för alla appar
│   ├── ui/                      # shadcn-komponenter (@knegarloggen/ui)
│   ├── auth/                    # createAuth för Better Auth
│   ├── stripe/                  # Stripe-klient
│   └── config/                  # Delad tsconfig och ESLint
├── .claude/                     # Hooks för AI-agenter (se AGENTS.md)
├── .github/workflows/ci.yml
├── AGENTS.md                    # Regler för AI-agenter
├── pnpm-workspace.yaml          # Workspaces, versioner (catalog), overrides
└── package.json
```

En ny funktion byggs i `packages/app`. Om apparna ska skilja sig åt läggs det till i `brand.ts`, inte som kopierad kod.

---

## Kom igång

### Förutsättningar

- Node.js 24
- [pnpm](https://pnpm.io/) 11
- En PostgreSQL-databas per app, t.ex. [Neon](https://neon.tech)
- Konton hos [Stripe](https://stripe.com), [Resend](https://resend.com) och [UploadThing](https://uploadthing.com)

### Installation

```bash
git clone https://github.com/knixan/knegarloggen.git
cd knegarloggen
pnpm install        # genererar även Prisma-klienten (postinstall i packages/app)
```

### Miljövariabler

Varje app har en egen `.env` i sin mapp, med egen databas, auth-hemlighet och Stripe-pris:

```bash
cp apps/knegarloggen/.env.example apps/knegarloggen/.env
cp apps/giggerloggen/.env.example apps/giggerloggen/.env
cp apps/hemfixloggen/.env.example apps/hemfixloggen/.env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/db?sslmode=require"

BETTER_AUTH_SECRET="minst-32-tecken"        # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # appens egen port/domän

RESEND_API_KEY="re_..."
RESEND_FROM="noreply@dindomän.se"

STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."            # stripe listen --print-secret

UPLOADTHING_TOKEN="..."
```

`NEXT_PUBLIC_`-variabler bäddas in när appen byggs. Sätt `NEXT_PUBLIC_APP_URL` till rätt domän i produktion.

### Databas

Alla appar använder samma schema (`packages/app/prisma/schema.prisma`) men var sin databas. Kör kommandona i appens mapp, så används den appens `.env`:

```bash
cd apps/knegarloggen
pnpm db:deploy                  # kör migreringarna
pnpm db:migrate                 # skapa en ny migrering efter schemaändring
pnpm db:reset                   # nollställ databasen – raderar ALL data
pnpm db:seed                    # demodata
pnpm db:admin din@epost.se      # gör ett konto till admin
```

### Starta

```bash
pnpm dev:knegarloggen
pnpm dev:giggerloggen
pnpm dev:hemfixloggen
```

Varje app har en egen port – Knegarloggen 3000, Giggerloggen 3001, Hemfixloggen 3002 – så de kan köras samtidigt. `NEXT_PUBLIC_APP_URL` och `BETTER_AUTH_URL` i appens `.env` ska ha samma port.

### Stripe-webhook lokalt

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Kontroller och CI

```bash
pnpm type-check     # TypeScript i alla appar och paket
pnpm lint           # ESLint
pnpm format         # Prettier – formaterar hela repot
pnpm format:check   # Prettier – kontrollerar bara (körs i CI)
pnpm test           # Vitest – beräkningar, moms, ROT/RUT, faktura, validering
pnpm build          # Bygger alla tre apparna
```

[CI](.github/workflows/ci.yml) kör samma steg vid varje push till `main` och på pull requests.

---

## Prenumerationsflöde

1. Användaren registrerar sig och får 30 dagars provperiod
2. `TrialGate` spärrar mina sidor när provperioden har gått ut. Server actions kräver aktiv prenumeration (utom radera konto)
3. "Lägg till betalning" öppnar Stripe Checkout
4. Webhooken (`checkout.session.completed`, `customer.subscription.*`) håller databasen synkad
5. Stripe Billing Portal används för kortbyte och uppsägning

---

## Arbeta med AI-agenter

[`AGENTS.md`](AGENTS.md) innehåller reglerna för AI-agenter (Claude Code m.fl.): struktur, domänregler, länkar till dokumentation för rätt versioner, vad "klart" betyder, databasregler och hur kanban uppdateras. `CLAUDE.md` importerar den.

Hooks i [`.claude/`](.claude/settings.json):

- **`blockera-git.mjs`** – stoppar `git commit` och `git push` från agenter (du committar själv)
- **`formatera-och-linta.mjs`** – formaterar varje fil en agent ändrar med Prettier och kör ESLint, så att felen skickas tillbaka direkt

Planering sker i [GitHub Project 15](https://github.com/users/knixan/projects/15), med flikar per app.

---

## Licens

Privat projekt – alla rättigheter förbehållna.
