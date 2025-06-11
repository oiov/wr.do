import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getUserRecordCount } from "@/lib/dto/cloudflare-dns-record";
import {
  getAllUserEmailsCount,
  getAllUserInboxEmailsCount,
} from "@/lib/dto/email";
import { getScrapeStatsByType } from "@/lib/dto/scrape";
import { getUserShortUrlCount } from "@/lib/dto/short-urls";
import { getAllUsersActiveApiKeyCount, getAllUsersCount } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { InteractiveBarChart } from "@/components/charts/interactive-bar-chart";
import {
  DashboardInfoCard,
  UserInfoCard,
} from "@/components/dashboard/dashboard-info-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { ErrorBoundary } from "@/components/shared/error-boundary";

import { DailyPVUVChart } from "../dashboard/scrape/daily-chart";
import LogsTable from "../dashboard/scrape/logs";
import { RadialShapeChart } from "./api-key-active-chart";
import { LineChartMultiple } from "./line-chart-multiple";

export const metadata = constructMetadata({
  title: "Admin – WR.DO",
  description: "Admin page for only admin management.",
});

// 用户卡片组件
async function UserInfoCardSection({ userId }: { userId: string }) {
  const user_count = await getAllUsersCount();

  return (
    <UserInfoCard
      userId={userId}
      title="Users"
      count={user_count}
      link="/admin/users"
    />
  );
}

// 短链接卡片组件
async function ShortUrlsCardSection({ userId }: { userId: string }) {
  const url_count = await getUserShortUrlCount(userId, 1, "ADMIN");

  return (
    <DashboardInfoCard
      userId={userId}
      title="Short URLs"
      total={url_count.total}
      monthTotal={url_count.month_total}
      limit={1000000}
      link="/admin/urls"
      icon="link"
    />
  );
}

// DNS 记录卡片组件
async function DnsRecordsCardSection({ userId }: { userId: string }) {
  const record_count = await getUserRecordCount(userId, 1, "ADMIN");

  return (
    <DashboardInfoCard
      userId={userId}
      title="DNS Records"
      total={record_count.total}
      monthTotal={record_count.month_total}
      limit={1000000}
      link="/admin/records"
      icon="globeLock"
    />
  );
}

// 邮件卡片组件
async function EmailsCardSection({ userId }: { userId: string }) {
  const email_count = await getAllUserEmailsCount(userId, "ADMIN");

  return (
    <DashboardInfoCard
      userId={userId}
      title="Emails"
      total={email_count.total}
      monthTotal={email_count.month_total}
      limit={1000000}
      link="/admin"
      icon="mail"
    />
  );
}

// 收件箱卡片组件
async function InboxCardSection({ userId }: { userId: string }) {
  const inbox_count = await getAllUserInboxEmailsCount();

  return (
    <DashboardInfoCard
      userId={userId}
      title="Inbox"
      total={inbox_count.total}
      monthTotal={inbox_count.month_total}
      limit={1000000}
      link="/admin"
      icon="inbox"
    />
  );
}

// 交互式柱状图组件
async function InteractiveBarChartSection() {
  return <InteractiveBarChart />;
}

// 请求统计图表组件
async function RequestStatsSection() {
  const screenshot_stats = await getScrapeStatsByType("screenshot", "30d");
  const meta_stats = await getScrapeStatsByType("meta-info", "30d");
  const md_stats = await getScrapeStatsByType("markdown", "30d");
  const text_stats = await getScrapeStatsByType("text", "30d");
  const qr_stats = await getScrapeStatsByType("qrcode", "30d");

  const hasStats =
    screenshot_stats.length > 0 ||
    meta_stats.length > 0 ||
    md_stats.length > 0 ||
    text_stats.length > 0 ||
    qr_stats.length > 0;

  return hasStats ? (
    <>
      <DailyPVUVChart
        data={screenshot_stats
          .concat(meta_stats)
          .concat(md_stats)
          .concat(text_stats)
          .concat(qr_stats)}
      />
    </>
  ) : null;
}

// 径向图组件
async function RadialShapeChartSection() {
  const user_count = await getAllUsersCount();
  const user_api_key_count = await getAllUsersActiveApiKeyCount();

  return <RadialShapeChart totalUser={user_count} total={user_api_key_count} />;
}

// 二维码/截图折线图组件
async function QrScreenshotChartSection() {
  const screenshot_stats = await getScrapeStatsByType("screenshot", "90d");
  const qr_stats = await getScrapeStatsByType("qrcode", "90d");

  return (
    <LineChartMultiple
      chartData={qr_stats.concat(screenshot_stats)}
      type1="qrcode"
      type2="screenshot"
    />
  );
}

// 截图/元信息折线图组件
async function ScreenshotMetaChartSection() {
  const screenshot_stats = await getScrapeStatsByType("screenshot", "90d");
  const meta_stats = await getScrapeStatsByType("meta-info", "90d");

  return (
    <LineChartMultiple
      chartData={screenshot_stats.concat(meta_stats)}
      type1="screenshot"
      type2="meta-info"
    />
  );
}

// Markdown/文本折线图组件
async function MarkdownTextChartSection() {
  const md_stats = await getScrapeStatsByType("markdown", "90d");
  const text_stats = await getScrapeStatsByType("text", "90d");

  return (
    <LineChartMultiple
      chartData={md_stats.concat(text_stats)}
      type1="markdown"
      type2="text"
    />
  );
}

// 日志表格组件
async function LogsSection({ userId }: { userId: string }) {
  return (
    <>
      <LogsTable userId={userId} target={"/api/v1/scraping/admin/logs"} />
    </>
  );
}

// 主组件
export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !user.id || user.role !== "ADMIN") redirect("/login");

  return (
    <>
      <DashboardHeader heading="Admin Panel" text="" />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <UserInfoCardSection userId={user.id} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <ShortUrlsCardSection userId={user.id} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <DnsRecordsCardSection userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <EmailsCardSection userId={user.id} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-full rounded-lg" />}
            >
              <InboxCardSection userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </div>
        <ErrorBoundary
          fallback={<Skeleton className="h-[380px] w-full rounded-lg" />}
        >
          <Suspense
            fallback={<Skeleton className="h-[380px] w-full rounded-lg" />}
          >
            <InteractiveBarChartSection />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<Skeleton className="min-h-[342px] w-full rounded-lg" />}
        >
          <Suspense
            fallback={<Skeleton className="min-h-[342px] w-full rounded-lg" />}
          >
            <RequestStatsSection />
          </Suspense>
        </ErrorBoundary>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ErrorBoundary
            fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
            >
              <RadialShapeChartSection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
            >
              <QrScreenshotChartSection />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ErrorBoundary
            fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
            >
              <ScreenshotMetaChartSection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
          >
            <Suspense
              fallback={<Skeleton className="h-[320px] w-full rounded-lg" />}
            >
              <MarkdownTextChartSection />
            </Suspense>
          </ErrorBoundary>
        </div>
        <ErrorBoundary
          fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
        >
          <Suspense
            fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
          >
            <LogsSection userId={user.id} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
