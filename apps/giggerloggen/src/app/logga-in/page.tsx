"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoggaInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const { error } = await signIn.email({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });

    if (error) {
      toast.error("Fel e-postadress eller lösenord");
      setLoading(false);
    } else {
      router.push("/mina-sidor");
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
            <CardTitle>Logga in</CardTitle>
            <CardDescription>Välkommen tillbaka!</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">E-postadress</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Lösenord</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loggar in..." : "Logga in"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Inget konto?{" "}
                <Link href="/registrera" className="text-primary hover:underline">
                  Registrera dig
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
