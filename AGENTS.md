<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Regler för AI-agenter i det här repot

Skriv på **svenska**: UI-texter, kommentarer, kanban-kort och commit-meddelanden. Variabel- och funktionsnamn följer koden runt omkring (mest svenska, vissa engelska).

## Struktur

Tre produkter, en kodbas:

| App                 | Målgrupp              | Skatteavdrag |
| ------------------- | --------------------- | ------------ |
| `apps/knegarloggen` | Hantverkare           | ROT 30 %     |
| `apps/hemfixloggen` | Hushållsnära tjänster | RUT 50 %     |
| `apps/giggerloggen` | Frilansare/konsulter  | inget        |

- **`packages/app`** – allt gemensamt: mina sidor, översikt, faktura/PDF, kunder, admin, inloggning, villkor, server actions, auth, Stripe, e-post, uppladdning, Prisma-schema och migreringar.
- **`packages/app/src/brand.ts`** – det enda stället där apparna skiljer sig i logik: namn, logga, målgrupp, skatteavdrag. Väljs med `NEXT_PUBLIC_APP` i appens `next.config.ts`.
- **`apps/<app>`** – bara startsida (`src/app/page.tsx` + `src/components/site/`), färger (`globals.css`), bilder (`public/`) och tunna route-filer som exporterar från `@knegarloggen/app/routes/...`.
- **`packages/ui`** (shadcn), **`packages/auth`** (`createAuth`), **`packages/stripe`**, **`packages/config`** (tsconfig/eslint).

### Gör så här

- Ny funktion → bygg den i `packages/app`. Lägg aldrig app-specifik logik i `apps/`.
- Ny sida → skapa den i `packages/app/src/routes/...` och lägg en tunn route-fil i **alla tre** apparna (`export { default } from "@knegarloggen/app/routes/..."`).
- Skillnad mellan apparna → lägg till ett fält i `brand.ts`. Kopiera aldrig kod mellan apparna.
- UI-komponenter importeras direkt från `@knegarloggen/ui/<komponent>`.

## Domänregler (påverkar pengar och säkerhet)

- **ROT och RUT blandas aldrig.** En app har ett `brand.skatteavdrag` (ROT, RUT eller `null`). Visa inga ROT/RUT-fält när det är `null`.
- **Alla belopp räknas i `beräknaSummering`** (`packages/app/src/lib/job-schema.ts`). Fakturans innehåll byggs i `fakturaData` (`components/minasidor/faktura/faktura-data.ts`). Förhandsvisning och PDF ritar bara upp det – räkna aldrig belopp i en komponent.
- **Server actions** (`lib/job-actions.ts` m.fl., `"use server"`) är bara för **skrivningar** och ska alltid:
  1. kräva inloggning och aktiv prenumeration (`requireActiveUser`/`requireCompany`) – undantag: radera konto,
  2. validera indata med zod på servern (datum med `datumSchema`, övre gränser på tal och listor),
  3. kontrollera ägarskap (`companyId`) för varje id från klienten, även underrader och `customerId`,
  4. validera uppladdade filer med `validateNewUploads(files, userId)` – filen måste vara registrerad i tabellen `Uppladdning` av samma användare (görs i `lib/uploadthing.ts`).
- **Läsningar** ligger i `lib/jobb-data.ts` (vanlig servermodul, inte `"use server"`) och används från serverkomponenter. En läsning får aldrig skapa eller ändra något.
- **Rena regler** som går att testa ligger utan databas: `lib/prenumeration-regel.ts` (provperiod, checkout, Stripe-appfilter) och `lib/validering.ts` (ägarskap för rader, UploadThing-URL).
- **Prenumeration:** provperioden skapas i better-auths `databaseHooks.user.create.after` (`onUserCreated` → `skapaProvperiod`). Samma regel (`evaluateSubscription`) används i spärren, inställningarna och actions.
- **Stripe:** apparna delar Stripe-konto. Checkout märker allt med `metadata.app = brand.id`, och webhooken ignorerar andra appars händelser (`tillhorAppen`). En löpande prenumeration får inte starta en ny checkout (`kanStartaCheckout`).
- **Faktura:** att visa en faktura kräver bara inloggning. Fakturanummer delas ut när fakturan skapas (`faktureraJobb`) eller när jobbet sparas som fakturerat – aldrig vid förhandsvisning.
- **UploadThing:** apparna delar UploadThing-app. Radera bara filer som finns i den här appens databas – aldrig "allt som inte används".
- **`role`** får aldrig kunna sättas av klienten (`input: false` i `packages/auth`). Roller ändras bara via adminsidan eller `pnpm db:admin`.
- Personnummer visas bara där det behövs (ROT/RUT, faktura).

## Dokumentation – gissa inte

Versionerna är nyare än det du lärt dig. Slå upp i dokumentationen innan du använder ett API du är osäker på, och **alltid** när det gäller auth, betalning, databas eller säkerhet. Läs bara den sida som behövs – ladda inte in hela filer.

