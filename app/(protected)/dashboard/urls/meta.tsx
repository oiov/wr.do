"use client";

import { UrlMeta, User } from "@prisma/client";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { DailyPVUVChart } from "./meta-chart";

export interface UrlMetaProps {
  user: Pick<User, "id" | "name">;
  action: string;
  urlId: string;
}

export default function UserUrlMetaInfo({ user, action, urlId }: UrlMetaProps) {
  const { data, error, isLoading } = useSWR<UrlMeta[]>(
    `${action}?id=${urlId}`,
    fetcher,
  );

  if (isLoading)
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );

  if (!data) {
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
