"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/auth-server";
import { ModeToggle } from "@/components/button/theme-button";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Plus,
  Users,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/mina-sidor", label: "Översikt", icon: LayoutDashboard, exact: true },
  { href: "/mina-sidor/nytt-uppdrag", label: "Nytt uppdrag", icon: Plus },
  { href: "/mina-sidor/kunder", label: "Kunder", icon: Users },
  { href: "/mina-sidor/foretag", label: "Företag", icon: Building2 },
  { href: "/mina-sidor/installningar", label: "Inställningar", icon: Settings },
];

export function MinaSidorNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOutAction();
    router.push("/");
  }

  return (
    <aside className="flex w-64 flex-col border-r bg-sidebar min-h-screen">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="font-bold text-lg text-primary">
          Giggerloggen
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-3 py-4 flex items-center justify-between gap-2">
        <ModeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="flex-1 justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logga ut
        </Button>
      </div>
    </aside>
  );
}
