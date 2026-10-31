import Hero from "@/components/site/hero";
import Trades from "@/components/site/trades";
import Features from "@/components/site/features";
import Cta from "@/components/site/cta";
import Faq from "@/components/site/faq";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Trades />
      <Features />
      <Cta />
      <Faq />
    </div>
  );
}
