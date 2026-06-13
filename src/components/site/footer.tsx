"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ExternalLink, LogOut } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import authClient from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Footer() {
  const { data: session } = useSession();
  const router = useRouter();
  const isAuthenticated = !!session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <footer className="w-full border-t bg-white dark:bg-gray-950 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          {/* Logga och Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-black hover:opacity-80 transition-opacity">
              <Image 
                src="/knegaloggen-logga.png" 
                alt="KnegarLoggen" 
                width={100} 
                height={100} 
                className="h-16 w-16 object-contain" 
              />
              <span>
                <span className="text-red-600">Knegar</span>
                <span className="text-blue-600">Loggen</span>
              </span>
            </Link>
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Mjölby, Sverige</span>
            </div>
          </div>

          {/* Kontakt och Design */}
          <div className="space-y-4">
            <h3 className="font-semibold uppercase tracking-wider text-xs text-foreground">Kontakt & Design</h3>
            <div className="space-y-2">
              <p className="font-medium">Josefine Eriksson</p>
              <a 
                href="mailto:josefineeriksson@live.se" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                josefineeriksson@live.se
              </a>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Design & Utveckling</p>
                <a 
                  href="https://kodochdesign.se" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 font-medium hover:underline text-foreground"
                >
                  Kod och Design Josefine Eriksson
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold uppercase tracking-wider text-xs text-foreground">Navigation</h3>
            <nav className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/mina-sidor" className="text-muted-foreground hover:text-foreground transition-colors">Mina sidor</Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <Link href="/logga-in" className="text-muted-foreground hover:text-foreground transition-colors">Logga in</Link>
                  <Link href="/registrera" className="text-muted-foreground hover:text-foreground transition-colors">Registrera</Link>
                </>
              )}
            </nav>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} KnegarLoggen. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}