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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [bucketInfo, setBucketInfo] = useState<BucketInfo>({
    bucket: "",
    custom_domain: "",
    prefix: "",
    platform: "",
    channel: "",
    provider_name: "",
    public: true,
  });

  const [selectedFiles, setSelectedFiles] = useState<UserFileData[]>([]);
  const [isDeleting, startDeleteTransition] = useTransition();

  const [currentSearchType, setCurrentSearchType] = useState("name");
  const [searchParams, setSearchParams] = useState({
    name: "",
    fileSize: "",
    mimeType: "",
  });

  // const isAdmin = action.includes("/admin");

  const { mutate } = useSWRConfig();

  const { data: r2Configs, isLoading } = useSWR<ClientStorageCredentials>(
    `${action}/r2/files/configs`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const { data: files, isLoading: isLoadingFiles } = useSWR<FileListData>(
    bucketInfo.bucket
      ? `${action}/r2/files?bucket=${bucketInfo.bucket}&page=${currentPage}&pageSize=${pageSize}&name=${searchParams.name}&fileSize=${searchParams.fileSize}&mimeType=${searchParams.mimeType}`
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
      `${action}/r2/files?bucket=${bucketInfo.bucket}&page=${currentPage}&pageSize=${pageSize}&name=${searchParams.name}&fileSize=${searchParams.fileSize}&mimeType=${searchParams.mimeType}`,
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
          fetch(`${action}/r2/files`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              keys: selectedFiles.map((file) => file.path),
              ids: selectedFiles.map((file) => file.id),
              bucket: bucketInfo.bucket,
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
              });
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px] rounded-r-none">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {[
                { lebal: "Name", value: "name" },
                { lebal: "Size", value: "fileSize" },
                { lebal: "Type", value: "mimeType" },
              ].map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {t(item.lebal)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="min-w-28 rounded-l-none border-l-0 sm:w-48 sm:flex-none"
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
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="flex items-center gap-2">
                <CircularStorageIndicator files={files} plan={plan} size={36} />
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <FileSizeDisplay files={files} plan={plan} t={t} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {/* Bucket Select */}
        {isLoading ? (
          <Skeleton className="h-9 w-[120px] rounded border-r-0 shadow-inner" />
        ) : (
          r2Configs &&
          r2Configs.buckets &&
          r2Configs.buckets.length > 0 && (
            <Select
              value={bucketInfo.bucket}
              onValueChange={handleChangeBucket}
            >
              <SelectTrigger className="flex-1 sm:w-[120px] sm:flex-none">
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
          )
        )}
        {/* Uploader */}
        {!isLoading && r2Configs && r2Configs.buckets?.length > 0 && (
          <FileUploader
            bucketInfo={bucketInfo}
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
          user={user}
          files={files}
          isLoading={isLoadingFiles}
          view={displayType}
          bucketInfo={bucketInfo}
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
