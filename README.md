# Knegarloggen 🔧

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Privat-gray?style=flat-square)](LICENSE)

Effektivisera din vardag som hantverkare. Håll koll på kunder, artiklar, resor, arbetstid och fakturastatus – allt samlat på ett och samma ställe.

---

## 📌 Innehållsförteckning
- [Om projektet](#om-projektet)
- [Funktioner](#funktioner)
- [Teknisk stack](#teknisk-stack)
- [Kom igång](#kom-igång)
- [Projektstruktur](#projektstruktur)
- [Databasmodeller](#databasmodeller)
- [Scripts](#scripts)
- [Roadmap](#roadmap)

---

## 🛠 Om projektet

Knegarloggen är en webbaserad applikation byggd för mindre hantverksföretag. Du loggar varje jobb med kunduppgifter, material/artiklar, körda sträckor och arbetstid – och bockar av när jobbet är utfört, fakturerat och betalt. Stöd för ROT-avdrag ingår.

Appen är byggd med Next.js, Prisma och PostgreSQL, med inloggning via [better-auth](https://better-auth.dev/).

---

## ✨ Funktioner

- 💼 **Jobbhantering** – Skapa, redigera och organisera jobb per företag.
- 📦 **Artiklar** – Hantera material med artikelnummer, antal och priser.
- 🚗 **Reslogg** – Logga körda sträckor och avstånd knutna till specifika datum.
- ⏱️ **Arbetstid** – Enkel registrering av arbetspass i timmar.
- ✅ **Statuskontroll** – Tydliga flaggor för Utfört, ROT, Fakturerat och Betalt.
- 📊 **Livesummering** – Automatiska beräkningar av totaler för artiklar, resor och tid.
- 🔐 **Säker Auth** – Robust autentisering via better-auth (E-post/Lösenord).
- 🏢 **Multi-företag** – Stöd för att hantera flera olika företag på samma konto.

---

## 💻 Teknisk stack

| Lager     | Teknik                      |
| --------- | --------------------------- |
| Framework | Next.js 15 (App Router)     |
| Språk     | TypeScript                  |
| Styling   | Tailwind CSS v4 + shadcn/ui |
| Formulär  | React Hook Form + Zod       |
| ORM       | Prisma 6                    |
| Databas   | PostgreSQL                  |
| Auth      | better-auth                 |
| Runtime   | Node.js                     |

---

## 🚀 Kom igång

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
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/knegarloggen"

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

## 📂 Projektstruktur

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
