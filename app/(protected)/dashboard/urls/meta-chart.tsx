"use client";

import * as React from "react";
import { UrlMeta } from "@prisma/client";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

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
    color: "hsl(var(--chart-1))",
  },
  uv: {
    label: "Visitors",
    color: "hsl(var(--chart-2))",
  },
};

function processUrlMeta(urlMetaArray: UrlMeta[]) {
  const dailyData: { [key: string]: { clicks: number; ips: Set<string> } } = {};

  urlMetaArray.forEach((meta) => {
    const date = new Date(meta.createdAt).toISOString().split("T")[0];

    if (!dailyData[date]) {
      dailyData[date] = { clicks: 0, ips: new Set<string>() };
    }

    dailyData[date].clicks += meta.click;
    dailyData[date].ips.add(meta.ip);
  });

  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    clicks: data.clicks,
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

export function DailyPVUVChart({ data }: { data: UrlMeta[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("pv");

  const processedData = processUrlMeta(data).map((entry) => ({
    date: entry.date,
    pv: entry.clicks,
    uv: new Set(entry.ips).size,
  }));

  const dataTotal = calculateUVAndPV(data);

  const latestEntry = data[data.length - 1];
  const latestDate = new Date(latestEntry.updatedAt).toLocaleString("en-US");
  const latestFrom = [
    latestEntry.region ? latestEntry.region : "",
    latestEntry.country ? `(${latestEntry.country})` : "",
    latestEntry.city ? latestEntry.city : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="rounded-t-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-3">
          <CardTitle>Daily Stats</CardTitle>
          <CardDescription>
            Last visitor: {latestDate} from {latestFrom}.
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
          <BarChart
            accessibilityLayer
            // width={600}
            // height={200}
            data={processedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
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
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
