"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { UrlMeta, User } from "@prisma/client";
import { VisSingleContainer, VisTooltip, VisTopoJSONMap } from "@unovis/react";
import { TopoJSONMap } from "@unovis/ts";
import { WorldMapTopoJSON } from "@unovis/ts/maps";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import {
  getBotName,
  getCountryName,
  getDeviceVendor,
  getEngineName,
  getLanguageName,
  getRegionName,
} from "@/lib/contries";
import { DATE_DIMENSION_ENUMS } from "@/lib/enums";
import { fetcher, isLink, removeUrlSuffix } from "@/lib/utils";
import { useElementSize } from "@/hooks/use-element-size";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/shared/icons";
import { TimeAgoIntl } from "@/components/shared/time-ago";

const chartConfig = {
  pv: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
  uv: {
    label: "Visits",
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

  // 第一步：遍历记录，累加点击数
  records.forEach((record) => {
    // 获取维度值，默认为 "Unknown" 如果未定义
    const rawValue = record[dimension] || "Unknown";
    const dimValue =
      dimension === "country"
        ? getCountryName(rawValue as string) // 国家代码转为国家名称
        : dimension === "device"
          ? getDeviceVendor(rawValue as string) // 设备型号转为厂商名称
          : dimension === "engine"
            ? getEngineName(rawValue as string) // 引擎名称
            : dimension === "region"
              ? getRegionName(rawValue as string) // 区域名称
              : dimension === "lang"
                ? getLanguageName(rawValue as string) // 语言名称
                : dimension === "isBot"
                  ? getBotName(rawValue as boolean) // 是否为机器人
                  : rawValue; // 其他维度直接使用原始值

    const click = record.click || 0; // 确保 click 是数字，默认 0 如果未定义

    dimensionCounts[dimValue] = (dimensionCounts[dimValue] || 0) + click;
    totalClicks += click;
  });

  // 第二步：生成统计列表并计算百分比
  const statsList: Stat[] = Object.entries(dimensionCounts).map(
    ([dimValue, clicks]) => {
      const percentage = totalClicks > 0 ? (clicks / totalClicks) * 100 : 0;
      return {
        dimension: dimValue,
        clicks,
        percentage: percentage.toFixed(0) + "%",
      };
    },
  );

  // 第三步：按百分比降序排序
  statsList.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

  return statsList;
}

export function DailyPVUVChart({
  data,
  timeRange,
  setTimeRange,
  user,
}: {
  data: UrlMeta[];
  timeRange: string;
  setTimeRange: React.Dispatch<React.SetStateAction<string>>;
  user: Pick<User, "id" | "name" | "team">;
}) {
  const { ref: wrapperRef, width: wrapperWidth } = useElementSize();
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("pv");

  const t = useTranslations("Components");

  const { data: plan } = useSWR<{ slAnalyticsRetention: number }>(
    `/api/plan?team=${user.team}`,
    fetcher,
  );

  const processedData = processUrlMeta(data).map((entry) => ({
    date: entry.date,
    pv: entry.clicks,
    uv: new Set(entry.ips).size,
  }));

  const dataTotal = calculateUVAndPV(data);

  const latestEntry = data[data.length - 1];
  const latestFrom = [
    latestEntry.city ? decodeURIComponent(latestEntry.city) : "",
    latestEntry.country ? `${getCountryName(latestEntry.country)}` : "",
  ]
    .filter(Boolean)
    .join(",");

  // const pointData = data.map((item) => ({
  //   id: item.id,
  //   city: item.city,
  //   latitude: item.latitude,
  //   longitude: item.longitude,
  //   clicks: item.click,
  // }));
  // const pointLabel = (d: any) => d.city;

  // 计算每个国家的点击次数
  const countryClicks: { [key: string]: number } = {};
  data.forEach((item) => {
    const country = item.country;
    if (country) {
      if (!countryClicks[country]) {
        countryClicks[country] = 0;
      }
      countryClicks[country] += item.click;
    }
  });

  const areaData = Object.entries(countryClicks).map(
    ([country, clicks], index) => ({
      id: country,
      // color: getColorByClicks(clicks, index, countryClicks),
    }),
  );

  const triggers = {
    [TopoJSONMap.selectors.feature]: (d: any) =>
      `${getCountryName(d.id)} · ${countryClicks[d.id] || 0}`,
    // [TopoJSONMap.selectors.point]: (d) => decodeURIComponent(d.city),
  };

  const refererStats = generateStatsList(data, "referer");
  const cityStats = generateStatsList(data, "city");
  const deviceStats = generateStatsList(data, "device");
  const browserStats = generateStatsList(data, "browser");
  const countryStats = generateStatsList(data, "country");
  const osStats = generateStatsList(data, "os");
  const cpuStats = generateStatsList(data, "cpu");
  const engineStats = generateStatsList(data, "engine");
  const languageStats = generateStatsList(data, "lang");
  const regionStats = generateStatsList(data, "region");
  const isBotStats = generateStatsList(data, "isBot");

  const lastVisitorInfo = t.rich("last-visitor-info", {
    location: latestFrom,
    timeAgo: () => <TimeAgoIntl date={latestEntry.updatedAt} />,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-3">
          <CardTitle>{t("Link Analytics")}</CardTitle>
          <CardDescription>{lastVisitorInfo}</CardDescription>
        </div>
        <div className="flex items-center">
          {plan && (
            <Select
              onValueChange={(value: string) => {
                setTimeRange(value);
              }}
              name="time range"
              defaultValue={timeRange}
            >
              <SelectTrigger className="mx-4 w-full min-w-28 shadow-inner">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {DATE_DIMENSION_ENUMS.map((e, i) => (
                  <div key={e.value}>
                    <SelectItem
                      disabled={e.key > plan.slAnalyticsRetention}
                      value={e.value}
                    >
                      <span className="flex items-center gap-1">
                        {t(e.label)}
                        {e.key > plan.slAnalyticsRetention && (
                          <Icons.crown className="size-3" />
                        )}
                      </span>
                    </SelectItem>
                    {i % 2 === 0 && i !== DATE_DIMENSION_ENUMS.length - 1 && (
                      <SelectSeparator />
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
          )}
          {["pv", "uv"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col items-center justify-center gap-1 border-t px-6 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-3"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-nowrap text-sm font-semibold text-muted-foreground">
                  {t(chartConfig[chart].label)}
                </span>
                <span className="text-lg font-bold leading-none">
                  {dataTotal[key as keyof typeof dataTotal].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6" ref={wrapperRef}>
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

        <VisSingleContainer
          data={{ areas: areaData }}
          width={wrapperWidth * 0.99}
        >
          <VisTopoJSONMap topojson={WorldMapTopoJSON} />
          <VisTooltip triggers={triggers} />
        </VisSingleContainer>

        <div className="my-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Referrers、isBotStats */}
          <Tabs defaultValue="referrer">
            <TabsList>
              <TabsTrigger value="referrer">{t("Referrers")}</TabsTrigger>
              <TabsTrigger value="isBot">{t("Traffic Type")}</TabsTrigger>
            </TabsList>
            <TabsContent className="h-[calc(100%-40px)]" value="referrer">
              {refererStats.length > 0 && (
                <StatsList data={refererStats} title="Referrers" />
              )}
            </TabsContent>
            <TabsContent className="h-[calc(100%-40px)]" value="isBot">
              {isBotStats.length > 0 && (
                <StatsList data={isBotStats} title="Is Bot" />
              )}
            </TabsContent>
          </Tabs>
          {/* 国家、城市 */}
          <Tabs defaultValue="country">
            <TabsList>
              <TabsTrigger value="country">{t("Country")}</TabsTrigger>
              <TabsTrigger value="city">{t("City")}</TabsTrigger>
            </TabsList>
            <TabsContent className="h-[calc(100%-40px)]" value="country">
              {countryStats.length > 0 && (
                <StatsList data={countryStats} title="Countries" />
              )}
            </TabsContent>
            <TabsContent className="h-[calc(100%-40px)]" value="city">
              {cityStats.length > 0 && (
                <StatsList data={cityStats} title="Cities" />
              )}
            </TabsContent>
          </Tabs>
          {/* browserStats、engineStats */}
          <Tabs defaultValue="browser">
            <TabsList>
              <TabsTrigger value="browser">{t("Browser")}</TabsTrigger>
              <TabsTrigger value="engine">{t("Engine")}</TabsTrigger>
            </TabsList>
            <TabsContent className="h-[calc(100%-40px)]" value="browser">
              {browserStats.length > 0 && (
                <StatsList data={browserStats} title="Browsers" />
              )}
            </TabsContent>
            <TabsContent className="h-[calc(100%-40px)]" value="engine">
              {engineStats.length > 0 && (
                <StatsList data={engineStats} title="Engines" />
              )}
            </TabsContent>
          </Tabs>

          {/* Languages、regionStats */}
          <Tabs className="h-full" defaultValue="language">
            <TabsList>
              <TabsTrigger value="language">{t("Language")}</TabsTrigger>
              <TabsTrigger value="region">{t("Region")}</TabsTrigger>
            </TabsList>
            <TabsContent className="h-[calc(100%-40px)]" value="language">
              {languageStats.length > 0 && (
                <StatsList data={languageStats} title="Languages" />
              )}
            </TabsContent>
            <TabsContent className="h-[calc(100%-40px)]" value="region">
              {regionStats.length > 0 && (
                <StatsList data={regionStats} title="Regions" />
              )}
            </TabsContent>
          </Tabs>
          {/* deviceStats、osStats、cpuStats */}
          <Tabs defaultValue="device">
            <TabsList>
              <TabsTrigger value="device">{t("Device")}</TabsTrigger>
              <TabsTrigger value="os">{t("OS")}</TabsTrigger>
              <TabsTrigger value="cpu">CPU</TabsTrigger>
            </TabsList>
            <TabsContent className="h-[calc(100%-40px)]" value="device">
              {deviceStats.length > 0 && (
                <StatsList data={deviceStats} title="Devices" />
              )}
            </TabsContent>
            <TabsContent className="h-[calc(100%-40px)]" value="os">
              {osStats.length > 0 && <StatsList data={osStats} title="OS" />}
            </TabsContent>
            <TabsContent className="h-[calc(100%-40px)]" value="cpu">
              {cpuStats.length > 0 && <StatsList data={cpuStats} title="CPU" />}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsList({ data, title }: { data: Stat[]; title: string }) {
  const [showAll, setShowAll] = useState(false);
  const displayedData = showAll ? data.slice(0, 50) : data.slice(0, 8);
  const t = useTranslations("Components");
  return (
    <div className="h-full rounded-lg border">
      <div className="flex items-center justify-between border-b px-5 py-2 text-xs font-medium text-muted-foreground">
        <span>{t("Name")}</span>
        <span className="">{t("Visitors")}</span>
      </div>
      <div
        className={`scrollbar-hidden overflow-hidden overflow-y-auto px-4 pb-4 pt-2 transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: "18rem",
        }}
      >
        {displayedData.map((ref) => (
          <div
            key={ref.dimension}
            className="group relative mt-1.5 h-7 w-full items-center rounded-lg bg-neutral-100 transition-all duration-100 hover:bg-blue-500/60 dark:bg-neutral-600"
          >
            <div className="flex h-7 items-center justify-between px-2 text-xs">
              {isLink(ref.dimension) ? (
                <Link
                  className="w-2/3 truncate font-medium hover:opacity-70 hover:after:content-['↗']"
                  href={ref.dimension}
                  target="_blank"
                >
                  {removeUrlSuffix(ref.dimension)}
                </Link>
              ) : (
                <p className="font-medium">
                  {decodeURIComponent(ref.dimension)}
                </p>
              )}
              <p className="">
                <span>{ref.clicks}</span>
                <span className="ml-1 hidden animate-fade-in transition-all duration-200 group-hover:inline-block">
                  ({ref.percentage})
                </span>
              </p>
            </div>
            <div
              className="absolute left-0 top-0 h-7 rounded-lg px-0.5 py-1 leading-none transition-all duration-300"
              style={{
                width: `${ref.percentage}`,
                background: `linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.7))`,
                opacity: parseFloat(ref.percentage) / 100 + 0.3,
              }}
            ></div>
          </div>
        ))}
      </div>

      {data.length > 8 && (
        <div className="mb-3 mt-1 text-center">
          <Button
            variant={"outline"}
            onClick={() => setShowAll(!showAll)}
            className="h-7 px-4 py-1 text-xs"
          >
            {showAll ? "Hide" : `Load More ${data.length - 8}+`}
          </Button>
        </div>
      )}
    </div>
  );
}

// const baseColors = [
//   "#ff6b7e",
//   "#a6cc74",
//   "#4d8cfd",
//   "#f4b83e",
//   "#FF00FF",
//   "#6859be",
// ];

// const hexToRgb = (hex: string) => {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16),
//       }
//     : null;
// };

// const getColorByClicks = (
//   clicks: number,
//   baseColorIndex: number,
//   countryClicks: { [key: string]: number },
// ) => {
//   const maxClicks = Math.max(...Object.values(countryClicks));
//   const minClicks = Math.min(...Object.values(countryClicks));

//   // 归一化点击次数
//   const normalized =
//     maxClicks === minClicks
//       ? 0
//       : (clicks - minClicks) / (maxClicks - minClicks);

//   // 获取基础颜色
//   const baseColor = hexToRgb(baseColors[baseColorIndex % baseColors.length]);

//   // 最低60%透明度，最高100%不透明
//   const alpha = 0.5 + normalized * 0.5;

//   return `rgba(${baseColor!.r}, ${baseColor!.g}, ${baseColor!.b}, ${alpha})`;
// };
