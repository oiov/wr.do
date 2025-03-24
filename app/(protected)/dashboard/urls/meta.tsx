"use client";

import { UrlMeta, User } from "@prisma/client";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { DailyPVUVChart } from "./meta-chart";

export interface UrlMetaProps {
  user: Pick<User, "id" | "name">;
  action: string;
  urlId: string;
}

export default function UserUrlMetaInfo({ user, action, urlId }: UrlMetaProps) {
  const { data, isLoading } = useSWR<UrlMeta[]>(
    `${action}?id=${urlId}`,
    fetcher,
    { focusThrottleInterval: 30000 }, // 30 seconds,
  );

  if (isLoading)
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-40 w-full" />
      </div>
    );

  if (!data || data.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Title>No Stats</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any stats yet.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  return (
    <div className="animate-fade-down rounded-t-none">
      <DailyPVUVChart data={data} />
    </div>
  );
}
