"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  ShieldCheck,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import authClient, { useSession } from "@/lib/auth-client";
import { getNavbarCompany } from "@/lib/navbar-actions";
import {
  minaSidorLinks,
  COMPANY_UPDATED_EVENT,
} from "@/components/minasidor/mina-sidor-nav";
import { ModeToggle } from "../button/theme-button";

// ============================================================================
// Types
// ============================================================================

type LinkItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  isActive?: (pathname: string) => boolean;
  mobileTab?: boolean;
};

const isLinkActive = (link: LinkItem, pathname: string) =>
  link.isActive ? link.isActive(pathname) : pathname === link.href;

interface NavbarProps {
  links?: LinkItem[];
  showThemeToggle?: boolean;
}

// ============================================================================
// Custom Hooks
// ============================================================================

const useAuth = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const isAuthenticated = !!session?.user;
  const user = session?.user ?? null;
  const isAdmin = user?.role === "admin";

  const handleLogin = useCallback(() => {
    router.push("/logga-in");
  }, [router]);

  const handleRegister = useCallback(() => {
    router.push("/registrera");
  }, [router]);

  const handleLogout = useCallback(async () => {
    await authClient.signOut();
    router.refresh();
    router.push("/");
  }, [router]);

  return {
    isAuthenticated,
    user,
    isAdmin,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};

// ============================================================================
// Subcomponents
// ============================================================================

// Desktop Navigation Links
interface NavLinksProps {
  links: LinkItem[];
  currentPath: string;
}

const NavLinks: React.FC<NavLinksProps> = ({ links, currentPath }) => (
  <div className="flex items-center gap-5">
    {links.map((link) => {
      const isActive = isLinkActive(link, currentPath);
      const Icon = link.icon;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors ${
            isActive
              ? "text-gray-900 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
          {link.label}
        </Link>
      );
    })}
  </div>
);

// Mobile Navigation Links
interface MobileNavLinksProps {
  links: LinkItem[];
  currentPath: string;
  onNavigate: () => void;
}

const MobileNavLinks: React.FC<MobileNavLinksProps> = ({
  links,
  currentPath,
  onNavigate,
}) => (
  <>
    {links.map((link) => {
      const isActive = isLinkActive(link, currentPath);
      const Icon = link.icon;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
        >
          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
          {link.label}
        </Link>
      );
    })}
  </>
);

// Mobil flikrad längst ner (inloggad) – bara ikoner, som i en vanlig app.
// Id:t används i root-layouten för att ge sidan utrymme under raden.
interface MobileTabBarProps {
  links: LinkItem[];
  currentPath: string;
  moreActive: boolean;
  moreOpen: boolean;
  onMore: () => void;
}

const tabClass = (isActive: boolean) =>
  `flex flex-1 items-center justify-center transition-colors ${
    isActive
      ? "text-gray-900 dark:text-white"
      : "text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
  }`;

const TabIcon = ({
  icon: Icon,
  isActive,
}: {
  icon: LucideIcon;
  isActive: boolean;
}) => (
  <span
    className={`flex h-10 w-14 items-center justify-center rounded-full ${
      isActive ? "bg-gray-100 dark:bg-gray-800" : ""
    }`}
  >
    <Icon className="h-6 w-6" aria-hidden="true" />
  </span>
);

const MobileTabBar: React.FC<MobileTabBarProps> = ({
  links,
  currentPath,
  moreActive,
  moreOpen,
  onMore,
}) => (
  <nav
    id="mobil-flikrad"
    aria-label="Mina sidor"
    className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-white/80 xl:hidden dark:bg-gray-950/95"
  >
    <ul className="flex h-16 items-stretch justify-around">
      {links.map((link) => {
        const isActive = isLinkActive(link, currentPath);
        return (
          <li key={link.href} className="flex flex-1">
            <Link
              href={link.href}
              aria-label={link.label}
              title={link.label}
              aria-current={isActive ? "page" : undefined}
              className={tabClass(isActive)}
            >
              {link.icon && <TabIcon icon={link.icon} isActive={isActive} />}
            </Link>
          </li>
        );
      })}
      <li className="flex flex-1">
        <button
          type="button"
          onClick={onMore}
          aria-label="Mer"
          title="Mer"
          aria-expanded={moreOpen}
          className={tabClass(moreActive || moreOpen)}
        >
          <TabIcon icon={MoreHorizontal} isActive={moreActive || moreOpen} />
        </button>
      </li>
    </ul>
  </nav>
);

// Auth Buttons (Desktop)
interface AuthButtonsProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  isAuthenticated,
  isAdmin,
  onLogin,
  onRegister,
  onLogout,
}) => {
  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={onLogin}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors dark:text-gray-300"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          <span>Logga in</span>
        </button>
        <button
          onClick={onRegister}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Registrera
        </button>
      </>
    );
  }

  return (
    <>
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors dark:text-yellow-400 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>Admin</span>
        </Link>
      )}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span>Logga ut</span>
      </button>
    </>
  );
};

// Mobile Auth Section
interface MobileAuthSectionProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { name?: string; email?: string } | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onNavigate: () => void;
}

