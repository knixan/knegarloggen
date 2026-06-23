import Link from "next/link";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BekraftaEpostPage() {
  return (
    <main className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <Mail className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Kolla din e-post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Vi har skickat en verifieringslänk till din e-postadress. Klicka på
            länken i mailet för att aktivera ditt konto.
          </p>
          <p className="text-sm text-muted-foreground">
            Kom ihåg att kolla skräpposten om mailet inte dyker upp inom någon
            minut.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/logga-in">Tillbaka till inloggning</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
