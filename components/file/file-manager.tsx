"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Archive,
  Calendar,
  Code2,
  Download,
  FileSpreadsheet,
  FileText,
  Folder,
  HardDrive,
  Image,
  Presentation,
  Trash2,
} from "lucide-react";

import { FileObject } from "@/lib/r2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BucketInfo, DisplayType } from "@/components/file/file-list";

import BlurImage from "../shared/blur-image";
import { Button } from "../ui/button";

// 文件类型图标映射
const getFileIcon = (filename: string, bucketInfo: BucketInfo) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const iconProps = { size: 24, className: "text-gray-600" };

  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return (
        <BlurImage
          className="rounded-md shadow"
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
    case "svg":
      return <Image {...iconProps} className="text-blue-500" />;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <Archive {...iconProps} className="text-orange-500" />;
    case "docx":
    case "doc":
      return <FileText {...iconProps} className="text-blue-600" />;
    case "pptx":
    case "ppt":
      return <Presentation {...iconProps} className="text-red-500" />;
    case "xlsx":
    case "xls":
    case "csv":
      return <FileSpreadsheet {...iconProps} className="text-green-600" />;
    case "json":
      return <Code2 {...iconProps} className="text-yellow-600" />;
    case "md":
    case "markdown":
      return <FileText {...iconProps} className="text-gray-700" />;
    default:
      // 检查是否是文件夹（没有扩展名且以/结尾）
      if (!ext && filename.endsWith("/")) {
        return <Folder {...iconProps} className="text-yellow-500" />;
      }
      return <FileText {...iconProps} className="text-gray-500" />;
  }
};

// 格式化文件大小
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "-";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(size < 10 ? 1 : 0)} ${units[unitIndex]}`;
};

// 格式化日期
const formatDate = (date?: Date): string => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function FileManager({
  bucketInfo,
  action,
  view,
}: {
  bucketInfo: BucketInfo;
  action: string;
  view: DisplayType;
}) {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isLoadingFiles, startLoadingFiles] = useTransition();

  useEffect(() => {
    if (bucketInfo.bucket) {
      fetchFiles();
    }
  }, [bucketInfo.bucket]);

  const fetchFiles = () => {
    startLoadingFiles(async () => {
      try {
        const response = await fetch(
          `${action}/r2/files?bucket=${bucketInfo.bucket}`,
        );
        const data = await response.json();
        setFiles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
      }
    });
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

  const handleDelete = async (key: string) => {
    if (!confirm("确定要删除这个文件吗？")) return;

    try {
      await fetch(`${action}/r2/files`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, bucket: bucketInfo.bucket }),
      });
      alert("File deleted successfully!");
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  const renderListView = () => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700">
        <div className="col-span-6">名称</div>
        <div className="col-span-2">大小</div>
        <div className="col-span-3">修改时间</div>
        <div className="col-span-1">操作</div>
      </div>
      <div className="divide-y divide-gray-200">
        {files.map((file) => (
          <div
            key={file.Key}
            className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
          >
            <div className="col-span-6 flex items-center space-x-3">
              {getFileIcon(file.Key || "", bucketInfo)}
              <span className="truncate text-gray-900">{file.Key}</span>
            </div>
            <div className="col-span-2 flex items-center text-sm text-gray-500">
              <HardDrive size={16} className="mr-1" />
              {formatFileSize(file.Size)}
            </div>
            <div className="col-span-3 flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-1" />
              {formatDate(file.LastModified)}
            </div>
            <div className="col-span-1 flex items-center space-x-2">
              <button
                onClick={() => file.Key && handleDownload(file.Key)}
                className="text-blue-500 transition-colors hover:text-blue-600"
                title="下载"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => file.Key && handleDelete(file.Key)}
                className="text-red-500 transition-colors hover:text-red-600"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGridView = () => (
    <div
      className="grid justify-center justify-items-start gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(60px, 120px))",
      }}
    >
      {files.map((file) => (
        <div
          key={file.Key}
          className="group relative flex cursor-pointer items-end rounded-md transition-all hover:shadow"
        >
          <div className="flex flex-col items-center justify-center space-y-1">
            {React.cloneElement(getFileIcon(file.Key || "", bucketInfo), {
              size: 40,
            })}
            <div className="mt-0 w-full text-center">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger className="mx-auto max-w-[60px] truncate px-2 pb-1 text-xs font-medium text-primary sm:max-w-[100px]">
                    {file.Key}
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-[300px] space-y-1 p-3 text-start text-xs"
                  >
                    {["jpg", "jpeg", "png", "gif", "webp"].includes(
                      file.Key?.split(".").pop()?.toLowerCase() || "",
                    ) && (
                      <BlurImage
                        className="rounded-md shadow"
                        width={300}
                        height={300}
                        src={
                          bucketInfo.custom_domain
                            ? `${bucketInfo.custom_domain}/${file.Key}`
                            : `${file.Key}`
                        }
                        alt={`${file.Key}`}
                      />
                    )}
                    <p className="break-all">File Name: {file.Key}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Size: {formatFileSize(file.Size)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Modified: {formatDate(file.LastModified)}
                    </p>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => file.Key && handleDownload(file.Key)}
                        className="size-7"
                        title="下载"
                        size="icon"
                        variant={"blue"}
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        onClick={() => file.Key && handleDelete(file.Key)}
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
    <div className="w-full rounded-lg p-3">
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Folder size={48} className="mb-4 text-gray-400" />

          {isLoadingFiles ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm text-gray-500">加载中...</span>
            </div>
          ) : (
            <p className="text-lg text-gray-500">暂无文件</p>
          )}
        </div>
      ) : (
        <>{view === "List" ? renderListView() : renderGridView()}</>
      )}
    </div>
  );
}
