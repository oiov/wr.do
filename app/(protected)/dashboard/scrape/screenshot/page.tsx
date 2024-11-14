import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import DashboardScrapeCharts from "../charts";
import { ScreenshotScraping } from "../scrapes";

export const metadata = constructMetadata({
  title: "Url to Screenshot API - WR.DO",
  description:
    "Quickly extract website screenshots. It's free and unlimited to use!",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Url&nbsp;&nbsp;to&nbsp;&nbsp;Screenshot"
        text="Quickly extract website screenshots. It's free and unlimited to use!"
        link="/docs/open-api/screenshot"
        linkText="Screenshot API."
      />
      <ScreenshotScraping user={{ id: user.id, apiKey: user.apiKey }} />
    </>
  );
}
