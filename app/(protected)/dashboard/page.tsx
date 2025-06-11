import { Suspense } from "react";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getUserRecordCount } from "@/lib/dto/cloudflare-dns-record";
import { getAllUserEmailsCount } from "@/lib/dto/email";
import { getPlanQuota, PlanQuota } from "@/lib/dto/plan";
import { getUserShortUrlCount } from "@/lib/dto/short-urls";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardInfoCard,
  HeroCard,
} from "@/components/dashboard/dashboard-info-card";
import { ErrorBoundary } from "@/components/shared/error-boundary";

import UserRecordsList from "./records/record-list";
import UserUrlsList from "./urls/url-list";

export const metadata = constructMetadata({
  title: "Dashboard",
  description: "List and manage records.",
});

async function EmailHeroCardSection({
  userId,
  plan,
}: {
  userId: string;
  plan: PlanQuota;
}) {
  const email_count = await getAllUserEmailsCount(userId);

  return (
    <HeroCard
      total={email_count.total}
      monthTotal={email_count.month_total}
      limit={plan.emEmailAddresses}
    />
  );
}

async function ShortUrlsCardSection({
  userId,
  plan,
}: {
  userId: string;
  plan: PlanQuota;
}) {
  const url_count = await getUserShortUrlCount(userId);

  return (
    <DashboardInfoCard
      userId={userId}
      title="Short URLs"
      total={url_count.total}
      monthTotal={url_count.month_total}
      limit={plan.slNewLinks}
      link="/dashboard/urls"
      icon="link"
    />
  );
}

async function DnsRecordsCardSection({
  userId,
  plan,
}: {
  userId: string;
  plan: PlanQuota;
}) {
  const record_count = await getUserRecordCount(userId);

  return (
    <DashboardInfoCard
      userId={userId}
      title="DNS Records"
      total={record_count.total}
      monthTotal={record_count.month_total}
      limit={plan.rcNewRecords}
      link="/dashboard/records"
      icon="globeLock"
    />
  );
}

async function UserUrlsListSection({
  user,
}: {
  user: {
    id: string;
    name: string;
    apiKey: string;
    role: UserRole;
    team: string;
  };
}) {
  return (
    <UserUrlsList
      user={{
        id: user.id,
        name: user.name,
        apiKey: user.apiKey,
        role: user.role,
        team: user.team,
      }}
      action="/api/url"
    />
  );
}

async function UserRecordsListSection({
  user,
}: {
  user: {
    id: string;
    name: string;
    apiKey: string;
    email: string;
    role: UserRole;
  };
}) {
  return (
    <UserRecordsList
      user={{
        id: user.id,
        name: user.name,
        apiKey: user.apiKey,
        email: user.email,
        role: user.role,
      }}
      action="/api/record"
    />
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  const plan = await getPlanQuota(user.team);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <EmailHeroCardSection userId={user.id} plan={plan} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <ShortUrlsCardSection userId={user.id} plan={plan} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <DnsRecordsCardSection userId={user.id} plan={plan} />
            </Suspense>
          </ErrorBoundary>
        </div>
        <ErrorBoundary
          fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
        >
          <Suspense
            fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
          >
            <UserRecordsListSection
              user={{
                id: user.id,
                name: user.name || "",
                apiKey: user.apiKey || "",
                email: user.email || "",
                role: user.role,
              }}
            />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
        >
          <Suspense
            fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
          >
            <UserUrlsListSection
              user={{
                id: user.id,
                name: user.name || "",
                apiKey: user.apiKey || "",
                role: user.role,
                team: user.team,
              }}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
