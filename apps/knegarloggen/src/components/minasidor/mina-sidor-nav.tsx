import {
  LayoutDashboard,
  Plus,
  Users,
  Building2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type MinaSidorLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

// Länkarna visas i navbaren när användaren är inloggad.
export const minaSidorLinks: MinaSidorLink[] = [
  {
    href: "/mina-sidor",
    label: "Mina jobb",
    icon: LayoutDashboard,
    isActive: (p) => p === "/mina-sidor" || p.startsWith("/mina-sidor/jobb"),
  },
  {
    href: "/mina-sidor/nytt-jobb",
    label: "Nytt jobb",
    icon: Plus,
    isActive: (p) => p.startsWith("/mina-sidor/nytt-jobb"),
  },
  {
    href: "/mina-sidor/kunder",
    label: "Kundregister",
    icon: Users,
    isActive: (p) => p.startsWith("/mina-sidor/kunder"),
  },
  {
    href: "/mina-sidor/foretag",
    label: "Företagsuppgifter",
    icon: Building2,
    isActive: (p) => p.startsWith("/mina-sidor/foretag"),
  },
  {
    href: "/mina-sidor/installningar",
    label: "Inställningar",
    icon: Settings,
    isActive: (p) => p.startsWith("/mina-sidor/installningar"),
  },
];

/** Skickas efter att företagsuppgifter eller logga sparats, så navbaren uppdateras. */
export const COMPANY_UPDATED_EVENT = "company-updated";
