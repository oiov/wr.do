import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import DomainList from "./domain-list";

export const metadata = constructMetadata({
  title: "Domains - WR.DO",
  description: "List and manage domains.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Manage&nbsp;&nbsp;Domains"
        text="List and manage domains."
        link="/docs/developer/cloudflare"
        linkText="domains."
      />
      <DomainList
        user={{
          id: user.id,
          name: user.name || "",
          apiKey: user.apiKey || "",
          email: user.email || "",
          role: user.role,
          team: user.team,
        }}
        action="/api/admin/domain"
      />
    </>
  );
}
