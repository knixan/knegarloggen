# Knegarloggen 🔧

En jobblogg för hantverkare – håll koll på kunder, artiklar, resor, arbetstid och fakturastatus på ett och samma ställe.

---

## Vad är det här?

Knegarloggen är en webbaserad applikation byggd för mindre hantverksföretag. Du loggar varje jobb med kunduppgifter, material/artiklar, körda sträckor och arbetstid – och bockar av när jobbet är utfört, fakturerat och betalt. Stöd för ROT-avdrag ingår.

Appen är byggd med Next.js, Prisma och PostgreSQL, med inloggning via [better-auth](https://better-auth.dev/).

---

## Funktioner

- **Jobbhantering** – skapa, redigera och ta bort jobb per företag
- **Artiklar** – lägg till material med artikelnummer, antal och pris
- **Resor** – logga körda sträckor och avstånd per datum
- **Arbetstid** – registrera arbetspass i timmar per datum
- **Status-bockar** – Utfört · ROT-avdrag · Fakturerat · Betalt
- **Summering** – totaler för artiklar, resor och timmar beräknas live
- **Autentisering** – registrering och inloggning med e-post/lösenord
- **Multi-företag** – varje användare kan ha ett eller flera företag

---

## Teknisk stack

| Lager     | Teknik                      |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| Språk     | TypeScript                  |
| Styling   | Tailwind CSS v4 + shadcn/ui |
| Formulär  | React Hook Form + Zod       |
| ORM       | Prisma 7                    |
| Databas   | PostgreSQL                  |
| Auth      | better-auth                 |
| Runtime   | Node.js                     |

---

## Kom igång

### Förutsättningar

- Node.js 18+
- PostgreSQL (t.ex. via pgAdmin 4 eller Docker)

### Installation

```bash
git clone https://github.com/knixan/knegarloggen.git
cd knegarloggen
npm install
```

### Miljövariabler

Kopiera `.env.example` till `.env` och fyll i dina värden:

```bash
cp .env.example .env
```

```env
# Databas
DATABASE_URL="postgresql://postgres:DITTLÖSENORD@localhost:5432/knegarloggen"

# better-auth
BETTER_AUTH_SECRET="generera-med-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"

# App-URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SMTP (valfritt – för e-postverifiering)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="noreply@knegarloggen.se"
```

### Databas

```bash
# Kör migrationer
npx prisma migrate deploy

# (Valfritt) Seed med testdata
npm run db:seed
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
├── app/                    # Next.js App Router
│   ├── api/                # API-routes (auth, jobs)
│   ├── logga-in/           # Inloggningssida
│   ├── registrera/         # Registreringssida
│   └── mina-sidor/         # Skyddade sidor (jobblogg)
├── src/
│   ├── components/         # React-komponenter (JobForm, JobList m.fl.)
│   ├── lib/                # Prisma-klient, auth, job-schema, actions
│   └── types/              # TypeScript-typer
└── prisma/
    ├── schema.prisma        # Databasschema
    └── seed.ts              # Seed-script
```

---

## Databasmodeller

- **User / Account / Session** – hanteras av better-auth
- **Company** – ett företag kopplat till en användare
- **Job** – ett jobb med kunduppgifter och statusflaggor
- **Article** – material/artiklar kopplade till ett jobb
- **Trip** – reslog per datum (sträcka + avstånd)
- **WorkSession** – arbetspass per datum (timmar)

---

## Scripts

```bash
npm run dev        # Starta dev-server
npm run build      # Bygg för produktion
npm run start      # Starta produktionsserver
npm run lint       # Kör ESLint
npm run db:seed    # Seed databasen med testdata
```

---

## Licens

Privat projekt – ingen licens angiven.
