"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Archive,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileType2,
  Folder,
  Image,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { UserFileData } from "@/lib/dto/files";
import {
  extractFileNameAndExtension,
  fetcher,
  formatDate,
  formatFileSize,
  truncateMiddle,
} from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BucketInfo, DisplayType } from "@/components/file";

import { CopyButton } from "../shared/copy-button";
import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { Icons } from "../shared/icons";
import { PaginationWrapper } from "../shared/pagination";
import { TimeAgoIntl } from "../shared/time-ago";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export default function UserFileList({
  bucketInfo,
  action,
  view,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  onRefresh,
}: {
  bucketInfo: BucketInfo;
  action: string;
  view: DisplayType;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onRefresh: () => void;
}) {
  const t = useTranslations("List");
  const { isMobile } = useMediaQuery();

  const [selectedFiles, setSelectedFiles] = useState<UserFileData[]>([]);
  // const [showMutiCheckBox, setShowMutiCheckBox] = useState(false);

  const { data: files, isLoading } = useSWR<{
    total: number;
    totalSize: number;
    list: UserFileData[];
  }>(
    bucketInfo.bucket
      ? `${action}/r2/files?bucket=${bucketInfo.bucket}&page=${currentPage}&size=${pageSize}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const handleSelectFile = (file: UserFileData) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleSelectAllFiles = () => {
    if (selectedFiles.length === files?.list.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files?.list || []);
    }
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await fetch(`${action}/r2/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, bucket: bucketInfo.bucket }),
      });
      const { signedUrl } = await response.json();
      window.open(signedUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const handleDeleteMany = async () => {
    try {
      await fetch(`${action}/r2/files`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keys: selectedFiles.map((f) => f.path),
          ids: selectedFiles.map((f) => f.id),
          bucket: bucketInfo.bucket,
        }),
      });
      toast.success("File deleted successfully!");
      onRefresh();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.success("Error deleting file");
    }
  };

  const handleDeleteSingle = async (file: UserFileData) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await fetch(`${action}/r2/files`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keys: [file.path],
          ids: [file.id],
          bucket: bucketInfo.bucket,
        }),
      });
      toast.success("File deleted successfully!");
      onRefresh();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.success("Error deleting file");
    }
  };

  if (files?.total === 0) {
    return (
      <EmptyPlaceholder className="col-span-full shadow-none">
        <EmptyPlaceholder.Icon name="fileText" />
        <EmptyPlaceholder.Title>{t("No Files")}</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          {t("You don't upload any files yet")}
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  const renderListView = () => (
    <div className="overflow-hidden rounded-lg border bg-primary-foreground">
      <div className="text-mute-foreground grid grid-cols-5 gap-4 bg-neutral-100 px-6 py-3 text-sm font-medium dark:bg-neutral-800 sm:grid-cols-12">
        <div className="col-span-1 hidden sm:flex">
          <Checkbox
            className="mr-3 size-4 border-neutral-300 bg-neutral-100 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:data-[state=checked]:border-neutral-300 dark:data-[state=checked]:bg-neutral-300"
            checked={selectedFiles.length === files?.list.length}
            onCheckedChange={() => handleSelectAllFiles()}
          />
        </div>
        <div className="col-span-3">{t("Name")}</div>
        <div className="col-span-1">{t("Size")}</div>
        <div className="col-span-2 hidden sm:flex">{t("Type")}</div>
        <div className="col-span-2 hidden sm:flex">{t("User")}</div>
        <div className="col-span-2 hidden sm:flex">{t("Date")}</div>
        <div className="col-span-1">{t("Actions")}</div>
      </div>
      {isLoading ? (
        <>
          <TableColumnSekleton />
          <TableColumnSekleton />
          <TableColumnSekleton />
          <TableColumnSekleton />
          <TableColumnSekleton />
        </>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-600">
          {files &&
            files.list.map((file) => (
              <div
                key={file.id}
                className="text-mute-foreground grid grid-cols-5 gap-4 px-6 py-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-600 sm:grid-cols-12"
              >
                <div
                  className="col-span-1 hidden items-center gap-2 sm:flex"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={
                      selectedFiles.find((f) => f.id === file.id) !== undefined
                    }
                    onCheckedChange={() => handleSelectFile(file)}
                    className="mr-3 size-4 border-neutral-300 bg-neutral-100 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:data-[state=checked]:border-neutral-300 dark:data-[state=checked]:bg-neutral-300"
                  />
                </div>
                <div className="col-span-3 flex items-center space-x-3 text-sm">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="flex items-center justify-start gap-1 break-all text-start">
                        {truncateMiddle(file.path)}
                        <CopyButton
                          value={`${bucketInfo.custom_domain}/${file.path}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="text-wrap p-3 text-start"
                      >
                        {file.mimeType.startsWith("image/") ? (
                          <img
                            className="mb-2 rounded shadow"
                            width={300}
                            height={300}
                            src={
                              bucketInfo.custom_domain
                                ? `${bucketInfo.custom_domain}/${file.path}`
                                : `${file.path}`
                            }
                            alt={`${file.path}`}
                          />
                        ) : (
                          file.path
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="col-span-1 flex items-center text-nowrap text-sm">
                  {formatFileSize(file.size || 0)}
                </div>
                <div className="col-span-2 hidden items-center text-sm sm:flex">
                  <span className="truncate">{file.mimeType || "-"}</span>
                </div>
                <div className="col-span-2 hidden items-center text-sm sm:flex">
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger className="truncate">
                        {file.user.name ?? file.user.email}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{file.user.name}</p>
                        <p>{file.user.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="col-span-2 hidden items-center text-nowrap text-sm sm:flex">
                  <TimeAgoIntl date={file.updatedAt as Date} />
                </div>
                <div className="col-span-1 flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="size-[25px] p-1.5"
                        size="sm"
                        variant="ghost"
                      >
                        <Icons.moreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Button
                          className="flex w-full items-center gap-2"
                          size="sm"
                          variant="ghost"
                          // onClick={() => handleDownload(file.path)}
                        >
                          <Icons.link className="size-4" />
                          {t("Generate short link")}
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Button
                          className="flex w-full items-center gap-2"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(file.path)}
                        >
                          <Icons.download className="size-4" />
                          {t("Download")}
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Button
                          className="flex w-full items-center gap-2 text-red-500"
                          size="sm"
                          variant="ghost"
                          onClick={() => file.path && handleDeleteSingle(file)}
                        >
                          <Icons.trash className="size-4" />
                          {t("Delete File")}
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderGridView = () => (
    <div
      className="grid justify-items-center gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(10px, 100px))",
      }}
    >
      {isLoading &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
          <Skeleton key={v} className="size-[100px]" />
        ))}
      {files &&
        files.list.map((file) => (
          <div
            key={file.id}
            className="group relative flex cursor-pointer items-end rounded-md transition-all"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              {React.cloneElement(
                getFileIcon(file.path, file.mimeType, bucketInfo),
                {
                  size: 40,
                },
              )}
              <div className="w-full text-center">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger className="mx-auto line-clamp-2 max-w-[60px] break-all px-2 pb-1 text-left text-xs font-medium text-muted-foreground group-hover:text-blue-500 sm:max-w-[100px]">
                      {truncateMiddle(file.path || "")}
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="max-w-[300px] space-y-1 p-3 text-start"
                    >
                      {file.mimeType.startsWith("image/") && (
                        <img
                          className="mb-2 rounded shadow"
                          width={300}
                          height={300}
                          src={
                            bucketInfo.custom_domain
                              ? `${bucketInfo.custom_domain}/${file.path}`
                              : `${file.path}`
                          }
                          alt={`${file.path}`}
                        />
                      )}
                      <div className="flex items-center gap-2 break-all text-sm">
                        <Link
                          target="_blank"
                          href={`${bucketInfo.custom_domain}/${file.path}`}
                        >
                          {file.path}
                        </Link>
                        <CopyButton
                          value={`${bucketInfo.custom_domain}/${file.path}`}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <strong>Size:</strong> {formatFileSize(file.size || 0)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <strong>Type:</strong> {file.mimeType || "-"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <strong>Modified:</strong>{" "}
                        {formatDate(file.lastModified?.toString() || "")}
                      </p>
                      <div className="flex justify-end space-x-1">
                        <Button
                          onClick={() => file.path && handleDownload(file.path)}
                          className="size-7"
                          title="下载"
                          size="icon"
                          variant={"blue"}
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteSingle(file)}
                          className="size-7"
                          title="删除"
                          size="icon"
                          variant={"destructive"}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <>
      {view === "List" ? renderListView() : renderGridView()}
      {files && Math.ceil(files.total / pageSize) > 1 && (
        <PaginationWrapper
          layout={isMobile ? "right" : "split"}
          total={files.total}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </>
  );
}

function TableColumnSekleton() {
  return (
    <TableRow className="grid grid-cols-3 items-center sm:grid-cols-12">
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-10" />
      </TableCell>
      <TableCell className="col-span-3 sm:col-span-2">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-2 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-2 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-2 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

const getFileIcon = (
  filename: string,
  mimeType: string | null,
  bucketInfo: BucketInfo,
) => {
  const iconProps = { size: 24, className: "text-gray-600" };

  // 如果没有 mimeType，回退到文件夹判断
  if (!mimeType) {
    if (filename.endsWith("/")) {
      return <Folder {...iconProps} className="text-yellow-500" />;
    }
    return <FileText {...iconProps} className="text-gray-500" />;
  }

  // 图片类型 - 直接显示图片
  if (mimeType.startsWith("image/")) {
    if (mimeType === "image/svg+xml") {
      return <Image {...iconProps} className="text-blue-500" />;
    }
    // 其他图片格式显示缩略图
    return (
      <img
        className="max-h-24 max-w-24 rounded shadow"
        height={60}
        width={60}
        src={
          bucketInfo.custom_domain
            ? `${bucketInfo.custom_domain}/${filename}`
            : filename
        }
        alt={filename}
      />
    );
  }

  // 压缩文件
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-rar-compressed" ||
    mimeType === "application/x-7z-compressed" ||
    mimeType === "application/x-tar" ||
    mimeType === "application/gzip" ||
    mimeType === "application/x-gzip"
  ) {
    return <Archive {...iconProps} className="text-orange-500" />;
  }

  // Microsoft Office 文档
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return <FileText {...iconProps} className="text-blue-600" />;
  }

  // Microsoft Office 演示文稿
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    mimeType === "application/vnd.ms-powerpoint"
  ) {
    return <FileText {...iconProps} className="text-red-500" />;
  }

  // Microsoft Office 电子表格
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "text/csv"
  ) {
    return <FileSpreadsheet {...iconProps} className="text-green-600" />;
  }

  // JSON 文件
  if (mimeType === "application/json") {
    return <FileCode {...iconProps} className="text-yellow-600" />;
  }

  // Markdown 文件
  if (mimeType === "text/markdown" || mimeType === "text/x-markdown") {
    return <FileType2 {...iconProps} className="text-gray-700" />;
  }

  // 代码文件
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/javascript" ||
    mimeType === "application/typescript" ||
    mimeType === "application/x-javascript" ||
    mimeType === "text/javascript" ||
    mimeType === "text/typescript"
  ) {
    return <FileCode {...iconProps} className="text-blue-400" />;
  }

  // PDF 文件
  if (mimeType === "application/pdf") {
    return <FileText {...iconProps} className="text-red-600" />;
  }

  // 音频文件
  if (mimeType.startsWith("audio/")) {
    return <FileText {...iconProps} className="text-purple-500" />;
  }

  // 视频文件
  if (mimeType.startsWith("video/")) {
    return <FileText {...iconProps} className="text-pink-500" />;
  }

  // 默认文件图标
  return <FileText {...iconProps} className="text-gray-500" />;
};
