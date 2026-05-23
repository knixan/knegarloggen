import "./globals.css";
import Navbar from "@/components/site/navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/site/theme-provider";

export const metadata = {
  title: "BetterAuth Prisma Example",
  description:
    "An example Next.js project demonstrating BetterAuth with Prisma integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
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