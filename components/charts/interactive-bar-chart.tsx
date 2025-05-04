"use client";

import * as React from "react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import useSWR from "swr";

import { DATE_DIMENSION_ENUMS } from "@/lib/enums";
import { cn, fetcher, nFormatter } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import CountUp from "../dashboard/count-up";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  views: {
    label: "Create",
  },
  records: {
    label: "Records",
    color: "hsl(var(--chart-2))",
  },
  urls: {
    label: "URLs",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  emails: {
    label: "Emails",
    color: "hsl(var(--chart-2))",
  },
  inbox: {
    label: "Inbox",
    color: "hsl(var(--chart-1))",
  },
  sends: {
    label: "Sends",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function InteractiveBarChart() {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("users");

  const { data, isLoading } = useSWR<{
    list: [
      {
        records: number;
        urls: number;
        users: number;
        emails: number;
        inbox: number;
        sends: number;
        date: string;
      },
    ];
    total: {
      records: number;
      urls: number;
      users: number;
      emails: number;
      inbox: number;
      sends: number;
    };
    growthRates: {
      records: number;
      urls: number;
      users: number;
      emails: number;
      inbox: number;
      sends: number;
    };
  }>(`api/admin?range=${timeRange}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  if (isLoading) return <Skeleton className="size-full rounded-lg" />;

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Data Increase</CardTitle>
          <CardDescription>
            Showing data increase in:
            <Select
              onValueChange={(value: string) => {
                setTimeRange(value);
              }}
              name="time range"
              defaultValue={timeRange}
            >
              <SelectTrigger className="mt-1 w-40 shadow-inner">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {DATE_DIMENSION_ENUMS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardDescription>
        </div>

        <div className="flex">
          {["users", "records", "urls", "emails", "inbox", "sends"].map(
            (key) => {
              const chart = key as keyof typeof chartConfig;
              const growthRate =
                data.growthRates[key as keyof typeof data.growthRates];
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-l border-t p-4 text-left data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:p-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {nFormatter(data.total[key])}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-1 text-xs font-semibold leading-none",
                      growthRate > 0 && "bg-green-200 text-green-700",
                      growthRate < 0 && "bg-red-200 text-red-700",
                      growthRate === 0 && "bg-neutral-100 text-neutral-700",
                    )}
                  >
                    {growthRate >= 0 ? "+" : ""}
                    {growthRate.toFixed(1)}%
                  </span>
                </button>
              );
            },
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data.list}
            margin={{
              left: 12,
              right: 12,
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
