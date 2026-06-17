# Knegarloggen

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Privat-gray?style=flat-square)](LICENSE)

Jobblogg och fakturaverktyg för hantverkare. Håll koll på kunder, material, resor, arbetstid och fakturor – allt på ett ställe.

---

## Funktioner

- **Jobbhantering** – Skapa och redigera jobb med status (ej påbörjat / pågående / utfört / fakturerat / betalt)
- **Kundregister** – Privatpersoner och företagskunder med adress, personnummer och fastighetsbeteckning
- **Artiklar** – Material med artikelnummer, återförsäljare, inköpspris och utpris
- **Reslogg** – Körda sträckor per datum med automatisk milersättning
- **Arbetstid** – Arbetspass per datum med automatisk timprisberäkning
- **Övriga kostnader** – Fri rad för förbrukningsmaterial, hyrd utrustning m.m.
- **Faktura** – Professionell utskriftsvy med logotyp, betalningsuppgifter, moms och ROT-avdrag
- **ROT-avdrag** – Korrekt beräkning (30% av arbetskostnad inkl. moms) enligt Skatteverkets regler
- **Fast pris** – Möjlighet att fakturera ett fast pris istället för beräknad summa
- **Bilder** – Ladda upp jobbfoton via UploadThing
- **Mörkt/ljust läge** – Systemanpassat tema

---

## Teknisk stack

| Lager     | Teknik                      |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| Språk     | TypeScript                  |
| Styling   | Tailwind CSS v4 + shadcn/ui |
| Formulär  | React Hook Form + Zod       |
| ORM       | Prisma 7                    |
| Databas   | PostgreSQL (Neon)           |
| Auth      | Better Auth                 |
| Filuppl.  | UploadThing                 |
| Deploy    | Vercel                      |

---

## Kom igång

### Förutsättningar

- Node.js 18+
- PostgreSQL-databas (t.ex. [Neon](https://neon.tech))
- [UploadThing](https://uploadthing.com)-konto för bilduppladdning

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
BETTER_AUTH_SECRET="generera-med-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"

# App-URL (används av auth-klienten)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# UploadThing
UPLOADTHING_TOKEN="ditt-token-här"
```

I produktion (Vercel) – uppdatera `BETTER_AUTH_URL` och `NEXT_PUBLIC_APP_URL` till din faktiska domän.

### Databas

```bash
npx prisma migrate deploy
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
├── app/
│   ├── api/                  # Auth- och UploadThing-routes
│   ├── logga-in/             # Inloggning
│   ├── registrera/           # Registrering
│   └── mina-sidor/           # Skyddade sidor
│       ├── jobb/[id]/        # Jobbdetalj, redigera, skriv ut
│       ├── kunder/           # Kundregister
│       └── foretag/          # Företagsuppgifter
├── src/
│   ├── components/
│   │   ├── site/             # JobForm, JobList, fakturakomponenter m.m.
│   │   └── ui/               # shadcn/ui-komponenter
│   └── lib/
│       ├── auth.ts           # Better Auth-konfiguration
│       ├── job-actions.ts    # Server actions (CRUD)
│       ├── job-schema.ts     # Zod-schema och beräkningsfunktioner
│       └── prisma.ts         # Prisma-klient
├── prisma/
│   └── schema.prisma         # Databasschema
└── proxy.ts                  # Routeskydd (kräver inloggning för /mina-sidor)
```

---

## Databasmodeller

- **User / Account / Session** – hanteras av Better Auth
- **Company** – företagsuppgifter, fakturainställningar och logotyp
- **Customer** – privat- eller företagskund kopplad till ett företag
- **Job** – jobb med status, prissättning och ROT-flagga
- **Article** – material per jobb
- **Trip** – reslog per datum
- **WorkSession** – arbetspass per datum
- **OvrigKostnad** – övriga kostnader per jobb
- **JobImage** – bilder uppladdade via UploadThing

---

## Scripts

```bash
npm run dev        # Starta dev-server (Turbopack)
npm run build      # Bygg för produktion
npm run start      # Starta produktionsserver
npm run lint       # Kör ESLint
```

---

## Licens

Privat projekt – alla rättigheter förbehållna.
