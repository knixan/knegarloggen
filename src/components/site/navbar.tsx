"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import authClient, { useSession } from "@/lib/auth-client";
import { ModeToggle } from "../button/theme-button";

// ============================================================================
// Types
// ============================================================================

type LinkItem = {
  href: string;
  label: string;
};

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
  <div className="flex items-center gap-6">
    {links.map((link) => {
      const isActive = currentPath === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition-colors ${
            isActive
              ? "text-gray-900 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
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
      const isActive = currentPath === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`px-2 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
        >
          {link.label}
        </Link>
      );
    })}
  </>
);

// Auth Buttons (Desktop)
interface AuthButtonsProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  isAuthenticated,
  onLogin,
  onRegister,
  onLogout,
}) => {
  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={onLogin}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors dark:text-gray-300"
        >
          Logga in
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
      <Link
        href="/mina-sidor"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors dark:text-gray-300"
      >
        <User className="h-4 w-4" aria-hidden="true" />
        <span>Mina sidor</span>
      </Link>
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
  user: { name?: string; email?: string } | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onNavigate: () => void;
}

const MobileAuthSection: React.FC<MobileAuthSectionProps> = ({
  isAuthenticated,
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
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Logga in
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
      <Link
        href="/mina-sidor"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={onNavigate}
      >
        <User className="h-4 w-4" aria-hidden="true" />
        <span>Mina sidor</span>
      </Link>
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
  const { isAuthenticated, user, handleLogin, handleRegister, handleLogout } =
    useAuth();

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

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-gray-950/95"
      aria-label="Huvudnavigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 text-xl font-black hover:text-gray-600 transition-colors"
            >
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
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <NavLinks links={links} currentPath={pathname} />

            <div className="flex items-center gap-3">
              {showThemeToggle && <ModeToggle />}
              <AuthButtons
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onLogout={handleLogout}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t" role="menu">
            <div className="flex flex-col gap-4">
              <MobileNavLinks
                links={links}
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
  );
};

export default Navbar;
