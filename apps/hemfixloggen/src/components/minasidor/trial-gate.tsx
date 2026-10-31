"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

type Props = {
  /** Från evaluateSubscription (lib/subscription.ts) – samma regel som actions. */
  isExpired: boolean;
};

export function TrialGate({ isExpired }: Props) {
  const pathname = usePathname();
  // Inställningar måste gå att nå – det är där prenumerationen aktiveras.
  if (!isExpired || pathname.startsWith("/mina-sidor/installningar")) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-accent" />
            <CardTitle>Din provperiod är avslutad</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Din 30-dagars provperiod har löpt ut. Aktivera en prenumeration för
            att fortsätta använda Hemfixloggen och komma åt dina uppdrag.
          </p>
          <p className="font-semibold">99 kr/månad – avsluta när du vill.</p>
          <Link
            href="/mina-sidor/installningar"
            className={buttonVariants({ className: "w-full" })}
          >
            Aktivera prenumeration
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
