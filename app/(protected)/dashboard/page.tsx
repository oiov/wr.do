import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { TeamPlanQuota } from "@/config/team";
import { getUserRecordCount } from "@/lib/dto/cloudflare-dns-record";
import { getAllUserEmailsCount } from "@/lib/dto/email";
import { getUserShortUrlCount } from "@/lib/dto/short-urls";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import {
  DashboardInfoCard,
  HeroCard,
} from "../../../components/dashboard/dashboard-info-card";
import UserRecordsList from "./records/record-list";
import LiveLog from "./urls/live-logs";
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
  const email_count = await getAllUserEmailsCount(user.id);

  return (
    <>
      <DashboardHeader heading="Dashboard" text="" />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <HeroCard
            total={email_count.total}
            monthTotal={email_count.month_total}
            limit={TeamPlanQuota[user.team].EM_EmailAddresses}
          />
          <DashboardInfoCard
            userId={user.id}
            title="Short URLs"
            total={url_count.total}
            monthTotal={url_count.month_total}
            limit={TeamPlanQuota[user.team].SL_NewLinks}
            link="/dashboard/urls"
            icon="link"
          />
          <DashboardInfoCard
            userId={user.id}
            title="DNS Records"
            total={record_count.total}
            monthTotal={record_count.month_total}
            limit={TeamPlanQuota[user.team].RC_NewRecords}
            link="/dashboard/records"
            icon="globeLock"
          />
        </div>
        <LiveLog admin={false} />
        <UserUrlsList
          user={{
            id: user.id,
            name: user.name || "",
            apiKey: user.apiKey || "",
            role: user.role,
          }}
          action="/api/url"
        />
        <UserRecordsList
          user={{
            id: user.id,
            name: user.name || "",
            apiKey: user.apiKey || "",
          }}
          action="/api/record"
        />
      </div>
    </>
  );
}
