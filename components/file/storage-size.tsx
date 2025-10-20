import React from "react";
import { AlertTriangle, CheckCircle, HardDrive } from "lucide-react";

import { formatFileSize, nFormatter } from "@/lib/utils";

export function FileSizeDisplay({ bucketUsage, t }) {
  // 从统一的 bucketUsage 中获取数据
  const totalSize = bucketUsage?.usage?.totalSize || 0;
  const maxSize = bucketUsage?.limits?.maxStorage || 0;
  const usagePercentage =
    maxSize > 0 ? Math.min((totalSize / maxSize) * 100, 100) : 0;
  const bucketName = bucketUsage?.bucket || "";

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

  const getStatusText = (percentage) => {
    if (percentage >= 90) return t("storageFull");
    if (percentage >= 70) return t("storageHigh");
    return t("storageGood");
  };

  // 处理无数据或异常情况
  if (!bucketUsage || maxSize <= 0) {
    return (
      <div className="mx-auto w-full max-w-md p-4">
        <div className="mb-3 flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-neutral-600 dark:text-neutral-200" />
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            {t("storageUsage")}
          </h3>
        </div>
        <div className="rounded-md bg-neutral-50 p-3 dark:bg-neutral-800">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("storageDataUnavailable")}
          </span>
        </div>
      </div>
    );
  }

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
            {bucketName ? `${bucketName}` : t("storageQuota")}
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

      {/* 详细信息 */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-300">
            {t("usedSpace")}:
          </span>
          <span className="font-medium">
            {formatFileSize(totalSize, { precision: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-300">
            {t("totalCapacity")}:
          </span>
          <span className="font-medium">
            {formatFileSize(maxSize, { precision: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-300">
            {t("availableSpace")}:
          </span>
          <span className="font-medium">
            {formatFileSize(maxSize - totalSize, { precision: 2 })}
          </span>
        </div>
        {bucketUsage?.usage?.totalFiles !== undefined && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-600 dark:text-neutral-300">
              {t("totalFiles")}:
            </span>
            <span className="font-medium">
              {bucketUsage.usage.totalFiles.toLocaleString()} /{" "}
              {nFormatter(bucketUsage.limits.maxFiles)}
            </span>
          </div>
        )}
      </div>

      {/* 状态提示 */}
      <div
        className={`flex items-center gap-2 rounded-md bg-neutral-50 p-2 dark:bg-neutral-800 ${getStatusColor(usagePercentage)}`}
      >
        {getStatusIcon(usagePercentage)}
        <span className="text-xs">{getStatusText(usagePercentage)}</span>
      </div>
    </div>
  );
}

export function CircularStorageIndicator({ bucketUsage, size = 32 }) {
  const totalSize = bucketUsage?.usage?.totalSize || 0;
  const maxSize = bucketUsage?.limits?.maxStorage || 0;
  const usagePercentage =
    maxSize > 0 ? Math.min((totalSize / maxSize) * 100, 100) : 0;

  // 圆形参数
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (usagePercentage / 100) * circumference;

  // 根据使用率确定颜色
  const getColor = (percentage) => {
    if (percentage >= 90) return "#ef4444"; // red-500
    if (percentage >= 70) return "#f59e0b"; // amber-500
    return "#3b82f6"; // blue-500
  };

  // 处理无数据情况
  if (!bucketUsage || maxSize <= 0) {
    return (
      <div
        className="relative flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          -
        </span>
      </div>
    );
  }

  return (
    <div
      className="relative flex cursor-pointer items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
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
          stroke={getColor(usagePercentage)}
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
        style={{ color: getColor(usagePercentage) }}
      >
        {Math.round(usagePercentage)}%
      </div>
    </div>
  );
}
