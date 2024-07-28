import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";

import { DNSInfoCard, UrlsInfoCard } from "./info-card";
import UserRecordsList from "./records/record-list";
import UserUrlsList from "./urls/url-list";

export const metadata = constructMetadata({
  title: "Dashboard - WRDO",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader heading="Dashboard" />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DNSInfoCard userId={user.id} />
          <UrlsInfoCard userId={user.id} />
        </div>
        <UserRecordsList user={{ id: user.id, name: user.name || "" }} />
        <UserUrlsList user={{ id: user.id, name: user.name || "" }} />
      </div>
    </>
  );
}
