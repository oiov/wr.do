import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import ApiReference from "@/components/shared/api-reference";

import DashboardScrapeCharts from "../charts";
import { ScreenshotScraping } from "../scrapes";

export const metadata = constructMetadata({
  title: "Url to Screenshot API",
  description:
    "Quickly extract website screenshots. It's free and unlimited to use!",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Url to Screenshot"
        text="Quickly extract website screenshots"
        link="/docs/open-api/screenshot"
        linkText="Screenshot API"
      />
      <ApiReference
        badge="GET /api/v1/scraping/screenshot"
        target="extracting url as screenshot"
        link="/docs/open-api/screenshot"
      />
      <ScreenshotScraping user={{ id: user.id, apiKey: user.apiKey }} />
    </>
  );
}
