"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Plus,
  Users,
  Building2,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/mina-sidor",
    label: "Mina jobb",
    icon: LayoutDashboard,
    isActive: (p: string) =>
      p === "/mina-sidor" || p.startsWith("/mina-sidor/jobb"),
  },
  {
    href: "/mina-sidor/nytt-jobb",
    label: "Nytt jobb",
    icon: Plus,
    isActive: (p: string) => p.startsWith("/mina-sidor/nytt-jobb"),
  },
  {
    href: "/mina-sidor/kunder",
    label: "Kundregister",
    icon: Users,
    isActive: (p: string) => p.startsWith("/mina-sidor/kunder"),
  },
  {
    href: "/mina-sidor/foretag",
    label: "Företagsuppgifter",
    icon: Building2,
    isActive: (p: string) => p.startsWith("/mina-sidor/foretag"),
  },
  {
    href: "/mina-sidor/installningar",
    label: "Inställningar",
    icon: Settings,
    isActive: (p: string) => p.startsWith("/mina-sidor/installningar"),
  },
];

function NavLinks({
  pathname,
  onClick,
}: {
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {navItems.map(({ href, label, icon: Icon, isActive }) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive(pathname)
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function MinaSidorSidebar() {
  const pathname = usePathname();
  if (pathname.endsWith("/skriv-ut")) return null;
  return (
    <aside className="hidden md:flex w-52 shrink-0 flex-col border-r">
      <div className="sticky top-16 pt-4">
        <NavLinks pathname={pathname} />
      </div>
    </aside>
  );
}

export function MinaSidorMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.endsWith("/skriv-ut")) return null;

  return (
    <>
      <div className="md:hidden sticky top-16 z-30 flex items-center border-b bg-background px-4 py-2">
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Menu className="h-4 w-4 mr-2" />
          Meny
        </Button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-background shadow-xl transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold text-sm">Mina sidor</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Stäng meny"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <NavLinks pathname={pathname} onClick={() => setOpen(false)} />
      </div>
    </>
  );
}
