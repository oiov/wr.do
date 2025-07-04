"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import useSWR from "swr";

import { ClientStorageCredentials } from "@/lib/r2";
import { fetcher } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileManager from "@/components/file/file-manager";
import Uploader from "@/components/file/uploader";
import { Icons } from "@/components/shared/icons";

export interface FileListProps {
  user: Pick<User, "id" | "name" | "apiKey" | "email" | "role">;
  action: string;
}

export type BucketInfo = {
  bucket: string;
  custom_domain?: string;
  prefix?: string;
  platform?: string;
  channel?: string;
  provider_name?: string;
};

export type DisplayType = "List" | "Grid";

export default function UserFileList({ user, action }: FileListProps) {
  const [displayType, setDisplayType] = useState<DisplayType>("List");
  const [bucketInfo, setBucketInfo] = useState<BucketInfo>({
    bucket: "",
    custom_domain: "",
    prefix: "",
    platform: "",
    channel: "",
    provider_name: "",
  });

  const { data: r2Configs, isLoading } = useSWR<ClientStorageCredentials>(
    `${action}/r2/configs`,
    fetcher,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (r2Configs && r2Configs.buckets && r2Configs.buckets.length > 0) {
      setBucketInfo({
        bucket: r2Configs.buckets[0],
        custom_domain: r2Configs.custom_domain?.[0],
        prefix: r2Configs.prefix,
        platform: r2Configs.platform,
        channel: r2Configs.channel,
        provider_name: r2Configs.provider_name,
      });
    }
  }, [r2Configs]);

  const handleChangeBucket = (bucket: string) => {
    setBucketInfo({
      ...bucketInfo,
      bucket,
    });
  };

  return (
    <>
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
                    {r2Configs?.buckets?.map((bucket) => (
                      <SelectItem
                        key={bucket}
                        value={bucket}
                        onClick={() => handleChangeBucket(bucket)}
                      >
                        {bucket}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {/* <SelectSeparator /> */}
                </SelectContent>
              </Select>
            )}

            <Uploader bucketInfo={bucketInfo} action={action} />
          </div>

          <FileManager
            view={displayType}
            bucketInfo={bucketInfo}
            action={action}
          />
        </Tabs>
      </div>
    </>
  );
}
