import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import ApiReference from "@/components/shared/api-reference";

import { CodeLight } from "../../scrape/scrapes";
import LiveLog from "../live-logs";

export const metadata = constructMetadata({
  title: "Live Logs",
  description: "Display link's real-time live logs.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <ApiReference
        badge="POST /api/v1/short"
        target="creating short urls"
        link="/docs/short-urls#api-reference"
      />
      <CodeLight
        content={`
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "wrdo-api-key: YOUR_API_KEY" \\
  -d '{
    "target": "https://www.oiov.dev",
    "url": "abc123",
    "expiration": "-1",
    "prefix": "wr.do",
    "visible": 1,
    "active": 1,
    "password": ""
  }' \\
  https://wr.do/api/v1/short
        `}
      />
    </>
  );
}
