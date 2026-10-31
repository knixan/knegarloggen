import {
  Home,
  ClipboardList,
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
  /** Visas i mobilens flikrad. Övriga länkar ligger under "Mer". */
  mobileTab?: boolean;
};

// Länkarna visas i navbaren när användaren är inloggad.
export const minaSidorLinks: MinaSidorLink[] = [
  {
    href: "/mina-sidor",
    label: "Översikt",
    icon: Home,
    isActive: (p) => p === "/mina-sidor",
    mobileTab: true,
  },
  {
    href: "/mina-sidor/jobb",
    label: "Mina jobb",
    icon: ClipboardList,
    isActive: (p) => p.startsWith("/mina-sidor/jobb"),
    mobileTab: true,
  },
  {
    href: "/mina-sidor/nytt-jobb",
    label: "Nytt jobb",
    icon: Plus,
    isActive: (p) => p.startsWith("/mina-sidor/nytt-jobb"),
    mobileTab: true,
  },
  {
    href: "/mina-sidor/kunder",
    label: "Kundregister",
    icon: Users,
    isActive: (p) => p.startsWith("/mina-sidor/kunder"),
    mobileTab: true,
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
