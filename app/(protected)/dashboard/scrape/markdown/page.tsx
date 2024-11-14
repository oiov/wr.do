import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import { MarkdownScraping, TextScraping } from "../scrapes";

export const metadata = constructMetadata({
  title: "Url to Markdown API - WR.DO",
  description:
    "Quickly extract website content and convert it to Markdown format",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Url&nbsp;&nbsp;to&nbsp;&nbsp;Markdown"
        text="Quickly extract website content and convert it to Markdown format. It's free and unlimited to use!"
        link="/docs/open-api/markdown"
        linkText="Markdown API."
      />
      <MarkdownScraping user={{ id: user.id, apiKey: user.apiKey }} />
      <TextScraping user={{ id: user.id, apiKey: user.apiKey }} />
    </>
  );
}
