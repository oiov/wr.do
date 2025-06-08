"use client";

import { ScrapeMeta } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useElementSize } from "@/hooks/use-element-size";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const processChartData = (data: ScrapeMeta[], type1: string, type2: string) => {
  const aggregatedData: Record<
    string,
    { date: string; source1: number; source2: number }
  > = {};

  data.forEach((item) => {
    const date = new Date(item.createdAt).toISOString().split("T")[0]; // 获取日期部分 (yyyy-mm-dd)

    if (!aggregatedData[date]) {
      aggregatedData[date] = { date, source1: 0, source2: 0 };
    }

    // 根据类型分别累加点击数
    if (item.type === type1) {
      aggregatedData[date].source1 += item.click;
    } else if (item.type === type2) {
      aggregatedData[date].source2 += item.click;
    }
  });

  // 将聚合后的数据转换为数组形式，以便绘图
  return Object.values(aggregatedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};

interface LineChartMultipleProps {
  chartData: ScrapeMeta[];
  type1: string;
  type2: string;
}

export function LineChartMultiple({
  chartData,
  type1,
  type2,
}: LineChartMultipleProps) {
  const { ref: wrapperRef, width: wrapperWidth } = useElementSize();
  const processedData = processChartData(chartData, type1, type2);

  const t = useTranslations("Components");

  const chartConfig = {
    source1: {
      label: type1,
      color: "hsl(var(--chart-1))",
    },
    source2: {
      label: type2,
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const message = type2
    ? t("total-requests-two-types", { type1, type2 })
    : t("total-requests-one-type", { type1 });

  return (
    <Card>
      <CardHeader>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent ref={wrapperRef}>
        <ChartContainer config={chartConfig}>
          <AreaChart
            className="mt-6"
            accessibilityLayer
            data={processedData}
            width={wrapperWidth}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="source1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-source1)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-source1)`}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="source2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-source2)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-source2)`}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={true}
              tickMargin={2}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis width={20} axisLine={false} tickLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Area
              type="monotone"
              dataKey="source1"
              stroke={`var(--color-source1)`}
              fillOpacity={1}
              fill="url(#source1)"
            />
            <Area
              type="monotone"
              dataKey="source2"
              stroke={`var(--color-source2)`}
              fillOpacity={1}
              fill="url(#source2)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
