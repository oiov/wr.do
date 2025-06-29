"use client";

import { useTranslations } from "next-intl";
import useSWR from "swr";

import { fetcher, nFormatter } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatusConfig {
  [key: string]: {
    color: string;
    textColor: string;
    gradient: string;
    shadow: string;
  };
}

// 用户记录状态配置
export const USER_RECORD_STATUS_CONFIG: StatusConfig = {
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

// 短链状态配置
export const URL_STATUS_CONFIG: StatusConfig = {
  Actived: {
    color: "bg-green-500",
    textColor: "text-green-500",
    gradient: "from-green-400 to-green-600",
    shadow: "shadow-green-500/25",
  },
  Disabled: {
    color: "bg-gray-600",
    textColor: "text-gray-600",
    gradient: "from-gray-400 to-gray-600",
    shadow: "shadow-gray-500/25",
  },
  Expired: {
    color: "bg-red-500",
    textColor: "text-red-500",
    gradient: "from-red-400 to-red-600",
    shadow: "shadow-red-500/25",
  },
  PasswordProtected: {
    color: "bg-blue-500",
    textColor: "text-blue-500",
    gradient: "from-blue-400 to-blue-600",
    shadow: "shadow-blue-500/25",
  },
};

// 用户记录状态组件
export function UserRecordStatus({ action }: { action: string }) {
  return (
    <GenericStatusDashboard
      apiEndpoint={action}
      statusItems={["Active", "Inactive", "Pending", "Rejected"]}
      statusConfig={USER_RECORD_STATUS_CONFIG}
      gridCols={4}
    />
  );
}

// 短链状态组件
export function UrlStatus({ action }: { action: string }) {
  return (
    <GenericStatusDashboard
      apiEndpoint={action}
      statusItems={["Actived", "Disabled", "Expired", "PasswordProtected"]}
      statusConfig={URL_STATUS_CONFIG}
      gridCols={4}
    />
  );
}

export function GenericStatusDashboard({
  apiEndpoint,
  statusItems,
  statusConfig,
  gridCols = 4,
}: {
  apiEndpoint: string;
  statusItems: string[];
  statusConfig: StatusConfig;
  gridCols?: number;
}) {
  const { data, isLoading, error } = useSWR<Record<string, number>>(
    `${apiEndpoint}/status`,
    fetcher,
  );

  const gridClasses =
    {
      2: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    }[gridCols] || "grid-cols-2 sm:grid-cols-4 lg:grid-cols-4";

  if (isLoading || error) {
    return (
      <div className={`grid gap-4 ${gridClasses}`}>
        {statusItems.map((_, index) => (
          <Skeleton key={index} className="h-[102px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    data && (
      <div className={`grid gap-4 ${gridClasses}`}>
        {statusItems.map((status) => (
          <StatusInfoCard
            key={status}
            title={status}
            total={data["total"]}
            currentTotal={data[status.toLowerCase()]}
            statusConfig={statusConfig}
          />
        ))}
      </div>
    )
  );
}

export function StatusInfoCard({
  title,
  total,
  currentTotal,
  statusConfig,
}: {
  title: string;
  total?: number;
  currentTotal: number;
  statusConfig: StatusConfig;
}) {
  const t = useTranslations("Components");

  const config = statusConfig[title];
  const percentage =
    total && total > 0 && currentTotal > 0 ? (currentTotal / total) * 100 : 0;
  const barHeight = Math.max(8, Math.min(100, percentage));

  return (
    <Card className="grids group relative animate-fade-in overflow-hidden bg-gray-50/70 p-4 backdrop-blur-lg transition-all duration-300 hover:shadow-lg dark:bg-primary-foreground">
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium">{t(title)}</div>
          <div className="mt-4 flex items-center gap-2 text-xl font-bold">
            {nFormatter(currentTotal || 0)}
            <p className="mt-1.5 text-xs text-slate-500">
              / {nFormatter(total || 0)}
            </p>
          </div>
        </div>

        <div className="ml-4 flex h-16 items-end">
          <div className="relative flex flex-col items-center">
            <div className="relative h-14 w-7 overflow-hidden rounded-lg border border-gray-300/20 bg-gray-200/50 backdrop-blur-sm dark:border-gray-600/20 dark:bg-gray-700/50">
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${config.gradient} rounded-lg transition-all duration-700 ease-out ${config.shadow}`}
                style={{ height: `${barHeight}%` }}
              />
              <div
                className="absolute bottom-0 left-0 w-1/3 rounded-lg bg-gradient-to-t from-white/30 to-white/10 transition-all duration-700 ease-out"
                style={{ height: `${barHeight}%` }}
              />
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
