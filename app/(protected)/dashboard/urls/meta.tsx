"use client";

import { useState } from "react";
import { UrlMeta, User } from "@prisma/client";
import useSWR from "swr";

import { TeamPlanQuota } from "@/config/team";
import { DATE_DIMENSION_ENUMS } from "@/lib/enums";
import { fetcher } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";

import { DailyPVUVChart } from "./meta-chart";

export interface UrlMetaProps {
  user: Pick<User, "id" | "name" | "team">;
  action: string;
  urlId: string;
}

export default function UserUrlMetaInfo({ user, action, urlId }: UrlMetaProps) {
  const [timeRange, setTimeRange] = useState<string>("24h");
  const { data, isLoading } = useSWR<UrlMeta[]>(
    `${action}?id=${urlId}&range=${timeRange}`,
    fetcher,
    { focusThrottleInterval: 30000 }, // 30 seconds,
  );

  if (isLoading)
    return (
      <div className="space-y-2">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );

  if (!data || data.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Title>No Visits</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any visits yet in last {timeRange}.
          <Select
            onValueChange={(value: string) => {
              setTimeRange(value);
            }}
            name="time range"
            defaultValue={timeRange}
          >
            <SelectTrigger className="mt-4 w-full shadow-inner">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {DATE_DIMENSION_ENUMS.map((e, i) => (
                <div key={e.value}>
                  <SelectItem
                    disabled={
                      e.key > TeamPlanQuota[user.team!].SL_AnalyticsRetention
                    }
                    value={e.value}
                  >
                    <span className="flex items-center gap-1">
                      {e.label}
                      {e.key >
                        TeamPlanQuota[user.team!].SL_AnalyticsRetention && (
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
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  return (
    <div className="animate-fade-down rounded-t-none">
      <DailyPVUVChart
        data={data}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        user={user}
      />
    </div>
  );
}
