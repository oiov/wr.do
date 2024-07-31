import Link from "next/link";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getUserRecordCount } from "@/lib/dto/cloudflare-dns-record";
import { getUserShortUrlCount } from "@/lib/dto/short-urls";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import {
  DashboardInfoCard,
  HeroCard,
} from "../../../components/dashboard/dashboard-info-card";
import UserRecordsList from "./records/record-list";
import UserUrlsList from "./urls/url-list";

export const metadata = constructMetadata({
  title: "Dashboard - WR.DO",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  const record_count = await getUserRecordCount(user.id);
  const url_count = await getUserShortUrlCount(user.id);

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text="WR.DO Beta Launching Now! 🎉"
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <HeroCard />
          <DashboardInfoCard
            userId={user.id}
            title="DNS Records"
            count={record_count}
            total={siteConfig.freeQuota.record}
            link="/dashboard/records"
          />
          <DashboardInfoCard
            userId={user.id}
            title="Short URLs"
            count={url_count}
            total={siteConfig.freeQuota.url}
            link="/dashboard/urls"
          />
        </div>
        <UserRecordsList
          user={{ id: user.id, name: user.name || "" }}
          action="/api/record"
        />
        <UserUrlsList
          user={{ id: user.id, name: user.name || "" }}
          action="/api/url"
        />
      </div>
    </>
  );
}
