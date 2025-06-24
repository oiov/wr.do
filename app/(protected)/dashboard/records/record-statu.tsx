"use client";

import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { fetcher, nFormatter } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "@/components/dashboard/count-up";

export interface RecordStatusProps {
  user: Pick<User, "id" | "name" | "apiKey" | "email" | "role">;
  action: string;
}

export default function UserRecordStatus({ action }: RecordStatusProps) {
  const { data, isLoading, error } = useSWR<Record<string, number>>(
    `${action}/status`,
    fetcher,
  );

  if (isLoading || error)
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        <Skeleton className="h-[102px] w-full rounded-lg" />
        <Skeleton className="h-[102px] w-full rounded-lg" />
        <Skeleton className="h-[102px] w-full rounded-lg" />
        <Skeleton className="h-[102px] w-full rounded-lg" />
      </div>
    );
  return (
    data && (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        <StatuInfoCard
          title="Active"
          total={data["total"]}
          monthTotal={data["active"]}
        />
        <StatuInfoCard
          title="Inactive"
          total={data["total"]}
          monthTotal={data["inactive"]}
        />
        <StatuInfoCard
          title="Pending"
          total={data["total"]}
          monthTotal={data["pending"]}
        />
        <StatuInfoCard
          title="Rejected"
          total={data["total"]}
          monthTotal={data["rejected"]}
        />
      </div>
    )
  );
}

export function StatuInfoCard({
  title,
  total,
  monthTotal,
}: {
  title: string;
  total?: number;
  monthTotal: number;
}) {
  const t = useTranslations("Components");

  const statusConfig = {
    Active: {
      color: "bg-green-500",
      textColor: "text-green-500",
      gradient: "from-green-400 to-green-600",
      shadow: "shadow-green-500/25",
    },
    Inactive: {
      color: "bg-gray-700",
      textColor: "text-gray-700",
      gradient: "from-gray-400 to-gray-600",
      shadow: "shadow-gray-500/25",
    },
    Pending: {
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      gradient: "from-yellow-400 to-yellow-600",
      shadow: "shadow-yellow-500/25",
    },
    Rejected: {
      color: "bg-red-500",
      textColor: "text-red-500",
      gradient: "from-red-400 to-red-600",
      shadow: "shadow-red-500/25",
    },
  };

  const config = statusConfig[title];
  const percentage = total && total > 0 ? (monthTotal / total) * 100 : 0;
  const barHeight = Math.max(8, Math.min(100, percentage));

  return (
    <Card className="grids group relative animate-fade-in overflow-hidden bg-gray-50/70 p-4 backdrop-blur-lg transition-all duration-300 hover:shadow-lg dark:bg-primary-foreground">
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium">{t(title)}</div>
          <div className="mt-4 flex items-end gap-2 text-2xl font-bold">
            <CountUp count={monthTotal} />
            <p className="align-top text-base text-slate-500">
              / {nFormatter(total || 0)}
            </p>
          </div>
        </div>

        <div className="ml-4 flex h-16 items-end">
          <div className="relative flex flex-col items-center">
            {/* 柱状图背景 */}
            <div className="relative h-14 w-7 overflow-hidden rounded-lg border border-gray-300/20 bg-gray-200/50 backdrop-blur-sm dark:border-gray-600/20 dark:bg-gray-700/50">
              {/* 主柱状图 */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${config.gradient} rounded-lg transition-all duration-700 ease-out ${config.shadow}`}
                style={{ height: `${barHeight}%` }}
              />
              {/* 光泽效果 */}
              <div
                className="absolute bottom-0 left-0 w-1/3 rounded-lg bg-gradient-to-t from-white/30 to-white/10 transition-all duration-700 ease-out"
                style={{ height: `${barHeight}%` }}
              />
              {/* 顶部高光 */}
              {barHeight > 15 && (
                <div
                  className="absolute left-0 right-0 h-1 rounded-t-lg bg-white/40"
                  style={{ top: `${100 - barHeight}%` }}
                />
              )}
              <span
                className={`absolute left-0 top-0.5 scale-75 text-xs font-semibold ${config.textColor}`}
              >
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
