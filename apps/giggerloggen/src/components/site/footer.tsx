import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-10 px-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Giggerloggen. Alla rättigheter förbehållna.</p>
        <div className="flex gap-6">
          <Link href="/integritet" className="hover:text-foreground transition-colors">
            Integritetspolicy
          </Link>
          <Link href="/villkor" className="hover:text-foreground transition-colors">
            Användarvillkor
          </Link>
        </div>
      </div>
    </footer>
  );
}
