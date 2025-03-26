import { siteConfig } from "@/config/site";
import HeroLanding, { LandingImages } from "@/components/sections/hero-landing";
import { PricingSection } from "@/components/sections/pricing";

// import PreviewLanding from "@/components/sections/preview-landing";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <LandingImages />
      <PricingSection />
    </>
  );
}