const MobileAuthSection: React.FC<MobileAuthSectionProps> = ({
  isAuthenticated,
  isAdmin,
  user,
  onLogin,
  onRegister,
  onLogout,
  onNavigate,
}) => {
  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={() => {
            onLogin();
            onNavigate();
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          <span>Logga in</span>
        </button>
        <button
          onClick={() => {
            onRegister();
            onNavigate();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors dark:bg-white dark:text-black"
        >
          Registrera
        </button>
      </>
    );
  }

  return (
    <>
      {user && (
        <div className="px-4 py-2 text-sm border-b mb-2">
          <p className="font-medium">{user.name}</p>
          <p className="text-gray-500 text-xs">{user.email}</p>
        </div>
      )}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors dark:text-yellow-400 dark:bg-yellow-900/30"
          onClick={onNavigate}
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>Admin</span>
        </Link>
      )}
      <button
        onClick={async () => {
          await onLogout();
          onNavigate();
        }}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span>Logga ut</span>
      </button>
    </>
  );
};

const Navbar: React.FC<NavbarProps> = ({
  links = [
    { href: "/", label: "Hem" },
    { href: "/integritet", label: "Integritet" },
    { href: "/villkor", label: "Villkor" },
  ],
  showThemeToggle = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const {
    isAuthenticated,
    user,
    isAdmin,
    handleLogin,
    handleRegister,
    handleLogout,
  } = useAuth();

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Företagets namn och logga visas när man är inloggad. Hämtas om när
  // företagsuppgifterna sparas (COMPANY_UPDATED_EVENT).
  const [company, setCompany] = useState<{
    name: string;
    logoUrl: string;
  } | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const load = () =>
      getNavbarCompany()
        .then((c) => {
          if (!cancelled) setCompany(c);
        })
        .catch(() => {});
    load();
    window.addEventListener(COMPANY_UPDATED_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(COMPANY_UPDATED_EVENT, load);
    };
  }, [userId]);

  const navLinks = isAuthenticated ? minaSidorLinks : links;
  // Mobil inloggad: flikraden har huvudlänkarna, resten ligger under "Mer".
  const tabLinks = navLinks.filter((l) => l.mobileTab);
  const moreLinks = isAuthenticated
    ? navLinks.filter((l) => !l.mobileTab)
    : navLinks;
  // Inloggad: bara loggan om företaget har en, annars bara företagsnamnet.
  const companyLogo = isAuthenticated && company?.logoUrl ? company : null;
  const companyName = isAuthenticated ? company?.name : undefined;

  // Inloggad har fler länkar – visa hela menyn först från xl-bredd.
  // Samma brytpunkt som flikraden (MobileTabBar) och body-paddingen i layout.tsx.
  const desktopClass = isAuthenticated
    ? "hidden xl:flex xl:items-center xl:gap-5"
    : "hidden md:flex md:items-center md:gap-6";
  const mobileClass = isAuthenticated ? "xl:hidden" : "md:hidden";

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-gray-950/95"
        aria-label="Huvudnavigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex min-w-0 items-center">
              <Link
                href={isAuthenticated ? "/mina-sidor" : "/"}
                onClick={closeMobileMenu}
                className="flex min-w-0 items-center gap-2 text-xl font-black hover:text-gray-600 transition-colors"
              >
                {companyLogo ? (
                  <Image
                    src={companyLogo.logoUrl}
                    alt={companyLogo.name}
                    width={160}
                    height={64}
                    className="h-12 w-auto max-w-35 object-contain"
                    priority
                  />
                ) : companyName ? (
                  <span className="truncate text-lg font-semibold">
                    {companyName}
                  </span>
                ) : (
                  <>
                    <Image
                      src="/knegaloggen-logga.png"
                      alt="KnegarLoggen"
                      width={100}
                      height={100}
                      className="h-16 w-16 object-contain"
                      priority
                    />
                    <span>
                      <span className="text-red-600">Knegar</span>
                      <span className="text-blue-600">Loggen</span>
                    </span>
                  </>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className={desktopClass}>
              <NavLinks links={navLinks} currentPath={pathname} />

              <div className="flex items-center gap-3">
                {showThemeToggle && <ModeToggle />}
                <AuthButtons
                  isAuthenticated={isAuthenticated}
                  isAdmin={isAdmin}
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  onLogout={handleLogout}
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`${mobileClass} p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800`}
              aria-label={isMobileMenuOpen ? "Stäng meny" : "Öppna meny"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Menu – inloggad är det "Mer" till flikraden längst ner. */}
          {isMobileMenuOpen && (
            <div className={`${mobileClass} py-4 border-t`} role="menu">
              <div className="flex flex-col gap-4">
                <MobileNavLinks
                  links={moreLinks}
                  currentPath={pathname}
                  onNavigate={closeMobileMenu}
                />

                <div className="flex flex-col gap-2 pt-4 border-t">
                  {showThemeToggle && (
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-sm font-medium">Tema</span>
                      <ModeToggle />
                    </div>
                  )}

                  <MobileAuthSection
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    user={user}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onLogout={handleLogout}
                    onNavigate={closeMobileMenu}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Utanför <nav>: backdrop-blur där skulle låsa fixed-positionen till navbaren. */}
      {isAuthenticated && (
        <MobileTabBar
          links={tabLinks}
          currentPath={pathname}
          moreActive={moreLinks.some((l) => isLinkActive(l, pathname))}
          moreOpen={isMobileMenuOpen}
          onMore={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
