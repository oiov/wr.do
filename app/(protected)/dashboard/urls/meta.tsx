"use client";

import { useState } from "react";
import { UrlMeta, User } from "@prisma/client";
import { useTranslations } from "next-intl";
import useSWR from "swr";

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
  const t = useTranslations("Components");
  const [timeRange, setTimeRange] = useState<string>("7d");
  const { data, isLoading } = useSWR<UrlMeta[]>(
    `${action}?id=${urlId}&range=${timeRange}`,
    fetcher,
    { focusThrottleInterval: 30000 }, // 30 seconds,
  );

  const { data: plan } = useSWR<{ slAnalyticsRetention: number }>(
    `/api/plan?team=${user.team}`,
    fetcher,
  );

  if (isLoading)
    return (
      <div className="space-y-2">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );

  if (!data || data.length === 0) {
    return (
      <EmptyPlaceholder className="shadow-none">
        <EmptyPlaceholder.Title>{t("No Visits")}</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          {t("You don't have any visits yet in")}{" "}
          {t(
            DATE_DIMENSION_ENUMS.find((e) => e.value === timeRange)?.label ||
              "",
          )}
          .
          {plan && (
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
