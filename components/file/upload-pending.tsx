"use client";

import { useTranslations } from "next-intl";

import { cn, formatFileSize } from "@/lib/utils";
import { BucketInfo } from "@/components/file";

import { CopyButton } from "../shared/copy-button";
import { Icons } from "../shared/icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { UploadPendingItemType, UploadProgressType } from "./uploader";

const UploadPending = ({
  pendingUpload,
  progressList,
  bucketInfo,
  onAbort,
}: {
  pendingUpload: UploadPendingItemType[] | null;
  progressList: UploadProgressType[] | undefined;
  bucketInfo: BucketInfo;
  onAbort: (uploadId: string, key: string) => void;
}) => {
  const t = useTranslations("Components");
  return (
    <div className="space-y-2 rounded-lg">
      {progressList && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{t("Upload List")}</h2>
          <Badge className="flex items-center gap-1">
            {progressList.filter((i) => i.progress === 100).length}
            <span>/</span>
            {progressList.length}
          </Badge>
        </div>
      )}
      {!pendingUpload && (
        <div className="flex items-center gap-1 rounded-md border border-dashed bg-yellow-100 p-2 text-sm text-muted-foreground dark:bg-neutral-600">
          <Icons.info className="size-4" />
          {t("Do not close the window until the upload is complete")}
        </div>
      )}
      {pendingUpload &&
        pendingUpload.map((item) => {
          const progress =
            progressList?.find((p) => p.id === item.uploadId)?.progress || 0;
          return (
            <div
              key={item.uploadId}
              className={cn(
                "relative overflow-hidden rounded-lg border",
                item.status === "uploading" &&
                  "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
                item.status === "completed" &&
                  "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20",
                item.status === "aborted" &&
                  "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20",
                "backdrop-blur-sm transition-all duration-300",
              )}
            >
              {/* 主进度条背景 */}
              {item.status === "uploading" && (
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div
                    className="h-full bg-gray-200 transition-all duration-500 ease-out dark:bg-gray-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* 内容区域 */}
              <div className="relative z-10 px-4 py-3">
                {/* 头部信息 */}
                <div
                  className={cn(
                    "flex justify-between gap-3",
                    item.status === "uploading"
                      ? "items-start"
                      : "items-center",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {item.fileName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(item.size)}
                    </p>
                  </div>

                  {/* 状态指示器 */}
                  <div className="flex items-center gap-2">
                    {item.status === "uploading" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{progress}%</span>
                        <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-xs text-white dark:bg-gray-600">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-400"></div>
                          {t("Uploading")}
                        </div>
                        <Button
                          className="size-6"
                          size={"icon"}
                          variant="destructive"
                          onClick={() => onAbort(item.uploadId, item.key)}
                        >
                          <Icons.close className="size-4" />
                        </Button>
                      </div>
                    ) : item.status === "completed" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs text-white dark:bg-green-700">
                          <div className="h-2 w-2 rounded-full bg-green-300 dark:bg-green-400"></div>
                          {t("Completed")}
                        </div>
                        <CopyButton
                          value={
                            bucketInfo.custom_domain
                              ? `${bucketInfo.custom_domain}/${item.fileName}`
                              : item.path!
                          }
                        ></CopyButton>
                      </div>
                    ) : (
                      item.status === "aborted" && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs text-white dark:bg-red-700">
                            <div className="h-2 w-2 rounded-full bg-red-300 dark:bg-red-400"></div>
                            {t("Aborted")}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* 进度条 */}
                {item.status === "uploading" && (
                  <div className="mt-3">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      {/* 进度填充 */}
                      <div
                        className="absolute left-0 top-0 h-full bg-gray-800 transition-all duration-300 ease-out dark:bg-gray-300"
                        style={{ width: `${progress}%` }}
                      />
                      {/* 动态光泽效果 */}
                      <div
                        className="absolute top-0 h-full w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 ease-out dark:via-white/20"
                        style={{
                          left: `${Math.max(0, progress - 8)}%`,
                          opacity: progress > 0 && progress < 100 ? 1 : 0,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UploadPending;
