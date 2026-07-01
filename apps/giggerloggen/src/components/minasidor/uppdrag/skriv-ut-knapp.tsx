"use client";

export function SkrivUtKnapp() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium"
    >
      Skriv ut / Spara som PDF
    </button>
  );
}
