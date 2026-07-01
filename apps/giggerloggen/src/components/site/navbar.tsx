import Link from "next/link";
import { User } from "lucide-react";
import { ModeToggle } from "@/components/button/theme-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Giggerloggen</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link
            href="/#funktioner"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Funktioner
          </Link>
          <Link
            href="/#priser"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Priser
          </Link>
          <Link
            href="/#om-oss"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Om oss
          </Link>
          <Link
            href="/#blogg"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Blogg
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link
            href="/logga-in"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "gap-2",
            )}
          >
            <User className="h-4 w-4" />
            Logga in
          </Link>
          <Link href="/registrera" className={buttonVariants({ variant: "default" })}>
            Kom igång gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
