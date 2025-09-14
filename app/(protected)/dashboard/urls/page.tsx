import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import UserUrlsList from "./url-list";

export const metadata = constructMetadata({
  title: "Links",
  description: "List and manage short links.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Manage Short URLs"
        text="List and manage short urls"
        link="/docs/short-urls"
        linkText="short urls"
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
    </>
  );
}
