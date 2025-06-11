import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import ApiReference from "@/components/shared/api-reference";

import { MarkdownScraping, TextScraping } from "../scrapes";

export const metadata = constructMetadata({
  title: "Url to Markdown API",
  description:
    "Quickly extract website content and convert it to Markdown format",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Url to Markdown"
        text="Quickly extract website content and convert it to Markdown format"
        link="/docs/open-api/markdown"
        linkText="Markdown API"
      />
      <ApiReference
        badge="GET /api/v1/scraping/markdown"
        target="extracting url as markdown"
        link="/docs/open-api/markdown"
      />
      <ApiReference
        badge="GET /api/v1/scraping/text"
        target="extracting url as text"
        link="/docs/open-api/text"
      />
      <MarkdownScraping user={{ id: user.id, apiKey: user.apiKey }} />
      <TextScraping user={{ id: user.id, apiKey: user.apiKey }} />
    </>
  );
}
