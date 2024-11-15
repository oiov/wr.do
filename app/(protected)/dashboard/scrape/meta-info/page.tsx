import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import DashboardScrapeCharts from "../charts";
import { MetaScraping } from "../scrapes";

export const metadata = constructMetadata({
  title: "Url to Meta API - WR.DO",
  description: "Quickly extract valuable structured website data",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Url&nbsp;&nbsp;to&nbsp;&nbsp;Meta&nbsp;&nbsp;Info"
        text="Quickly extract valuable structured website data. It's free and unlimited to use!"
        link="/docs/open-api/meta-info"
        linkText="Meta Info API."
      />
      <MetaScraping user={{ id: user.id, apiKey: user.apiKey }} />
    </>
  );
}
