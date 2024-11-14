import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { ScrapeInfoCard } from "@/components/dashboard/dashboard-info-card";
import { DashboardHeader } from "@/components/dashboard/header";

import DashboardScrapeCharts from "./charts";

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
        heading="Scraping&nbsp;&nbsp;API&nbsp;&nbsp;Overview"
        text="Quickly extract valuable structured website data. It's free and unlimited to use!"
        link="/docs/open-api"
        linkText="Open API."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScrapeInfoCard
          userId={user.id}
          title="Url to Screenshot"
          desc="Take a screenshot of the webpage."
          link="/dashboard/scrape/screenshot"
          icon="camera"
        />
        <ScrapeInfoCard
          userId={user.id}
          title="Url to Meta Info"
          desc="Extract website metadata."
          link="/dashboard/scrape/meta-info"
          icon="globe"
        />
        <ScrapeInfoCard
          userId={user.id}
          title="Url to QR Code"
          desc="Generate QR Code from URL."
          link="/dashboard/scrape/qrcode"
          icon="qrcode"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScrapeInfoCard
          userId={user.id}
          title="Url to Markdown"
          desc="Convert website content to Markdown format."
          link="/dashboard/scrape/markdown"
          icon="heading1"
        />
        <ScrapeInfoCard
          userId={user.id}
          title="Url to Text"
          desc="Extract website text."
          link="/dashboard/scrape/markdown"
          icon="fileText"
        />
      </div>
      <DashboardScrapeCharts id={user.id} />
    </>
  );
}
