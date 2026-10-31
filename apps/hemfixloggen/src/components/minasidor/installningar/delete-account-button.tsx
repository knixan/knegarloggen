"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { raderaKonto } from "@/lib/uppdrag-actions";

export function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await raderaKonto();
    if (result.ok) {
      window.location.href = "/";
    } else {
      toast.error(
        ("error" in result && result.error) || "Kunde inte radera kontot",
      );
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Radera mitt konto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Radera konto permanent?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Alla dina uppdrag, kunder och företagsuppgifter raderas permanent.
              Detta går inte att ångra.
            </span>
            <span className="block">
              Enligt bokföringslagen ska fakturor och underlag sparas i 7 år.
              Ladda ner PDF:er för dina fakturerade uppdrag innan du raderar
              kontot.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Raderar..." : "Ja, radera allt"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
