import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import ApiReference from "@/components/shared/api-reference";

import { MetaScraping } from "../scrapes";

export const metadata = constructMetadata({
  title: "Url to Meta API",
  description: "Quickly extract valuable structured website data",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Url to Meta Info"
        text="Quickly extract valuable structured website data"
        link="/docs/open-api/meta-info"
        linkText="Meta Info API"
      />
      <ApiReference
        badge="GET /api/v1/scraping/meta"
        target="extracting url as meta info"
        link="/docs/open-api/meta-info"
      />
      <MetaScraping user={{ id: user.id, apiKey: user.apiKey }} />
    </>
  );
}
