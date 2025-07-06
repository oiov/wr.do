"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import useSWR, { useSWRConfig } from "swr";

import { BucketItem, ClientStorageCredentials } from "@/lib/r2";
import { fetcher } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserFileList from "@/components/file/file-list";
import Uploader from "@/components/file/uploader";
import { Icons } from "@/components/shared/icons";

import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { Button } from "../ui/button";

export interface FileListProps {
  user: Pick<User, "id" | "name" | "apiKey" | "email" | "role">;
  action: string;
}

export interface BucketInfo extends BucketItem {
  platform?: string;
  channel?: string;
  provider_name?: string;
}

export type DisplayType = "List" | "Grid";

export default function UserFileManager({ user, action }: FileListProps) {
  const t = useTranslations("List");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayType, setDisplayType] = useState<DisplayType>("List");
  const [bucketInfo, setBucketInfo] = useState<BucketInfo>({
    bucket: "",
    custom_domain: "",
    prefix: "",
    platform: "",
    channel: "",
    provider_name: "",
  });

  const { mutate } = useSWRConfig();

  const { data: r2Configs, isLoading } = useSWR<ClientStorageCredentials>(
    `${action}/r2/configs`,
    fetcher,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (r2Configs && r2Configs.buckets && r2Configs.buckets.length > 0) {
      setBucketInfo({
        ...r2Configs.buckets[0],
        platform: r2Configs.platform,
        channel: r2Configs.channel,
        provider_name: r2Configs.provider_name,
      });
    }
  }, [r2Configs]);

  const handleRefresh = () => {
    mutate(
      `${action}/r2/files?bucket=${bucketInfo.bucket}&page=${currentPage}&size=${pageSize}`,
      undefined,
    );
  };

  const handleChangeBucket = (bucket: string) => {
    const newBucketInfo = r2Configs?.buckets?.find(
      (item) => item.bucket === bucket,
    );
    setBucketInfo({
      ...bucketInfo,
      ...newBucketInfo,
    });
  };

  return (
    <div>
      <Tabs value={displayType}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <TabsList className="mr-auto">
            <TabsTrigger value="List" onClick={() => setDisplayType("List")}>
              <Icons.list className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="Grid" onClick={() => setDisplayType("Grid")}>
              <Icons.layoutGrid className="size-4" />
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <Skeleton className="h-9 w-[120px] rounded border-r-0 shadow-inner" />
          ) : (
            <Select
              value={bucketInfo.bucket}
              onValueChange={handleChangeBucket}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select a bucket" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="mx-auto text-center">
                    {r2Configs?.provider_name}
                  </SelectLabel>
                  {r2Configs?.buckets?.map((item) => (
                    <SelectItem
                      key={item.bucket}
                      value={item.bucket}
                      onClick={() => handleChangeBucket(item.bucket)}
                    >
                      {item.bucket}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {/* <SelectSeparator /> */}
              </SelectContent>
            </Select>
          )}

          <Uploader
            bucketInfo={bucketInfo}
            action={action}
            onRefresh={handleRefresh}
          />
          <Button
            className="h-9"
            size={"icon"}
            variant={"outline"}
            onClick={() => handleRefresh()}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCwIcon className="size-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="size-4" />
            )}
          </Button>
        </div>

        {isLoading && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex size-20 animate-pulse items-center justify-center rounded-full bg-muted">
              <Icons.storage className="size-10" />
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <RefreshCwIcon className="size-4 animate-spin" />
              {t("Loading storage buckets")}...
            </div>
          </div>
        )}

        {!isLoading && !r2Configs?.buckets?.length && (
          <EmptyPlaceholder className="col-span-full mt-8 shadow-none">
            <EmptyPlaceholder.Icon name="storage" />
            <EmptyPlaceholder.Title>
              {t("No buckets found")}
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {t(
                "The administrator has not configured the storage bucket, no file can be uploaded",
              )}
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}

        {!isLoading && r2Configs?.buckets && r2Configs.buckets.length > 0 && (
          <UserFileList
            view={displayType}
            bucketInfo={bucketInfo}
            action={action}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            onRefresh={handleRefresh}
          />
        )}
      </Tabs>
    </div>
  );
}
