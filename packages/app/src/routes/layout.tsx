import { Suspense } from "react";
import { brand } from "../brand";
import { Roboto } from "next/font/google";
import Navbar from "../components/site/navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "../components/site/theme-provider";
import Footer from "../components/site/footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: brand.namn,
  description: brand.beskrivning,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning className={roboto.className}>
      <Suspense fallback={null}>
        {/* Plats under mobilens flikrad (navbar.tsx) när den visas. */}
        <body
          className="min-h-screen has-[#mobil-flikrad]:pb-[calc(4rem+env(safe-area-inset-bottom))] xl:has-[#mobil-flikrad]:pb-0"
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <Toaster position="top-right" />
            {children}
          </ThemeProvider>
          <Footer />
        </body>
      </Suspense>
    </html>
  );
}
