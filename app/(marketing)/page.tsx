import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import HeroLanding, { LandingImages } from "@/components/sections/hero-landing";
import { PricingSection } from "@/components/sections/pricing";

export const metadata = constructMetadata({
  title: "WR.DO - Your All-In-One Domain Services Platform",
  description:
    "All-in-one domain platform with short links, temp email, subdomain management, file storage, and open APIs",
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
