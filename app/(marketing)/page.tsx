import HeroLanding, { LandingImages } from "@/components/sections/hero-landing";
import { PricingSection } from "@/components/sections/pricing";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <LandingImages />
      <PricingSection />
    </>
  );
}
