import { getCurrentUser } from "@/lib/session";
import HeroLanding, { LandingImages } from "@/components/sections/hero-landing";
import { PricingSection } from "@/components/sections/pricing";

export default async function IndexPage() {
  const user = await getCurrentUser();
  return (
    <>
      <HeroLanding userId={user?.id} />
      <LandingImages />
      <PricingSection />
    </>
  );
}
