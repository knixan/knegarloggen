"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoggaInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const result = await signIn.email({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });
    setLoading(false);
    if (result.error) {
      if (result.error.status === 403) {
        toast.error(
          "Du behöver verifiera din e-postadress innan du kan logga in. Kolla din inkorg.",
        );
      } else {
        toast.error("Fel e-post eller lösenord");
      }
      return;
    }
    router.push("/mina-sidor");
    router.refresh();
  }

  return (
    <main className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Logga in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loggar in…" : "Logga in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Inget konto?{" "}
            <Link
              href="/registrera"
              className="underline hover:text-foreground"
            >
              Registrera dig
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
