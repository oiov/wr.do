"use client";

import { ScrapeMeta } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
    const date = new Date(item.updatedAt).toISOString().split("T")[0]; // 获取日期部分 (yyyy-mm-dd)

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
  const processedData = processChartData(chartData, type1, type2);

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

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Total requests of {type1} and {type2}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            className="mt-6"
            accessibilityLayer
            data={processedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
            <Line
              dataKey="source1"
              type="monotone"
              stroke="var(--color-source1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="source2"
              type="monotone"
              stroke="var(--color-source2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
