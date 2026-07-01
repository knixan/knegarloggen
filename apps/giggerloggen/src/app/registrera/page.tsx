"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpServer } from "@/lib/auth-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegistreraPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;

    if (password !== confirm) {
      toast.error("Lösenorden matchar inte");
      setLoading(false);
      return;
    }

    const result = await signUpServer({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password,
    });

    setLoading(false);
    if (result.ok) {
      router.push("/registrera/bekrafta-epost");
    } else {
      toast.error(result.error ?? "Registrering misslyckades");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Giggerloggen
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Skapa konto</CardTitle>
            <CardDescription>30 dagars gratis provperiod, ingen kortuppgift krävs.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Namn</Label>
                <Input id="name" name="name" required autoComplete="name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">E-postadress</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Lösenord</Label>
                <Input id="password" name="password" type="password" required minLength={10} autoComplete="new-password" />
                <p className="text-xs text-muted-foreground">Minst 10 tecken</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm">Bekräfta lösenord</Label>
                <Input id="confirm" name="confirm" type="password" required autoComplete="new-password" />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Skapar konto..." : "Skapa konto"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Har du redan ett konto?{" "}
                <Link href="/logga-in" className="text-primary hover:underline">
                  Logga in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
