"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";
import StatusDot from "@/components/dashboard/status-dot";
import { Icons } from "@/components/shared/icons";

interface ChartData {
  time: string;
  count: number;
}

interface RealtimeChartProps {
  className?: string;
  chartData: ChartData[];
  totalClicks: number;
}

export const RealtimeChart = ({
  className,
  chartData,
  totalClicks,
}: RealtimeChartProps) => {
  const t = useTranslations("Components");
  const getTickInterval = (dataLength: number) => {
    if (dataLength <= 6) return 0;
    if (dataLength <= 12) return 1;
    if (dataLength <= 24) return Math.ceil(dataLength / 8);
    return Math.ceil(dataLength / 6);
  };

  const filteredChartData = chartData.filter((item, index) => {
    return item.count !== 0 || index === chartData.length - 1;
  });
  const tickInterval = getTickInterval(filteredChartData.length);

  return (
    <div className={cn(`rounded-lg border p-3 backdrop-blur-2xl`, className)}>
      <div className="mb-1 flex items-center text-base font-semibold">
        <StatusDot status={1} />
        <h3 className="ml-2">{t("Realtime Visits")}</h3>
        <Icons.mousePointerClick className="ml-auto size-4 text-muted-foreground" />
      </div>
      <p className="mb-2 text-lg font-semibold">{totalClicks}</p>
      <BarChart
        width={300}
        height={200}
        data={filteredChartData}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        barCategoryGap={1}
      >
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12 }}
          interval={tickInterval}
          tickCount={Math.min(filteredChartData.length, 10)}
          axisLine={false}
          tickLine={false}
          type="category"
          scale="point"
          padding={{ left: 14, right: 20 }}
          tickFormatter={(value) =>
            value.split(" ")[1] ? value.split(" ")[1] : value
          }
        />
        <YAxis
          domain={[0, "dataMax"]}
          tickCount={5}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-md border border-primary-foreground bg-primary py-2 text-primary-foreground backdrop-blur">
                  <p className="label px-2 text-base font-medium">{`${label}`}</p>
                  <p className="label px-2 text-sm">{`Visits: ${payload[0].value}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="count"
          fill="#2d9af9"
          radius={[1, 1, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </div>
  );
};
