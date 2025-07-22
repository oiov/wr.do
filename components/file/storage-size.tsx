import React from "react";
import { AlertTriangle, CheckCircle, HardDrive, Folder } from "lucide-react";

import { formatFileSize } from "@/lib/utils";

export function FileSizeDisplay({ files, plan, bucketInfo, bucketUsage, t }) {
  const totalSize = files?.totalSize || 0;
  const maxSize = Number(plan?.stMaxTotalSize || 0);
  const usagePercentage =
    maxSize > 0 ? Math.min((totalSize / maxSize) * 100, 100) : 0;

  // 存储桶级别的配额信息
  const bucketTotalSize = bucketUsage?.usage?.totalSize || 0;
  const bucketMaxSize = bucketUsage?.limits?.maxStorage || 0;
  const bucketUsagePercentage =
    bucketMaxSize > 0 ? Math.min((bucketTotalSize / bucketMaxSize) * 100, 100) : 0;
  const hasBucketLimit = bucketMaxSize > 0;

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 90) return <AlertTriangle className="h-4 w-4" />;
    if (percentage >= 70) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="mx-auto w-full max-w-md p-4">
      {/* 标题 */}
      <div className="mb-3 flex items-center gap-2">
        <HardDrive className="h-5 w-5 text-neutral-600 dark:text-neutral-200" />
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {t("storageUsage")}
        </h3>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-300">
            {t("used")}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-300">
            {usagePercentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-600">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usagePercentage)}`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Plan级别详细信息 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span>{t("planQuota")}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            {t("usedSpace")}:
          </span>
          <span className="text-sm font-medium">
            {formatFileSize(totalSize, { precision: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            {t("totalCapacity")}:
          </span>
          <span className="text-sm font-medium">
            {formatFileSize(maxSize, { precision: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            {t("availableSpace")}:
          </span>
          <span className="text-sm font-medium">
            {formatFileSize(maxSize - totalSize, { precision: 2 })}
          </span>
        </div>
      </div>

      {/* 存储桶级别信息 */}
      {hasBucketLimit && (
        <>
          <div className="my-3 border-t pt-3">
            <div className="mb-2 flex items-center gap-2">
              <Folder className="h-4 w-4 text-neutral-600 dark:text-neutral-200" />
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t("bucketQuota")} - {bucketInfo?.bucket}
              </span>
            </div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-300">
                {t("used")}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-300">
                {bucketUsagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="mb-2 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-600">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(bucketUsagePercentage)}`}
                style={{ width: `${bucketUsagePercentage}%` }}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 dark:text-neutral-300">
                  {t("usedSpace")}:
                </span>
                <span className="text-xs font-medium">
                  {formatFileSize(bucketTotalSize, { precision: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 dark:text-neutral-300">
                  {t("bucketCapacity")}:
                </span>
                <span className="text-xs font-medium">
                  {formatFileSize(bucketMaxSize, { precision: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 dark:text-neutral-300">
                  {t("availableSpace")}:
                </span>
                <span className="text-xs font-medium">
                  {formatFileSize(bucketMaxSize - bucketTotalSize, { precision: 2 })}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 状态提示 */}
      <div
        className={`mt-3 flex items-center gap-2 rounded-md bg-neutral-50 p-2 dark:bg-neutral-800 ${getStatusColor(hasBucketLimit && bucketUsagePercentage > usagePercentage ? bucketUsagePercentage : usagePercentage)}`}
      >
        {getStatusIcon(hasBucketLimit && bucketUsagePercentage > usagePercentage ? bucketUsagePercentage : usagePercentage)}
        <span className="text-xs">
          {(() => {
            const criticalPercentage = hasBucketLimit && bucketUsagePercentage > usagePercentage ? bucketUsagePercentage : usagePercentage;
            if (criticalPercentage >= 90) {
              return hasBucketLimit && bucketUsagePercentage >= 90 ? t("bucketStorageFull") : t("storageFull");
            } else if (criticalPercentage >= 70) {
              return hasBucketLimit && bucketUsagePercentage >= 70 ? t("bucketStorageHigh") : t("storageHigh");
            } else {
              return t("storageGood");
            }
          })()} 
        </span>
      </div>
    </div>
  );
}

export function CircularStorageIndicator({ files, plan, bucketUsage, size = 32 }) {
  const totalSize = files?.totalSize || 0;
  const maxSize = Number(plan?.stMaxTotalSize || 0);
  const usagePercentage =
    maxSize > 0 ? Math.min((totalSize / maxSize) * 100, 100) : 0;

  // 存储桶级别的配额信息
  const bucketTotalSize = bucketUsage?.usage?.totalSize || 0;
  const bucketMaxSize = bucketUsage?.limits?.maxStorage || 0;
  const bucketUsagePercentage =
    bucketMaxSize > 0 ? Math.min((bucketTotalSize / bucketMaxSize) * 100, 100) : 0;
  const hasBucketLimit = bucketMaxSize > 0;

  // 使用更严格的限制来显示
  const displayPercentage = hasBucketLimit && bucketUsagePercentage > usagePercentage ? bucketUsagePercentage : usagePercentage;

  // 圆形参数
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (displayPercentage / 100) * circumference;

  // 根据使用率确定颜色
  const getColor = (percentage) => {
    if (percentage >= 90) return "#ef4444"; // red-500
    if (percentage >= 70) return "#f59e0b"; // amber-500
    return "#3b82f6"; // blue-500
  };

  return (
    <div
      className="relative flex cursor-pointer items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* 背景圆圈 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="none"
        />
        {/* 进度圆圈 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(displayPercentage)}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div
        className="absolute inset-0 flex scale-[.85] items-center justify-center text-xs font-medium"
        style={{ color: getColor(displayPercentage) }}
      >
        {Math.round(displayPercentage)}%
      </div>
    </div>
  );
}
