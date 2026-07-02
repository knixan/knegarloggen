export { cn } from "@knegarloggen/ui/lib/utils";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatCurrency(amount: number): string {
  return (
    amount.toLocaleString("sv-SE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " kr"
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("sv-SE");
}
