import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  Image,
  Music,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn, formatFileSize } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";

import { BucketInfo, StorageUserPlan } from ".";
import { CopyButton } from "../shared/copy-button";
import { Icons } from "../shared/icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import DragAndDrop from "./drag-and-drop";

export const FileUploader = ({
  bucketInfo,
  action,
  plan,
  userId,
  onRefresh,
  onUploadComplete,
  onUploadError,
}: {
  bucketInfo: BucketInfo;
  action: string;
  userId: string;
  plan?: StorageUserPlan;
  onRefresh: () => void;
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: string) => void;
}) => {
  const t = useTranslations("Components");
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const {
    files,
    isUploading,
    stats,
    addFiles,
    removeFile,
    cancelUpload,
    retryUpload,
    startUpload,
    clearAll,
  } = useFileUpload({ api: `${action}/r2/upload`, bucketInfo, userId });

  useEffect(() => {
    if (selectedFile) {
      addFiles(selectedFile);
    }
  }, [selectedFile]);

  // useEffect(() => {
  //   const completedFiles = files.filter((f) => f.status === "completed");
  //   const errorFiles = files.filter((f) => f.status === "error");

  //   if (completedFiles.length > 0 && stats.uploading === 0 && !isUploading) {
  //     onUploadComplete?.(completedFiles);
  //     onRefresh();
  //   }

  //   if (errorFiles.length > 0 && stats.uploading === 0 && !isUploading) {
  //     const errors = errorFiles.map((f) => f.error || "未知错误").join(", ");
  //     onUploadError?.(errors);
  //   }
  // }, [files, stats, isUploading, onUploadComplete, onUploadError]);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-gray-600";
      case "uploading":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "cancelled":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "等待上传";
      case "uploading":
        return "上传中";
      case "completed":
        return "上传完成";
      case "error":
        return "上传失败";
      case "cancelled":
        return "已取消";
      default:
        return "未知状态";
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          className="flex h-9 items-center gap-1 text-nowrap"
          onClick={() => setIsOpen(true)}
        >
          <Icons.cloudUpload className="size-5" />
          {t("Upload Files")}
        </Button>
      )}
      {isOpen && (
        <Drawer open={isOpen} direction="right" onOpenChange={setIsOpen}>
          <DrawerContent className="h-screen w-full overflow-y-auto sm:max-w-xl">
            <DrawerHeader className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-1">
                {t("Upload Files")}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" className="">
                  <Icons.close className="size-4" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <DrawerDescription className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <div className="truncate">{bucketInfo.provider_name}</div>
                <Icons.arrowRight className="size-3" />
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  {bucketInfo.bucket}
                </div>
              </div>
              <Badge className="text-xs">
                {formatFileSize(Number(plan?.stMaxFileSize || "0"), {
                  precision: 0,
                })}{" "}
                /{" "}
                {formatFileSize(Number(plan?.stMaxTotalSize || "0"), {
                  precision: 0,
                })}
              </Badge>
            </DrawerDescription>

            <div className="space-y-4 p-4">
              <DragAndDrop
                setSelectedFile={setSelectedFile}
                bucketInfo={bucketInfo}
              />

              {/* 统计信息 */}
              {stats.total > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold">{t("Upload List")}</h2>
                  <Badge className="flex items-center gap-1">
                    {stats.completed}
                    <span>/</span>
                    {stats.total}
                  </Badge>
                </div>
                // <div className="mt-6 rounded-lg bg-gray-50 p-4">
                //   <div className="flex flex-wrap gap-4 text-sm">
                //     <span className="text-gray-600">总计: {stats.total}</span>
                //     <span className="text-gray-600">等待: {stats.pending}</span>
                //     <span className="text-blue-600">
                //       上传中: {stats.uploading}
                //     </span>
                //     <span className="text-green-600">
                //       完成: {stats.completed}
                //     </span>
                //     <span className="text-red-600">失败: {stats.error}</span>
                //     <span className="text-orange-600">
                //       取消: {stats.cancelled}
                //     </span>
                //   </div>
                // </div>
              )}

              {/* 文件列表 */}
              {files.length > 0 && (
                <div className="space-y-2 rounded-lg">
                  {/* 上传提示 */}
                  {files.some((file) => file.status === "uploading") && (
                    <div className="flex items-center gap-1 rounded-md border border-dashed bg-yellow-100 p-2 text-sm text-muted-foreground dark:bg-neutral-600">
                      <Icons.info className="size-4" />
                      {t(
                        "Do not close the window until the upload is complete",
                      )}
                    </div>
                  )}

                  {/* 文件列表 */}
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "relative overflow-hidden rounded-lg border",
                        file.status === "uploading" &&
                          "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
                        file.status === "completed" &&
                          "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20",
                        file.status === "error" &&
                          "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20",
                        "backdrop-blur-sm transition-all duration-300",
                        file.status === "cancelled" &&
                          "border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20",
                      )}
                    >
                      {/* 主进度条背景 */}
                      {file.status === "uploading" && (
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
                          <div
                            className="h-full bg-gray-200 transition-all duration-500 ease-out dark:bg-gray-700"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}

                      {/* 内容区域 */}
                      <div className="relative z-10 px-4 py-3">
                        <div
                          className={cn(
                            "flex justify-between gap-3",
                            file.status === "uploading"
                              ? "items-start"
                              : "items-center",
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            {getFileIcon(file.file.type)}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {file.originalName}
                              </p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(file.file.size)}
                              </p>
                            </div>
                          </div>

                          {/* 状态指示器和操作按钮 */}
                          <div className="flex items-center gap-2">
                            {file.status === "pending" ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 rounded-full bg-neutral-600 px-3 py-1 text-xs text-white dark:bg-neutral-700">
                                  <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-400"></div>
                                  {t("Pending Upload")}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFile(file.id)}
                                  className="size-[30px] p-1.5 text-red-600 transition-colors hover:text-red-800"
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            ) : file.status === "uploading" ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {file.progress}%
                                </span>
                                <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-xs text-white dark:bg-gray-600">
                                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-400"></div>
                                  {t("Uploading")}
                                </div>
                                <Button
                                  className="size-6"
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => cancelUpload(file.id)}
                                  title="取消上传"
                                >
                                  <Icons.close className="size-4" />
                                </Button>
                              </div>
                            ) : file.status === "completed" ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs text-white dark:bg-green-700">
                                  <div className="h-2 w-2 rounded-full bg-green-300 dark:bg-green-400"></div>
                                  {t("Completed")}
                                </div>
                                <CopyButton
                                  value={`${bucketInfo.custom_domain}/${file.fileName}`}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFile(file.id)}
                                  className="size-[30px] p-1.5 text-red-600 transition-colors hover:text-red-800"
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            ) : (
                              (file.status === "error" ||
                                file.status === "cancelled") && (
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs text-white dark:bg-red-700">
                                    <div className="h-2 w-2 rounded-full bg-red-300 dark:bg-red-400"></div>
                                    {t("Aborted")}
                                  </div>
                                  <Button
                                    className="size-6"
                                    size="icon"
                                    variant="secondary"
                                    onClick={() => retryUpload(file.id)}
                                    title="重试上传"
                                  >
                                    <RotateCcw className="size-4" />
                                  </Button>
                                  <Button
                                    className="size-6"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => removeFile(file.id)}
                                    title="删除文件"
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* 进度条 */}
                        {file.status === "uploading" && (
                          <div className="mt-3">
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="absolute left-0 top-0 h-full bg-gray-800 transition-all duration-300 ease-out dark:bg-gray-300"
                                style={{ width: `${file.progress}%` }}
                              />
                              <div
                                className="absolute top-0 h-full w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 ease-out dark:via-white/20"
                                style={{
                                  left: `${Math.max(0, file.progress - 8)}%`,
                                  opacity:
                                    file.progress > 0 && file.progress < 100
                                      ? 1
                                      : 0,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DrawerFooter className="flex flex-row items-center justify-between gap-2">
              <DrawerClose asChild>
                <Button variant="outline">{t("Cancel")}</Button>
              </DrawerClose>

              {files.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={startUpload}
                    disabled={isUploading || stats.pending === 0}
                    className="flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <Play className="h-4 w-4" />
                    Start Upload
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      clearAll();
                      setSelectedFile(null);
                    }}
                  >
                    {t("Clear")}
                  </Button>
                </div>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
