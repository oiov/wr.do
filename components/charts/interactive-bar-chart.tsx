"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import { DATE_DIMENSION_ENUMS } from "@/lib/enums";
import { cn, fetcher, nFormatter } from "@/lib/utils";
import { useElementSize } from "@/hooks/use-element-size";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
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
  const { ref: wrapperRef, width: wrapperWidth } = useElementSize();
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("users");

  const t = useTranslations("Components");

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
        <div className="flex w-full flex-1 justify-between gap-2 px-6 py-5 sm:flex-col sm:py-6">
          <div className="flex flex-col justify-center gap-1">
            <CardTitle>{t("Data Increase")}</CardTitle>
            <CardDescription>{t("Showing data increase in")}:</CardDescription>
          </div>
          <Select
            onValueChange={(value: string) => {
              setTimeRange(value);
            }}
            name="time range"
            defaultValue={timeRange}
          >
            <SelectTrigger className="w-44 shadow-inner">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {DATE_DIMENSION_ENUMS.map((e, i) => (
                <div key={e.value}>
                  <SelectItem value={e.value}>{t(e.label)}</SelectItem>
                  {i % 2 === 0 && i !== DATE_DIMENSION_ENUMS.length - 1 && (
                    <SelectSeparator />
                  )}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6">
          {["users", "records", "urls", "emails", "inbox", "sends"].map(
            (key) => {
              const chart = key as keyof typeof chartConfig;
              const growthRate =
                data.growthRates[key as keyof typeof data.growthRates];
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-col justify-center gap-1 border-l border-t p-3 text-left transition-colors hover:bg-muted/30 data-[active=true]:bg-muted/50 sm:border-t-0 sm:p-4"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {t(chartConfig[chart].label)}
                  </span>
                  <span className="text-base font-bold leading-none sm:text-lg">
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
      <CardContent ref={wrapperRef} className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data.list}
            width={wrapperWidth}
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
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
