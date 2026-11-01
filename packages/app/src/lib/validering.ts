// Rena kontrollfunktioner för server actions – utan databas, så att de kan testas.
import type { z } from "zod";

export type UploadedFile = { url: string; key: string };

export function ids<T extends { id?: string }>(rows: T[]) {
  return rows.flatMap((row) => (row.id ? [row.id] : []));
}

// Id:n kommer från klienten – varje id som skickas in måste tillhöra jobbet.
export function allBelongToJob<T extends { id?: string }>(
  rows: T[],
  existing: { id: string }[],
) {
  const known = new Set(existing.map((row) => row.id));
  return ids(rows).every((id) => known.has(id));
}

export function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Ogiltiga uppgifter";
}

// UploadThing-URL:er har formen https://<app>.ufs.sh/f/<key> (äldre: utfs.io).
export function isUploadThingUrl({ url, key }: UploadedFile) {
  if (!key || key.length > 200) return false;
  try {
    const u = new URL(url);
    const hostOk = u.hostname === "utfs.io" || u.hostname.endsWith(".ufs.sh");
    return u.protocol === "https:" && hostOk && u.pathname === `/f/${key}`;
  } catch {
    return false;
  }
}
