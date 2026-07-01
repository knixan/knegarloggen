import Hero from "@/components/site/hero";
import Features from "@/components/site/features";
import Cta from "@/components/site/cta";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <Cta />
    </div>
  );
}
