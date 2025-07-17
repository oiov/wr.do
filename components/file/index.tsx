"use client";

import { useEffect, useState, useTransition } from "react";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { UserFileData } from "@/lib/dto/files";
import { BucketItem, ClientStorageCredentials } from "@/lib/r2";
import { cn, fetcher } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClickableTooltip } from "@/components/ui/tooltip";
import UserFileList from "@/components/file/file-list";
import { Icons } from "@/components/shared/icons";

import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { PaginationWrapper } from "../shared/pagination";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { CircularStorageIndicator, FileSizeDisplay } from "./storage-size";
import { FileUploader } from "./upload";

export interface FileListProps {
  user: Pick<User, "id" | "name" | "apiKey" | "email" | "role" | "team">;
  action: string;
}

export interface BucketInfo extends BucketItem {
  platform?: string;
  channel?: string;
  provider_name?: string;
}

export type DisplayType = "List" | "Grid";

export interface FileListData {
  total: number;
  totalSize: number;
  list: UserFileData[];
}

export interface StorageUserPlan {
  stMaxTotalSize: string;
  stMaxFileSize: string;
}

export default function UserFileManager({ user, action }: FileListProps) {
  const { isMobile } = useMediaQuery();
  const t = useTranslations("List");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [displayType, setDisplayType] = useState<DisplayType>("List");
  const [showMutiCheckBox, setShowMutiCheckBox] = useState(false);
  const [currentBucketInfo, setCurrentBucketInfo] = useState<BucketInfo>({
    bucket: "",
    custom_domain: "",
    prefix: "",
    platform: "",
    channel: "",
    provider_name: "",
    public: true,
  });
  const [currentProvider, setCurrentProvider] =
    useState<ClientStorageCredentials | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<UserFileData[]>([]);
  const [isDeleting, startDeleteTransition] = useTransition();

  const [currentSearchType, setCurrentSearchType] = useState("name");
  const [searchParams, setSearchParams] = useState({
    name: "",
    fileSize: "",
    mimeType: "",
    status: "1",
  });

  // const isAdmin = action.includes("/admin");

  const { mutate } = useSWRConfig();

  const { data: s3Configs, isLoading } = useSWR<ClientStorageCredentials[]>(
    `${action}/s3/files/configs`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const {
    data: files,
    isLoading: isLoadingFiles,
    error,
  } = useSWR<FileListData>(
    currentBucketInfo.bucket
      ? `${action}/s3/files?provider=${currentBucketInfo.provider_name}&bucket=${currentBucketInfo.bucket}&page=${currentPage}&pageSize=${pageSize}&name=${searchParams.name}&fileSize=${searchParams.fileSize}&mimeType=${searchParams.mimeType}&status=${searchParams.status}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // 防抖
    },
  );

  const { data: plan } = useSWR<StorageUserPlan>(
    `/api/plan?team=${user.team}`,
    fetcher,
  );

  useEffect(() => {
    if (s3Configs && s3Configs.length > 0) {
      setCurrentProvider(s3Configs[0]);
      setCurrentBucketInfo({
        bucket: s3Configs[0].buckets[0].bucket,
        custom_domain: s3Configs[0].buckets[0].custom_domain,
        prefix: s3Configs[0].buckets[0].prefix,
        platform: s3Configs[0].platform,
        channel: s3Configs[0].channel,
        provider_name: s3Configs[0].provider_name,
        public: s3Configs[0].buckets[0].public,
      });
    }
  }, [s3Configs]);

  const handleRefresh = () => {
    setSelectedFiles([]);
    mutate(
      `${action}/s3/files?provider=${currentBucketInfo.provider_name}&bucket=${currentBucketInfo.bucket}&page=${currentPage}&pageSize=${pageSize}&name=${searchParams.name}&fileSize=${searchParams.fileSize}&mimeType=${searchParams.mimeType}&status=${searchParams.status}`,
      undefined,
    );
  };

  const handleChangeBucket = (
    provider: ClientStorageCredentials,
    bucket: string,
  ) => {
    console.log(provider, bucket);

    setCurrentBucketInfo({
      bucket: bucket,
      custom_domain: provider.buckets.find((b) => b.bucket === bucket)
        ?.custom_domain,
      prefix: provider.buckets.find((b) => b.bucket === bucket)?.prefix,
      platform: provider.platform,
      channel: provider.channel,
      provider_name: provider.provider_name,
      public: true,
    });
  };

  const handleSelectAllFiles = () => {
    if (selectedFiles.length === files?.list.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files?.list || []);
    }
  };

  const handleDeleteAllFiles = () => {
    startDeleteTransition(async () => {
      try {
        toast.promise(
          fetch(`${action}/s3/files`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              keys: selectedFiles.map((file) => file.path),
              ids: selectedFiles.map((file) => file.id),
              bucket: currentBucketInfo.bucket,
              provider: currentBucketInfo.provider_name,
            }),
          }),
          {
            loading: "Deleting files...",
            success: "Files deleted successfully!",
            error: "Error deleting files",
            finally: handleRefresh,
          },
        );
      } catch (error) {
        console.error("Error deleting files:", error);
        toast.success("Error deleting files");
      }
    });
  };

  return (
    <Tabs value={displayType}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border bg-neutral-50 p-2 dark:bg-neutral-900">
        <TabsList>
          <TabsTrigger value="List" onClick={() => setDisplayType("List")}>
            <Icons.list className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="Grid" onClick={() => setDisplayType("Grid")}>
            <Icons.layoutGrid className="size-4" />
          </TabsTrigger>
        </TabsList>
        {/* Search Input */}
        <div className="flex flex-1 items-center sm:mr-auto">
          <Select
            value={currentSearchType}
            onValueChange={(value) => {
              setCurrentSearchType(value);
              setSearchParams({
                name: "",
                fileSize: "",
                mimeType: "",
                status: "1",
              });
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px] rounded-r-none text-sm">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {[
                { lebal: "Name", value: "name" },
                { lebal: "Size", value: "fileSize" },
                { lebal: "Type", value: "mimeType" },
                { lebal: "Status", value: "status" },
              ].map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {t(item.lebal)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="min-w-28 rounded-l-none border-l-0 placeholder:text-xs sm:w-48 sm:flex-none"
            placeholder={`Search by ${currentSearchType}...`}
            value={searchParams[currentSearchType] || ""}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                [currentSearchType]: e.target.value,
              });
              setCurrentPage(1);
            }}
          />
        </div>
        {/* Storage */}
        {files && files.totalSize > 0 && plan && (
          <ClickableTooltip
            content={
              <div className="w-80">
                <FileSizeDisplay files={files} plan={plan} t={t} />
              </div>
            }
          >
            <CircularStorageIndicator files={files} plan={plan} size={36} />
          </ClickableTooltip>
        )}
        {/* Bucket Select */}
        {isLoading ? (
          <Skeleton className="h-9 w-[120px] rounded border-r-0 shadow-inner" />
        ) : (
          s3Configs &&
          s3Configs.length > 0 && (
            <Select
              value={`${currentBucketInfo.provider_name}|${currentBucketInfo.bucket}`}
              onValueChange={(value) => {
                const [providerName, bucketName] = value.split("|");
                const provider = s3Configs.find(
                  (p) => p.provider_name === providerName,
                );
                provider && handleChangeBucket(provider, bucketName);
              }}
            >
              <SelectTrigger className="flex-1 break-all text-left sm:w-[120px] sm:flex-none">
                <SelectValue placeholder="Select a bucket" />
              </SelectTrigger>
              <SelectContent>
                {s3Configs.map((provider, index) => (
                  <SelectGroup>
                    <SelectLabel>{provider.provider_name}</SelectLabel>
                    {provider.buckets?.map((item) => (
                      <SelectItem
                        key={item.bucket}
                        value={`${provider.provider_name}|${item.bucket}`}
                      >
                        {item.bucket}
                      </SelectItem>
                    ))}
                    {index !== s3Configs.length - 1 && <SelectSeparator />}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          )
        )}
        {/* Uploader */}
        {!isLoading &&
          s3Configs &&
          s3Configs.length > 0 &&
          currentBucketInfo && (
            <FileUploader
              bucketInfo={currentBucketInfo}
              action="/api/storage"
              plan={plan}
              userId={user.id}
              onRefresh={handleRefresh}
            />
          )}
        {/* Muti Checkbox */}
        <div className="flex items-center">
          <Button
            className={cn(
              "h-9 rounded-r-none border-r-0",
              showMutiCheckBox
                ? "border-0 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "",
            )}
            variant="outline"
            size="icon"
            onClick={() => setShowMutiCheckBox(!showMutiCheckBox)}
          >
            <Icons.listChecks className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex h-9 w-8 items-center justify-center gap-1 rounded-r-md border",
                showMutiCheckBox
                  ? "border-neutral-600 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : "",
              )}
            >
              <Icons.chevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllFiles}
                  className="w-full"
                >
                  <span className="text-xs">{t("Select all")}</span>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleDeleteAllFiles}
                  disabled={isDeleting || selectedFiles.length === 0}
                >
                  {isDeleting && (
                    <Icons.spinner className="mr-1 size-4 animate-spin" />
                  )}
                  <span className="text-xs">{t("Delete selected")}</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Refresh */}
        <Button
          className="h-9"
          size="icon"
          variant="outline"
          onClick={() => handleRefresh()}
          disabled={isLoadingFiles}
        >
          {isLoadingFiles ? (
            <Icons.refreshCw className="size-4 animate-spin" />
          ) : (
            <Icons.refreshCw className="size-4" />
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex size-20 animate-pulse items-center justify-center rounded-full bg-muted">
            <Icons.storage className="size-10" />
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Icons.spinner className="mr-1 size-4 animate-spin" />
            {t("Loading storage buckets")}...
          </div>
        </div>
      )}

      {!isLoading && error && (
        <EmptyPlaceholder className="col-span-full mt-8 shadow-none">
          <EmptyPlaceholder.Icon name="close" />
          <EmptyPlaceholder.Title>
            {t("Configuration Error")}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {error.message}, Please check your bucket configuration and try
            again
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}

      {!isLoading &&
        !error &&
        !s3Configs?.length &&
        !currentBucketInfo.bucket && (
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

      {!isLoading &&
        !error &&
        s3Configs &&
        s3Configs.length > 0 &&
        currentBucketInfo.bucket && (
          <UserFileList
            user={user}
            files={files}
            isLoading={isLoadingFiles}
            view={displayType}
            bucketInfo={currentBucketInfo}
            action={action}
            showMutiCheckBox={showMutiCheckBox}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onRefresh={handleRefresh}
            onSelectAll={handleSelectAllFiles}
            onDeleteAll={handleDeleteAllFiles}
          />
        )}

      {files && Math.ceil(files.total / pageSize) > 1 && (
        <PaginationWrapper
          className="mt-4"
          layout={isMobile ? "right" : "split"}
          total={files.total}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </Tabs>
  );
}
