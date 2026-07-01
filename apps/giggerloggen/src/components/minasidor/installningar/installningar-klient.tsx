"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeleteAccountButton } from "./delete-account-button";
import { sparaLogo } from "@/lib/uppdrag-actions";
import { useUploadThing } from "@/lib/uploadthing-client";
import { Upload, ImageIcon } from "lucide-react";

type Props = {
  user: { name: string; email: string };
  company: { logoUrl: string | null; logoKey: string | null } | null;
  subscription: {
    status: string;
    trialEnd: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  } | null;
};

function statusLabel(status: string) {
  const map: Record<string, string> = {
    trialing: "Provperiod",
    active: "Aktiv",
    canceled: "Avslutad",
    past_due: "Försenad betalning",
  };
  return map[status] ?? status;
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "active") return "default";
  if (status === "trialing") return "secondary";
  return "destructive";
}

export function InstallningarKlient({ user, company, subscription }: Props) {
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl ?? null);
  const [uploading, setUploading] = useState(false);

  const { startUpload } = useUploadThing("companyLogo", {
    onClientUploadComplete: async (res) => {
      if (res?.[0]) {
        await sparaLogo(res[0].ufsUrl, res[0].key);
        setLogoUrl(res[0].ufsUrl);
        toast.success("Logga uppladdad!");
      }
      setUploading(false);
    },
    onUploadError: () => {
      toast.error("Uppladdning misslyckades");
      setUploading(false);
    },
  });

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await startUpload([file]);
  }

  async function handleSubscriptionAction() {
    if (subscription?.status === "active") {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } else {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    }
  }

  return (
    <div className="space-y-6">
      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Kontoinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Namn</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">E-post</span>
            <span className="font-medium">{user.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Logga</CardTitle>
          <CardDescription>Visas på dina fakturor. Max 2 MB, PNG/JPG/WebP.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoUrl && (
            <div className="rounded-lg border p-3 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Företagslogga" className="max-h-16 max-w-32 object-contain" />
            </div>
          )}
          {!logoUrl && (
            <div className="flex h-16 w-32 items-center justify-center rounded-lg border border-dashed">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center gap-2 h-7 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium cursor-pointer hover:bg-muted transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Laddar upp..." : "Ladda upp logga"}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleLogoChange}
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Prenumeration</CardTitle>
          <CardDescription>99 kr/månad efter provperioden</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={statusVariant(subscription.status)}>
                  {statusLabel(subscription.status)}
                </Badge>
              </div>
              {subscription.trialEnd && subscription.status === "trialing" && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Provperiod slutar</span>
                  <span>{subscription.trialEnd.toLocaleDateString("sv-SE")}</span>
                </div>
              )}
              {subscription.currentPeriodEnd && subscription.status === "active" && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? "Avslutas" : "Förnyas"}
                  </span>
                  <span>{subscription.currentPeriodEnd.toLocaleDateString("sv-SE")}</span>
                </div>
              )}
              <Button onClick={handleSubscriptionAction} variant="outline" size="sm">
                {subscription.status === "active" ? "Hantera prenumeration" : "Aktivera prenumeration"}
              </Button>
            </>
          ) : (
            <Button onClick={handleSubscriptionAction} size="sm">
              Aktivera prenumeration
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Riskzon</CardTitle>
          <CardDescription>Dessa åtgärder går inte att ångra.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
