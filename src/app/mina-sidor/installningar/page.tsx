import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import InstallningarKlient from "./installningar-klient";

export const metadata = { title: "Inställningar – Knegarloggen" };

export default async function InstallningarPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Inställningar</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {session.user.email}
        </p>
      </div>
      <InstallningarKlient />
    </main>
  );
}
