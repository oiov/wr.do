import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import MetaScraping from "./meta-scraping";

export const metadata = constructMetadata({
  title: "Scraping API - WR.DO",
  description: "Quickly extract valuable structured website data",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Scraping&nbsp;&nbsp;API"
        text="Quickly extract valuable structured website data. It's free and unlimited to use!"
        link="/docs/scraping-api"
        linkText="Scraping API."
      />
      <MetaScraping user={{ id: user.id, apiKey: user.apiKey }} />
    </>
  );
}
