import "./globals.css";
import { Roboto } from "next/font/google";
import Navbar from "@/components/site/navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/site/theme-provider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Knegarloggen",
  description: "Joblogg för hantverkare",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning className={roboto.className}>
      <body className="min-h-screen" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
