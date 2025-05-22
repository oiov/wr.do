import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import ApiReference from "../../../../components/shared/api-reference";
import LiveLog from "./live-logs";
import UserUrlsList from "./url-list";

export const metadata = constructMetadata({
  title: "Short URLs - BiuXin",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Manage&nbsp;Short&nbsp;URLs"
        text="List and manage short urls."
        link="/docs/short-urls"
        linkText="short urls."
      />
      <UserUrlsList
        user={{
          id: user.id,
          name: user.name || "",
          apiKey: user.apiKey || "",
          role: user.role,
          team: user.team,
        }}
        action="/api/url"
      />
      <LiveLog admin={false} />
      <ApiReference
        badge="POST /api/v1/short"
        target="creating short urls"
        link="/docs/short-urls#api-reference"
      />
    </>
  );
}
