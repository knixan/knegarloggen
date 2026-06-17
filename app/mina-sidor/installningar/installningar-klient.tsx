"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { KeyRound, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import authClient from "@/lib/auth-client";
import DeleteAccountButton from "../delete-account-button";

export default function InstallningarKlient() {
  return (
    <div className="space-y-8 max-w-xl">
      <BytLosenordForm />
      <Separator />
      <PrenumerationSection />
      <Separator />
      <FarligZonSection />
    </div>
  );
}

function BytLosenordForm() {
  const [nuvarandeLosenord, setNuvarandeLosenord] = useState("");
  const [nyttLosenord, setNyttLosenord] = useState("");
  const [bekraftaLosenord, setBekraftaLosenord] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (nyttLosenord.length < 10) {
      toast.error("Nytt lösenord måste vara minst 10 tecken");
      return;
    }
    if (nyttLosenord !== bekraftaLosenord) {
      toast.error("Lösenorden matchar inte");
      return;
    }

    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: nuvarandeLosenord,
        newPassword: nyttLosenord,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message ?? "Kunde inte byta lösenord");
        return;
      }

      toast.success("Lösenord bytt");
      setNuvarandeLosenord("");
      setNyttLosenord("");
      setBekraftaLosenord("");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4" />
          Byt lösenord
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nuvarande">Nuvarande lösenord</Label>
            <Input
              id="nuvarande"
              type="password"
              autoComplete="current-password"
              value={nuvarandeLosenord}
              onChange={(e) => setNuvarandeLosenord(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nytt">Nytt lösenord</Label>
            <Input
              id="nytt"
              type="password"
              autoComplete="new-password"
              value={nyttLosenord}
              onChange={(e) => setNyttLosenord(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Minst 10 tecken</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bekrafta">Bekräfta nytt lösenord</Label>
            <Input
              id="bekrafta"
              type="password"
              autoComplete="new-password"
              value={bekraftaLosenord}
              onChange={(e) => setBekraftaLosenord(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sparar..." : "Byt lösenord"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PrenumerationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="h-4 w-4" />
          Prenumeration
          <Badge variant="secondary" className="ml-1">Kommer snart</Badge>
        </CardTitle>
        <CardDescription>
          Knegarloggen kommer att kosta 99 kr/månad. Under betaperioden är tjänsten gratis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Beta – kostnadsfri tillgång</p>
          <p className="mt-1">Du har full tillgång till alla funktioner utan kostnad under betaperioden. Betalning aktiveras med förvarning innan lansering.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FarligZonSection() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-destructive">Farlig zon</p>
      <p className="text-xs text-muted-foreground">
        Raderar ditt konto, alla jobb, kunder, bilder och företagsuppgifter permanent.
      </p>
      <div className="mt-2">
        <DeleteAccountButton />
      </div>
    </div>
  );
}
