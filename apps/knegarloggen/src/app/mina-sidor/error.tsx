"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h1 className="text-xl font-bold">Något gick fel</h1>
      <p className="text-sm text-muted-foreground">
        Ett oväntat fel uppstod när sidan laddades. Försök igen, eller gå
        tillbaka till startsidan om problemet kvarstår.
      </p>
      <Button onClick={reset}>Försök igen</Button>
    </main>
  );
}
