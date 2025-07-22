"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR from "swr";

import { BucketItem, CloudStorageCredentials } from "@/lib/s3";
import { cn, fetcher, formatFileSize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/shared/icons";

export default function S3Configs({}: {}) {
  const t = useTranslations("Setting");
  const [isPending, startTransition] = useTransition();
  const [s3Configs, setS3Configs] = useState<CloudStorageCredentials[]>([]);

  const {
    data: configs,
    isLoading,
    mutate,
  } = useSWR<Record<string, any>>("/api/admin/s3", fetcher);

  const S3_PRVIDERS = [
    {
      label: "Cloudflare R2",
      value: "Cloudflare R2",
      platform: "cloudflare",
      channel: "r2",
    },
    { label: "AWS S3", value: "AWS S3", platform: "aws", channel: "s3" },
    {
      label: "Tencent COS",
      value: "Tencent COS",
      platform: "tencent",
      channel: "cos",
    },
    { label: "Ali OSS", value: "Ali OSS", platform: "ali", channel: "oss" },
    {
      label: "Custom Provider",
      value: "Custom Provider",
      platform: "custom provider",
      channel: "cp",
    },
  ];

  useEffect(() => {
    if (configs && configs?.s3_config_list) {
      setS3Configs(configs.s3_config_list);
    }
  }, [configs]);

  function isProviderNameUnique(array: CloudStorageCredentials[]): boolean {
    const names = array.map((item) => item.provider_name);
    return new Set(names).size === names.length;
  }

  const handleSaveConfigs = (value: any, key: string, type: string) => {
    if (!isProviderNameUnique(s3Configs)) {
      toast.error("Provider name must be unique");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/admin/s3", {
        method: "POST",
        body: JSON.stringify({ key, value, type }),
      });
      if (res.ok) {
        toast.success("Saved");
        mutate();
      } else {
        toast.error("Failed to save", {
          description: await res.text(),
        });
      }
    });
  };

  const canSaveR2Credentials = useMemo(() => {
    if (!configs) return true;

    return (
      Object.keys(s3Configs).some(
        (key) => s3Configs[key] !== configs.s3_config_list[key],
      ) || configs.s3_config_list.length !== s3Configs.length
    );
  }, [s3Configs, configs]);

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  return (
    <Card>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 bg-neutral-50 px-4 py-5 dark:bg-neutral-900">
          <p className="mr-auto text-lg font-bold">
            {t("Cloud Storage Configs")}
          </p>
          {canSaveR2Credentials && (
            <Button
              className="h-7 px-2 py-1 text-xs"
              size={"sm"}
              disabled={isPending || !canSaveR2Credentials}
              onClick={(e) => {
                e.preventDefault();
                handleSaveConfigs(s3Configs, "s3_config_list", "OBJECT");
              }}
            >
              {isPending ? (
                <Icons.spinner className="mr-1 size-4 animate-spin" />
              ) : null}
              {t("Save Modifications")}
            </Button>
          )}
          <p
            className="flex h-[30px] items-center gap-1 rounded-md border bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:opacity-80"
            onClick={(e) => {
              e.preventDefault();
              setS3Configs([
                ...s3Configs,
                {
                  platform: "cloudflare",
                  channel: "s3",
                  provider_name: `Cloudflare R2 (${s3Configs.length + 1})`,
                  account_id: "",
                  access_key_id: "",
                  secret_access_key: "",
                  endpoint: "",
                  enabled: true,
                  buckets: [
                    {
                      bucket: "",
                      custom_domain: "",
                      prefix: "",
                      file_types: "",
                      region: "auto",
                      public: true,
                    },
                  ],
                },
              ]);
            }}
          >
            <Icons.add className="size-3" />
            {t("Add Provider")}
          </p>
          <Icons.chevronDown className="size-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 bg-neutral-100 p-4 dark:bg-neutral-800">
          {s3Configs.map((config, index) => {
            const updateBucket = (
              bucketIndex: number,
              updates: Partial<BucketItem>,
            ) => {
              const newBuckets = [...config.buckets];
              newBuckets[bucketIndex] = {
                ...newBuckets[bucketIndex],
                ...updates,
              };
              setS3Configs(
                s3Configs.map((c, i) => {
                  if (i === index) {
                    return {
                      ...c,
                      buckets: newBuckets,
                    };
                  }
                  return c;
                }),
              );
            };
            return (
              <Collapsible
                className={cn(
                  index !== s3Configs.length - 1 && "border-b pb-3",
                  "group",
                )}
                key={index}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-3">
                  <p className="mr-auto font-semibold group-hover:font-bold">
                    {config.provider_name}
                  </p>
                  <Badge className="text-xs" variant="outline">
                    {t("{length} Buckets", {
                      length: config.buckets.length,
                    })}
                  </Badge>
                  <Icons.trash
                    className="size-6 rounded border p-1 text-muted-foreground hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                    onClick={() => {
                      setS3Configs(s3Configs.filter((_, i) => i !== index));
                    }}
                  />
                  <Icons.chevronDown className="size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-4 rounded-lg border p-6 shadow-md transition-colors duration-75 group-hover:bg-primary-foreground">
                  {/* Base */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <Label>{t("Provider")}*</Label>
                      <Select
                        value={`${config.platform} (${config.channel})`}
                        onValueChange={(v) => {
                          const provider = S3_PRVIDERS.find(
                            (p) => `${p.platform} (${p.channel})` === v,
                          );
                          setS3Configs(
                            s3Configs.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  provider_name: `${provider?.value} (${index + 1})`,
                                  channel: provider?.channel || "",
                                  platform: provider?.platform || "",
                                };
                              }
                              return c;
                            }),
                          );
                        }}
                      >
                        <SelectTrigger className="bg-neutral-100 dark:bg-neutral-800">
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {S3_PRVIDERS.map((provider) => (
                            <SelectItem
                              key={`${provider.platform} (${provider.channel})`}
                              value={`${provider.platform} (${provider.channel})`}
                            >
                              {provider.platform} ({provider.channel})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>
                        {t("Provider Unique Name")}* ({t("Unique")})
                      </Label>
                      <Input
                        value={config.provider_name}
                        placeholder="provider display name"
                        onChange={(e) =>
                          setS3Configs(
                            s3Configs.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  provider_name: e.target.value,
                                };
                              }
                              return c;
                            }),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>{t("Endpoint")}*</Label>
                      <Input
                        value={config.endpoint}
                        placeholder="https://<account_id>.r2.cloudflarestorage.com"
                        onChange={(e) =>
                          setS3Configs(
                            s3Configs.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  endpoint: e.target.value,
                                };
                              }
                              return c;
                            }),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>{t("Access Key ID")}*</Label>
                      <Input
                        value={config.access_key_id}
                        onChange={(e) =>
                          setS3Configs(
                            s3Configs.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  access_key_id: e.target.value,
                                };
                              }
                              return c;
                            }),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>{t("Secret Access Key")}*</Label>
                      <Input
                        value={config.secret_access_key}
                        onChange={(e) =>
                          setS3Configs(
                            s3Configs.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  secret_access_key: e.target.value,
                                };
                              }
                              return c;
                            }),
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col justify-center space-y-3">
                      <Label>{t("Enabled")}*</Label>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(e) =>
                          setS3Configs(
                            s3Configs.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  enabled: e,
                                };
                              }
                              return c;
                            }),
                          )
                        }
                      />
                    </div>
                  </div>
                  {/* buckets */}
                  {config.buckets.map((bucket, index2) => (
                    <motion.div
                      className="relative grid grid-cols-1 gap-4 rounded-lg border border-dashed border-muted-foreground px-3 pb-3 pt-10 text-neutral-600 dark:text-neutral-400 sm:grid-cols-4"
                      key={`bucket-${index2}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        layout: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                      }}
                    >
                      <p className="absolute left-2 top-3 text-xs text-muted-foreground">
                        {t("Bucket")} {index2 + 1}
                      </p>

                      {/* 按钮部分 */}
                      <div className="absolute right-2 top-2 flex items-center justify-between space-x-2">
                        {index2 > 0 && (
                          <Button
                            className="h-[30px] px-1.5"
                            size={"sm"}
                            variant={"ghost"}
                            onClick={() => {
                              const newBuckets = [...config.buckets];
                              newBuckets.splice(index2, 1);
                              newBuckets.splice(index2 - 1, 0, bucket);
                              setS3Configs(
                                s3Configs.map((c, i) => {
                                  if (i === index) {
                                    return {
                                      ...c,
                                      buckets: newBuckets,
                                    };
                                  }
                                  return c;
                                }),
                              );
                            }}
                          >
                            <Icons.arrowUp className="size-4" />
                          </Button>
                        )}
                        {index2 < config.buckets.length - 1 && (
                          <Button
                            className="h-[30px] px-1.5"
                            size={"sm"}
                            variant={"ghost"}
                            onClick={() => {
                              const newBuckets = [...config.buckets];
                              newBuckets.splice(index2, 1);
                              newBuckets.splice(index2 + 1, 0, bucket);
                              setS3Configs(
                                s3Configs.map((c, i) => {
                                  if (i === index) {
                                    return {
                                      ...c,
                                      buckets: newBuckets,
                                    };
                                  }
                                  return c;
                                }),
                              );
                            }}
                          >
                            <Icons.arrowDown className="size-4" />
                          </Button>
                        )}
                        <Button
                          className="ml-auto h-[30px] px-1.5"
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => {
                            const newBuckets = [...config.buckets];
                            newBuckets.splice(index2 + 1, 0, {
                              bucket: "",
                              prefix: "",
                              file_types: "",
                              region: "auto",
                              custom_domain: "",
                              file_size: "26214400",
                              max_storage: "1073741824",
                              max_files: "1000",
                              public: true,
                            });
                            setS3Configs(
                              s3Configs.map((c, i) => {
                                if (i === index) {
                                  return {
                                    ...c,
                                    buckets: newBuckets,
                                  };
                                }
                                return c;
                              }),
                            );
                          }}
                        >
                          <Icons.add className="size-4" />
                        </Button>
                        {index2 !== 0 && (
                          <Button
                            className="h-[30px] px-1.5"
                            size={"sm"}
                            variant={"outline"}
                            onClick={() => {
                              const newBuckets = [...config.buckets];
                              newBuckets.splice(index2, 1);
                              setS3Configs(
                                s3Configs.map((c, i) => {
                                  if (i === index) {
                                    return {
                                      ...c,
                                      buckets: newBuckets,
                                    };
                                  }
                                  return c;
                                }),
                              );
                            }}
                          >
                            <Icons.trash className="size-4" />
                          </Button>
                        )}
                      </div>

                      {/* 使用 updateBucket 函数的输入字段 */}
                      <div className="space-y-1">
                        <Label>{t("Bucket Name")}*</Label>
                        <Input
                          value={bucket.bucket}
                          placeholder="bucket name"
                          onChange={(e) =>
                            updateBucket(index2, { bucket: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>{t("Public Domain")}*</Label>
                        <Input
                          value={bucket.custom_domain}
                          placeholder="https://endpoint or custom domain"
                          onChange={(e) =>
                            updateBucket(index2, {
                              custom_domain: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>{t("Region")}</Label>
                        <Input
                          value={bucket.region}
                          placeholder="auto"
                          onChange={(e) =>
                            updateBucket(index2, { region: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>
                          {t("Prefix")} ({t("Optional")})
                        </Label>
                        <Input
                          value={bucket.prefix}
                          placeholder="2025/08/08"
                          onChange={(e) =>
                            updateBucket(index2, { prefix: e.target.value })
                          }
                        />
                      </div>

                      <div className="mt-1 space-y-2">
                        <div className="flex items-center gap-1">
                          <Label>{t("Max File Size")}</Label>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger>
                                <Icons.help className="size-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-64 text-wrap">
                                {t("maxStorageTooltip")}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <Input
                            value={bucket.file_size}
                            placeholder="26214400"
                            onChange={(e) =>
                              updateBucket(index2, {
                                file_size: e.target.value,
                              })
                            }
                          />
                          {bucket.file_size && (
                            <span className="absolute right-2 top-[11px] text-xs text-muted-foreground">
                              ≈{formatFileSize(Number(bucket.file_size))}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>{t("Max File Count")}</Label>
                        <Input
                          value={bucket.max_files}
                          placeholder="1000"
                          onChange={(e) =>
                            updateBucket(index2, {
                              max_files: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center gap-1">
                          <Label>{t("Max Storage")}</Label>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger>
                                <Icons.help className="size-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-64 text-wrap">
                                {t("maxStorageTooltip")}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <Input
                            value={bucket.max_storage}
                            placeholder="10737418240"
                            onChange={(e) =>
                              updateBucket(index2, {
                                max_storage: e.target.value,
                              })
                            }
                          />
                          {bucket.max_storage && (
                            <span className="absolute right-2 top-[11px] text-xs text-muted-foreground">
                              ≈{formatFileSize(Number(bucket.max_storage))}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-1">
                          <Label>{t("Public")}</Label>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger>
                                <Icons.help className="size-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-56 text-wrap">
                                {t(
                                  "Publicize this storage bucket, all registered users can upload files to this storage bucket; If not public, only administrators can upload files to this storage bucket",
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={bucket.public}
                          onCheckedChange={(e) =>
                            updateBucket(index2, { public: e })
                          }
                        />
                      </div>
                    </motion.div>
                  ))}
                  {/* actions */}
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      className="text-sm text-blue-500 hover:underline"
                      href="/docs/developer/cloud-storage"
                      target="_blank"
                    >
                      {t("How to get the S3 credentials?")}
                    </Link>
                    {/* <Button
                      className="ml-auto"
                      variant="destructive"
                      onClick={() => {
                        setS3Configs([
                          {
                            platform: "cloudflare",
                            channel: "r2",
                            provider_name: "Cloudflare R2",
                            endpoint: "",
                            access_key_id: "",
                            secret_access_key: "",
                            buckets: [
                              {
                                bucket: "",
                                prefix: "",
                                file_types: "",
                                region: "auto",
                                custom_domain: "",
                                file_size: "26214400",
                                max_storage: "",
                                public: true,
                              },
                            ],
                            account_id: "",
                            enabled: false,
                          },
                        ]);
                      }}
                    >
                      {t("Clear")}
                    </Button> */}
                    <Button
                      disabled={isPending || !canSaveR2Credentials}
                      onClick={() => {
                        handleSaveConfigs(
                          s3Configs,
                          "s3_config_list",
                          "OBJECT",
                        );
                      }}
                    >
                      {isPending ? (
                        <Icons.spinner className="mr-1 size-4 animate-spin" />
                      ) : null}
                      {t("Save")}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
