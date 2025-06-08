"use client";

import * as React from "react";
import Link from "next/link";
import { ScrapeMeta } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { isLink, nFormatter, removeUrlSuffix } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TimeAgoIntl } from "@/components/shared/time-ago";

const chartConfig = {
  request: {
    label: "Requests",
    color: "hsl(var(--chart-2))",
  },
  ip: {
    label: "IP",
    color: "hsl(var(--chart-1))",
  },
};

function processUrlMeta(urlMetaArray: ScrapeMeta[]) {
  const dailyData: { [key: string]: { clicks: number; ips: Set<string> } } = {};

  urlMetaArray.forEach((meta) => {
    const createdDate = new Date(meta.createdAt).toISOString().split("T")[0];
    const updatedDate = new Date(meta.updatedAt).toISOString().split("T")[0];

    // Record for created date
    if (!dailyData[createdDate]) {
      dailyData[createdDate] = { clicks: 0, ips: new Set<string>() };
    }
    dailyData[createdDate].clicks += 1;
    dailyData[createdDate].ips.add(meta.ip);

    // If updated date is different, record additional clicks on that date
    if (createdDate !== updatedDate) {
      if (!dailyData[updatedDate]) {
        dailyData[updatedDate] = { clicks: 0, ips: new Set<string>() };
      }
      dailyData[updatedDate].clicks += meta.click - 1; // Subtract the initial click
      dailyData[updatedDate].ips.add(meta.ip);
    }
  });

  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    clicks: data.clicks,
    uniqueIPs: data.ips.size,
    ips: Array.from(data.ips),
  }));
}

function calculateUVAndPV(logs: ScrapeMeta[]) {
  const uniqueIps = new Set<string>();
  let totalClicks = 0;

  logs.forEach((log) => {
    uniqueIps.add(log.ip);
    totalClicks += log.click;
  });

  return {
    ip: uniqueIps.size,
    request: totalClicks,
  };
}

interface Stat {
  dimension: string;
  clicks: number;
  percentage: string;
}

export function DailyPVUVChart({ data }: { data: ScrapeMeta[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("request");

  const processedData = processUrlMeta(data)
    .map((entry) => ({
      date: entry.date,
      request: entry.clicks,
      ip: new Set(entry.ips).size,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const dataTotal = calculateUVAndPV(data);

  const sort_data = data.sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  );
  const latestEntry = sort_data[sort_data.length - 1];
  const latestFrom = latestEntry.type;

  const t = useTranslations("Components");

  const lastRequestInfo = t.rich("last-request-info", {
    location: latestFrom,
    timeAgo: () => <TimeAgoIntl date={latestEntry.updatedAt} />,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4">
          <CardTitle>{t("Total Requests of APIs in Last 30 Days")}</CardTitle>
          <CardDescription>{lastRequestInfo}</CardDescription>
        </div>
        <div className="flex">
          {["request", "ip"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col items-center justify-center gap-1 border-t px-6 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-3"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-nowrap text-xs text-muted-foreground">
                  {t(chartConfig[chart].label)}
                </span>
                <span className="text-lg font-bold leading-none">
                  {nFormatter(dataTotal[key])}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[225px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={processedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-ip)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-ip)`}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-request)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-request)`}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis width={20} axisLine={false} tickLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            {/* <Bar dataKey="ip" fill={`var(--color-ip)`} stackId="a" />
            <Bar dataKey="request" fill={`var(--color-request)`} stackId="a" /> */}

            <Area
              type="monotone"
              dataKey="ip"
              stroke={`var(--color-ip)`}
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="request"
              stroke={`var(--color-request)`}
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ChartContainer>

        {/* <VisSingleContainer data={{ areas: areaData }}>
          <VisTopoJSONMap topojson={WorldMapTopoJSON} />
          <VisTooltip triggers={triggers} />
        </VisSingleContainer> */}
        {/* 
        <div className="my-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {refererStats.length > 0 && (
            <StatsList data={refererStats} title="Referrers" />
          )}
          {cityStats.length > 0 && (
            <StatsList data={cityStats} title="Cities" />
          )}
          {browserStats.length > 0 && (
            <StatsList data={browserStats} title="Browsers" />
          )}
          {deviceStats.length > 0 && (
            <StatsList data={deviceStats} title="Devices" />
          )}
        </div> */}
      </CardContent>
    </Card>
  );
}

export function StatsList({ data, title }: { data: Stat[]; title: string }) {
  return (
    <div className="rounded-lg border p-4">
      <h1 className="text-lg font-bold">{title}</h1>
      {data.slice(0, 10).map((ref) => (
        <div className="mt-1" key={ref.dimension}>
          <div className="mb-0.5 flex items-center justify-between text-sm">
            {isLink(ref.dimension) ? (
              <Link
                className="truncate font-medium hover:opacity-70 hover:after:content-['↗']"
                href={ref.dimension}
              >
                {removeUrlSuffix(ref.dimension)}
              </Link>
            ) : (
              <p className="font-medium">{decodeURIComponent(ref.dimension)}</p>
            )}
            <p className="text-slate-500">
              {ref.clicks} ({ref.percentage})
            </p>
          </div>
          <div className="w-full rounded-lg bg-neutral-200 dark:bg-neutral-600">
            <div
              className="rounded-lg bg-blue-500/90 px-0.5 py-1 leading-none transition-all duration-300"
              style={{
                width: `${ref.percentage}`,
                opacity: parseFloat(ref.percentage) / 10,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