| Bibliotek   | Version | Dokumentation                                         |
| ----------- | ------- | ----------------------------------------------------- |
| Next.js     | 16.2    | `node_modules/next/dist/docs/` (lokalt, rätt version) |
| better-auth | 1.6     | https://better-auth.com/docs/1.6/llms.txt             |
| Prisma      | 7       | https://www.prisma.io/llms.txt                        |
| zod         | 4       | https://zod.dev/llms.txt                              |
| shadcn/ui   | –       | https://ui.shadcn.com/llms.txt                        |
| Stripe      | 22      | https://docs.stripe.com/llms.txt                      |
| Resend      | 6       | https://resend.com/llms.txt                           |
| react-pdf   | –       | https://react-pdf.org/llms.txt                        |
| UploadThing | 7       | https://docs.uploadthing.com (ingen llms.txt)         |

## Kommandon

```bash
pnpm dev:knegarloggen        # port 3000 (giggerloggen 3001, hemfixloggen 3002)
pnpm type-check              # alla appar och paket
pnpm lint
pnpm format                  # Prettier på hela repot (format:check i CI)
pnpm test                    # vitest i packages/app
pnpm build                   # alla tre apparna

# Databas – körs i apps/<app>, använder den appens .env
pnpm db:migrate              # ny migrering (schema i packages/app/prisma)
pnpm db:deploy
pnpm db:reset                # raderar ALL data – se Databas nedan
pnpm db:admin <e-post>       # gör ett konto till admin
```

## Klart betyder

1. `pnpm format:check`, `pnpm type-check`, `pnpm lint` och `pnpm test` går igenom. Filer du ändrar formateras automatiskt av hooken – kör `pnpm format` om du skapat filer på annat sätt (t.ex. med skript). Kör `pnpm build` vid ändringar i routes, konfig, beroenden eller sådant som påverkar flera appar.
2. Nya eller ändrade beräkningar (belopp, moms, ROT/RUT, validering) har tester i `packages/app/src/**/*.test.ts`.
3. Ändringar i UI: säg tydligt vad du **inte** har kunnat testa (t.ex. inloggade sidor).
4. Kanban är uppdaterad (se nedan).
5. Du har skrivit ett commit-meddelande.

## Git

- **Committa och pusha aldrig.** Användaren committar själv. En hook stoppar `git commit` och `git push`.
- Avsluta med ett commit-meddelande på svenska: kort rubrik, tom rad, punktlista. Sist: `Co-Authored-By`-raden från systemet.
- Jobbet sker direkt på `main`. CI (`.github/workflows/ci.yml`) kör type-check, lint, test och build på varje push.

## Databas

- Ett schema för alla appar: `packages/app/prisma/schema.prisma`. Varje app har en egen databas (`DATABASE_URL` i appens `.env`).
- **Idag finns bara testdata** – schemat får göras om och databaserna nollställas. Säg ändå till när en ändring raderar data.
- **Efter lansering (#35 Stripe live) gäller:** migreringar ska bevara data (döp om/kopiera, droppa aldrig), backup först, testa mot en kopia.
- `prisma migrate reset` kräver alltid uttryckligt godkännande från användaren i ett nytt meddelande.

## Kanban

GitHub Project 15 (`knixan`, "@Loggen-apparna"), repo `knixan/knegarloggen`.

- Uppdatera korten när du blir klar med något: bocka av, flytta status, skapa nya kort för det som blir kvar.
- Varje kort ska ha fältet **App**: `Gemensamt` för det som byggs i `packages/`, annars appens namn.
- Skriv kortets body i en fil och använd `--body-file` (långa heredocs i bash går sönder).
- Flytta inte kort, skapa inte kort och stäng inte issues utan att användaren har bett om kanban-uppdatering eller att det ingår i uppgiften.

| Vad         | ID                                                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Projekt     | `PVT_kwHODHG13M4BYlIN`                                                                                                             |
| Status-fält | `PVTSSF_lAHODHG13M4BYlINzhTp-T0` – Backlog `f75ad846`, In progress `47fc9ee4`, Done `98236657`                                     |
| App-fält    | `PVTSSF_lAHODHG13M4BYlINzhn_Dw0` – Knegarloggen `2f377aff`, Giggerloggen `603f3456`, Hemfixloggen `37dbdb12`, Gemensamt `9d751719` |

```bash
gh issue create -R knixan/knegarloggen --title "…" --body-file kort.md
gh project item-add 15 --owner knixan --url <issue-url> --format json --jq .id
gh project item-edit --project-id PVT_kwHODHG13M4BYlIN --id <item-id> \
  --field-id PVTSSF_lAHODHG13M4BYlINzhTp-T0 --single-select-option-id f75ad846
```

Att sätta status Done stänger issuen automatiskt.
