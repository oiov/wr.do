"use client";

import * as React from "react";
import Link from "next/link";
import { UrlMeta } from "@prisma/client";
import { VisSingleContainer, VisTooltip, VisTopoJSONMap } from "@unovis/react";
import { MapData, TopoJSONMap } from "@unovis/ts";
import { WorldMapTopoJSON } from "@unovis/ts/maps";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { getCountryName } from "@/lib/contries";
import { isLink, removeUrlSuffix, timeAgo } from "@/lib/utils";
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

const chartConfig = {
  pv: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
  uv: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
};

function processUrlMeta(urlMetaArray: UrlMeta[]) {
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

function calculateUVAndPV(logs: UrlMeta[]) {
  const uniqueIps = new Set<string>();
  let totalClicks = 0;

  logs.forEach((log) => {
    uniqueIps.add(log.ip);
    totalClicks += log.click;
  });

  return {
    uv: uniqueIps.size,
    pv: totalClicks,
  };
}

interface Stat {
  dimension: string;
  clicks: number;
  percentage: string;
}

function generateStatsList(
  records: UrlMeta[],
  dimension: keyof UrlMeta,
): Stat[] {
  // 统计每个维度的点击总数
  const dimensionCounts: { [key: string]: number } = {};
  let totalClicks = 0;

  records.forEach((record) => {
    const dimValue = record[dimension] || ("Unknown" as any);
    const click = record.click;

    if (!dimensionCounts[dimValue]) {
      dimensionCounts[dimValue] = 0;
    }

    dimensionCounts[dimValue] += click;
    totalClicks += click;
  });

  // 计算百分比并生成列表
  const statsList: Stat[] = [];

  for (const [dimValue, clicks] of Object.entries(dimensionCounts)) {
    const percentage = (clicks / totalClicks) * 100;
    statsList.push({
      dimension: dimValue ?? "Unknown",
      clicks,
      percentage: percentage.toFixed(0) + "%",
    });
  }

  statsList.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

  return statsList;
}

export function DailyPVUVChart({ data }: { data: UrlMeta[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("pv");

  const processedData = processUrlMeta(data)
    .map((entry) => ({
      date: entry.date,
      pv: entry.clicks,
      uv: new Set(entry.ips).size,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const dataTotal = calculateUVAndPV(data);

  const latestEntry = data[data.length - 1];
  const latestDate = timeAgo(latestEntry.updatedAt);
  const latestFrom = [
    latestEntry.city ? decodeURIComponent(latestEntry.city) : "",
    latestEntry.country ? `(${getCountryName(latestEntry.country)})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const areaData = data.map((item) => ({
    id: item.country,
  }));
  const pointData = data.map((item) => ({
    id: item.id,
    city: item.city,
    latitude: item.latitude,
    longitude: item.longitude,
  }));
  // const pointLabel = (d: any) => d.city;
  const triggers = {
    [TopoJSONMap.selectors.feature]: (d) => `${getCountryName(d.id)}`,
    [TopoJSONMap.selectors.point]: (d) => decodeURIComponent(d.city),
  };
  // const mapEvents = {
  //   [TopoJSONMap.selectors.point]: {},
  //   [TopoJSONMap.selectors.feature]: {},
  // };

  const refererStats = generateStatsList(data, "referer");
  const cityStats = generateStatsList(data, "city");
  const deviceStats = generateStatsList(data, "device");
  const browserStats = generateStatsList(data, "browser");

  return (
    <Card className="rounded-t-none border-t-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-3">
          <CardTitle>Daily Stats</CardTitle>
          <CardDescription>
            Last visitor from {latestFrom} about {latestDate}.
          </CardDescription>
        </div>
        <div className="flex">
          {["pv", "uv"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col items-center justify-center gap-1 border-t px-6 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-3"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none">
                  {dataTotal[key as keyof typeof dataTotal].toLocaleString()}
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
                  stopColor={`var(--color-uv)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-uv)`}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-pv)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-pv)`}
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
            {/* <Bar dataKey="uv" fill={`var(--color-uv)`} stackId="a" />
            <Bar dataKey="pv" fill={`var(--color-pv)`} stackId="a" /> */}

            <Area
              type="monotone"
              dataKey="uv"
              stroke={`var(--color-uv)`}
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="pv"
              stroke={`var(--color-pv)`}
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ChartContainer>

        <VisSingleContainer data={{ areas: areaData, points: pointData }}>
          <VisTopoJSONMap
            topojson={WorldMapTopoJSON}
            // events={mapEvents}
            // mapFitToPoints={true}
            // pointLabel={pointLabel}
            pointRadius={1.6}
          />
          <VisTooltip triggers={triggers} />
        </VisSingleContainer>

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
        </div>
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
