import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import UserRecordsList from "./record-list";

export const metadata = constructMetadata({
  title: "DNS Records",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Manage DNS Records"
        text="List and manage records"
        link="/docs/dns-records"
        linkText="DNS records"
      />
      <UserRecordsList
        user={{
          id: user.id,
          name: user.name || "",
          apiKey: user.apiKey || "",
          email: user.email || "",
          role: user.role,
        }}
        action="/api/record"
      />
    </>
  );
}
