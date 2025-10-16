import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import HeroLanding, { LandingImages } from "@/components/sections/hero-landing";
import { PricingSection } from "@/components/sections/pricing";

export const metadata = constructMetadata({
  title: "WR.DO - Your all-in-one domain services platform",
  description: "List and manage records.",
});

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
