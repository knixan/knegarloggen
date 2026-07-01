import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Industries } from "@/components/site/industries";
import { Features } from "@/components/site/features";
import { CTA } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Industries />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
