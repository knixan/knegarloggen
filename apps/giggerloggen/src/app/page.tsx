import { Hero } from "@/components/site/hero";
import { Industries } from "@/components/site/industries";
import { Features } from "@/components/site/features";
import { CTA } from "@/components/site/cta";

// Navbar och footer kommer från den delade root-layouten.
export default function LandingPage() {
  return (
    <main className="flex-1">
      <Hero />
      <Industries />
      <Features />
      <CTA />
    </main>
  );
}
