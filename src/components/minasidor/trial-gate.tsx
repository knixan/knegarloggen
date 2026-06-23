"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrialGate({
  isExpired,
  daysLeft,
  children,
}: {
  isExpired: boolean;
  daysLeft: number;
  children: React.ReactNode;
}) {
  const [isPending, setIsPending] = useState(false);

  async function startCheckout() {
    setIsPending(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error("Kunde inte starta betalning");
      }
    } catch {
      toast.error("Något gick fel");
    } finally {
      setIsPending(false);
    }
  }

  if (isExpired) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Provperioden har gått ut</h2>
            <p className="text-sm text-muted-foreground">
              Lägg till betalningsuppgifter för att fortsätta använda
              Knegarloggen. 99 kr/månad, ingen bindningstid.
            </p>
          </div>
          <Button
            onClick={startCheckout}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Laddar..." : "Lägg till betalning"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {daysLeft <= 7 && daysLeft > 0 && (
        <div className="mx-4 mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Provperioden slutar om {daysLeft} {daysLeft === 1 ? "dag" : "dagar"}
            .{" "}
            <button
              onClick={startCheckout}
              disabled={isPending}
              className="underline font-medium hover:no-underline disabled:opacity-50"
            >
              {isPending ? "Laddar..." : "Lägg till betalning"}
            </button>
          </span>
        </div>
      )}
      {children}
    </>
  );
}
