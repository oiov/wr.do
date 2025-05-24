"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  // const tickInterval =
  //   chartData.length <= 10 ? 0 : Math.ceil(chartData.length / 10);
  const getTickInterval = (dataLength: number) => {
    if (dataLength <= 6) return 0; // 显示所有刻度
    if (dataLength <= 12) return 1; // 每隔1个显示
    if (dataLength <= 24) return Math.ceil(dataLength / 8); // 大约8个刻度
    return Math.ceil(dataLength / 6); // 大约6个刻度
  };
  const tickInterval = getTickInterval(chartData.length);

  return (
    <div className={cn(`rounded-lg border p-3 backdrop-blur-xl`, className)}>
      <div className="mb-1 flex items-center text-base font-semibold">
        <StatusDot status={1} />
        <h3 className="ml-2">Realtime Visits</h3>
        <Icons.mousePointerClick className="ml-auto size-4 text-muted-foreground" />
      </div>
      <p className="mb-2 text-lg font-semibold">{totalClicks}</p>
      <ResponsiveContainer width={300} height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barCategoryGap={1}
        >
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            interval={tickInterval}
            tickCount={Math.min(chartData.length, 10)}
            axisLine={false}
            tickLine={false}
            type="category"
            scale="point"
            padding={{ left: 14, right: 20 }}
            tickFormatter={(value) => value}
          />
          <YAxis
            // domain={[0, maxCount]}
            domain={["dataMin", "dataMax"]}
            tickCount={5}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-md bg-primary-foreground/90 p-2 text-sm backdrop-blur-lg">
                    <p className="label">{`${label}`}</p>
                    <p className="label">{`Visits: ${payload[0].value}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="count"
            fill="#36d399"
            radius={[1, 1, 0, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
