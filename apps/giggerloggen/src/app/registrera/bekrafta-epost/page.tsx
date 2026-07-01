import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function BekraftaEpostPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Giggerloggen
          </Link>
        </div>
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Kontrollera din e-post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Vi har skickat ett bekräftelsemejl till din e-postadress.
              Klicka på länken i mejlet för att aktivera ditt konto.
            </p>
            <p>
              Inget mejl?{" "}
              <Link href="/registrera" className="text-primary hover:underline">
                Försök igen
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
