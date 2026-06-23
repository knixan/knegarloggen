"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { KeyRound, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import authClient from "@/lib/auth-client";
import DeleteAccountButton from "./delete-account-button";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

type Subscription = {
  status: string;
  trialEnd: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null;
} | null;

export default function InstallningarKlient({
  subscription,
  hasActiveStripeSub,
}: {
  subscription: Subscription;
  hasActiveStripeSub: boolean;
}) {
  return (
    <div className="space-y-8 max-w-xl">
      <BytLosenordForm />
      <Separator />
      <PrenumerationSection subscription={subscription} />
      <Separator />
      <FarligZonSection hasActiveStripeSub={hasActiveStripeSub} />
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

function formatDatum(date: Date | null) {
  if (!date) return "";
  return format(new Date(date), "d MMMM yyyy", { locale: sv });
}

function PrenumerationSection({ subscription }: { subscription: Subscription }) {
  const [isPending, setIsPending] = useState(false);

  async function startCheckout() {
    setIsPending(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error(data.error ?? "Kunde inte starta betalning");
      }
    } catch {
      toast.error("Något gick fel");
    } finally {
      setIsPending(false);
    }
  }

  async function openPortal() {
    setIsPending(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error("Kunde inte öppna prenumerationsportalen");
      }
    } catch {
      toast.error("Något gick fel");
    } finally {
      setIsPending(false);
    }
  }

  const isTrialExpired =
    subscription?.status === "trialing" &&
    subscription.trialEnd !== null &&
    new Date(subscription.trialEnd) < new Date();

  const renderContent = () => {
    if (!subscription || isTrialExpired) {
      return (
        <>
          <CardDescription>
            {isTrialExpired
              ? "Provperioden har gått ut. Lägg till kortuppgifter för att fortsätta — 99 kr/månad, ingen bindningstid."
              : "Första månaden är gratis utan att ange kortuppgifter. Därefter 99 kr/månad."}
          </CardDescription>
          <CardContent className="pt-0">
            <Button onClick={startCheckout} disabled={isPending}>
              {isPending ? "Laddar..." : "Lägg till betalning"}
            </Button>
          </CardContent>
        </>
      );
    }

    const { status, trialEnd, currentPeriodEnd, cancelAtPeriodEnd } =
      subscription;

    if (status === "trialing") {
      return (
        <>
          <CardDescription>
            Provperioden pågår till {formatDatum(trialEnd)}. Inget kort krävs
            ännu.
          </CardDescription>
          <CardContent className="pt-0">
            <Button onClick={startCheckout} disabled={isPending} variant="outline">
              {isPending ? "Laddar..." : "Lägg till betalning nu"}
            </Button>
          </CardContent>
        </>
      );
    }

    if (status === "active") {
      if (cancelAtPeriodEnd) {
        return (
          <>
            <CardDescription>
              Prenumerationen avslutas {formatDatum(currentPeriodEnd)}. Du har
              tillgång till och med det datumet.
            </CardDescription>
            <CardContent className="pt-0">
              <Button variant="outline" onClick={openPortal} disabled={isPending}>
                {isPending ? "Laddar..." : "Förnya prenumeration"}
              </Button>
            </CardContent>
          </>
        );
      }
      return (
        <>
          <CardDescription>
            Din prenumeration är aktiv. Nästa faktura{" "}
            {formatDatum(currentPeriodEnd)} — 99 kr.
          </CardDescription>
          <CardContent className="pt-0">
            <Button variant="outline" onClick={openPortal} disabled={isPending}>
              {isPending ? "Laddar..." : "Avsluta prenumeration"}
            </Button>
          </CardContent>
        </>
      );
    }

    if (status === "past_due" || status === "unpaid") {
      return (
        <>
          <CardDescription>
            Betalningen misslyckades. Uppdatera dina kortuppgifter för att
            behålla tillgången.
          </CardDescription>
          <CardContent className="pt-0">
            <Button onClick={openPortal} disabled={isPending}>
              {isPending ? "Laddar..." : "Uppdatera betalning"}
            </Button>
          </CardContent>
        </>
      );
    }

    if (status === "canceled") {
      return (
        <>
          <CardDescription>
            Din prenumeration är avslutad. Starta en ny för att få tillgång
            igen.
          </CardDescription>
          <CardContent className="pt-0">
            <Button onClick={startCheckout} disabled={isPending}>
              {isPending ? "Laddar..." : "Starta prenumeration"}
            </Button>
          </CardContent>
        </>
      );
    }

    return null;
  };

  const statusBadge = () => {
    if (!subscription) return null;
    if (isTrialExpired)
      return <Badge variant="destructive">Provperiod utgången</Badge>;
    const { status } = subscription;
    if (status === "trialing")
      return <Badge variant="secondary">Provperiod</Badge>;
    if (status === "active")
      return <Badge className="bg-green-500 text-white">Aktiv</Badge>;
    if (status === "past_due" || status === "unpaid")
      return <Badge variant="destructive">Betalning misslyckad</Badge>;
    if (status === "canceled")
      return <Badge variant="destructive">Avslutad</Badge>;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="h-4 w-4" />
          Prenumeration
          {statusBadge()}
        </CardTitle>
        {renderContent()}
      </CardHeader>
    </Card>
  );
}

function FarligZonSection({
  hasActiveStripeSub,
}: {
  hasActiveStripeSub: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-destructive">Farlig zon</p>
      {hasActiveStripeSub ? (
        <p className="text-xs text-muted-foreground">
          Du måste avsluta din aktiva prenumeration innan du kan ta bort
          kontot. Klicka på &quot;Avsluta prenumeration&quot; ovan.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Raderar ditt konto, alla jobb, kunder, bilder och
            företagsuppgifter permanent.
          </p>
          <div className="mt-2">
            <DeleteAccountButton />
          </div>
        </>
      )}
    </div>
  );
}
