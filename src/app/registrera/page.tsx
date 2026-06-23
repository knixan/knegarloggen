"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegistreraPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;

    if (password !== confirm) {
      toast.error("Lösenorden matchar inte");
      return;
    }

    setLoading(true);
    const result = await signUp.email({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error.message ?? "Registrering misslyckades");
      return;
    }
    router.push("/registrera/bekrafta-epost");
  }

  return (
    <main className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Skapa konto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Namn</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Anna Andersson"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="din@epost.se"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Lösenord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Minst 6 tecken"
                minLength={6}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Bekräfta lösenord</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                required
                placeholder="••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Skapar konto…" : "Registrera"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Har du redan ett konto?{" "}
            <Link href="/logga-in" className="underline hover:text-foreground">
              Logga in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
