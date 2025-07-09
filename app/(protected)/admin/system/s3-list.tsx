"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CloudCog } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR from "swr";

import { CloudStorageCredentials } from "@/lib/r2";
import { cn, fetcher } from "@/lib/utils";
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
  const [isCheckingR2Config, startCheckR2Transition] = useTransition();
  const [isCheckingCOSConfig, startCheckCOSTransition] = useTransition();
  const [isCheckedR2Config, setIsCheckedR2Config] = useState(false);
  const [isCheckedCOSConfig, setIsCheckedCOSConfig] = useState(false);
  const [r2Credentials, setR2Credentials] = useState<CloudStorageCredentials>({
    platform: "cloudflare",
    channel: "r2",
    provider_name: "Cloudflare R2",
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
  });

  const {
    data: configs,
    isLoading,
    mutate,
  } = useSWR<Record<string, any>>("/api/admin/s3", fetcher);

  useEffect(() => {
    if (configs) {
      setR2Credentials(configs.s3_config_01);
    }
  }, [configs]);

  const handleSaveConfigs = (value: any, key: string, type: string) => {
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

  const handleR2CheckAccess = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    toast.success("Checking");
  };

  const handleCOSCheckAccess = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    toast.success("Checking");
  };

  const canSaveR2Credentials = useMemo(() => {
    if (!configs) return true;

    return Object.keys(r2Credentials).some(
      (key) => r2Credentials[key] !== configs.s3_config_01[key],
    );
  }, [r2Credentials, configs]);

  const ReadyBadge = (
    isChecked: boolean,
    isChecking: boolean,
    type: string,
  ) => (
    <Badge
      className={cn("ml-auto text-xs font-semibold")}
      variant={isChecked ? "green" : "default"}
      onClick={(event) =>
        type === "r2" ? handleR2CheckAccess(event) : handleCOSCheckAccess(event)
      }
    >
      {isChecking && <Icons.spinner className="mr-1 size-3 animate-spin" />}
      {isChecked && !isChecking && <Icons.check className="mr-1 size-3" />}
      {isChecked ? t("Verified") : t("Verify Configuration")}
    </Badge>
  );

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  return (
    <Card>
      <Collapsible className="group" defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between bg-neutral-50 px-4 py-5 dark:bg-neutral-900">
          <div className="text-lg font-bold">{t("Cloud Storage Configs")}</div>
          <Icons.chevronDown className="ml-auto size-4" />
          <CloudCog className="ml-3 size-4 transition-all group-hover:scale-110" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 bg-neutral-100 p-4 dark:bg-neutral-800">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <div className="font-semibold">Cloudflare R2</div>
              {ReadyBadge(isCheckedR2Config, isCheckingR2Config, "r2")}
              <Icons.chevronDown className="ml-3 size-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4 rounded-lg border p-6 shadow-md">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>{t("Endpoint")}</Label>
                  <Input
                    value={r2Credentials.endpoint}
                    placeholder="https://<account_id>.r2.cloudflarestorage.com"
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        endpoint: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t("Access Key ID")}</Label>
                  <Input
                    value={r2Credentials.access_key_id}
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        access_key_id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t("Secret Access Key")}</Label>
                  <Input
                    value={r2Credentials.secret_access_key}
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        secret_access_key: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col justify-center space-y-3">
                  <Label>{t("Enabled")}</Label>
                  <Switch
                    checked={r2Credentials.enabled}
                    onCheckedChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        enabled: e,
                      })
                    }
                  />
                </div>
              </div>
              {r2Credentials.buckets.map((bucket, index) => (
                <motion.div
                  className="relative grid grid-cols-1 gap-4 rounded-lg border border-dashed border-muted-foreground px-3 pb-3 pt-10 text-neutral-600 dark:text-neutral-400 sm:grid-cols-3"
                  key={`bucket-${index}`}
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
                    {t("Bucket")} {index + 1}
                  </p>
                  <div className="absolute right-2 top-2 flex items-center justify-between space-x-2">
                    {index > 0 && (
                      <Button
                        className="h-[30px] px-1.5"
                        size={"sm"}
                        variant={"ghost"}
                        onClick={() => {
                          const newBuckets = [...r2Credentials.buckets];
                          newBuckets.splice(index, 1);
                          newBuckets.splice(index - 1, 0, bucket);
                          setR2Credentials({
                            ...r2Credentials,
                            buckets: newBuckets,
                          });
                        }}
                      >
                        <Icons.arrowUp className="size-4" />{" "}
                      </Button>
                    )}
                    {index < r2Credentials.buckets.length - 1 && (
                      <Button
                        className="h-[30px] px-1.5"
                        size={"sm"}
                        variant={"ghost"}
                        onClick={() => {
                          const newBuckets = [...r2Credentials.buckets];
                          newBuckets.splice(index, 1);
                          newBuckets.splice(index + 1, 0, bucket);
                          setR2Credentials({
                            ...r2Credentials,
                            buckets: newBuckets,
                          });
                        }}
                      >
                        <Icons.arrowDown className="size-4" />{" "}
                      </Button>
                    )}
                    <Button
                      className="ml-auto h-[30px] px-1.5"
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {
                        const newBuckets = [...r2Credentials.buckets];
                        newBuckets.splice(index + 1, 0, {
                          bucket: "",
                          prefix: "",
                          file_types: "",
                          region: "auto",
                          custom_domain: "",
                          file_size: "26214400",
                          public: true,
                        });
                        setR2Credentials({
                          ...r2Credentials,
                          buckets: newBuckets,
                        });
                      }}
                    >
                      <Icons.add className="size-4" />{" "}
                    </Button>
                    {index !== 0 && (
                      <Button
                        className="h-[30px] px-1.5"
                        size={"sm"}
                        variant={"outline"}
                      >
                        <Icons.trash
                          className="size-4"
                          onClick={() => {
                            const newBuckets = [...r2Credentials.buckets];
                            newBuckets.splice(index, 1);
                            setR2Credentials({
                              ...r2Credentials,
                              buckets: newBuckets,
                            });
                          }}
                        />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>{t("Bucket Name")}*</Label>
                    <Input
                      value={bucket.bucket}
                      placeholder="bucket name"
                      onChange={(e) => {
                        const newBuckets = [...r2Credentials.buckets];
                        newBuckets[index] = {
                          ...bucket,
                          bucket: e.target.value,
                        };
                        setR2Credentials({
                          ...r2Credentials,
                          buckets: newBuckets,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t("Public Domain")}*</Label>
                    <Input
                      value={bucket.custom_domain}
                      placeholder="https://endpoint or custom domain"
                      onChange={(e) => {
                        const newBuckets = [...r2Credentials.buckets];
                        newBuckets[index] = {
                          ...bucket,
                          custom_domain: e.target.value,
                        };
                        setR2Credentials({
                          ...r2Credentials,
                          buckets: newBuckets,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t("Region")}</Label>
                    <Input
                      value={bucket.region}
                      placeholder="auto"
                      onChange={(e) => {
                        const newBuckets = [...r2Credentials.buckets];
                        newBuckets[index] = {
                          ...bucket,
                          region: e.target.value,
                        };
                        setR2Credentials({
                          ...r2Credentials,
                          buckets: newBuckets,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>
                      {t("Prefix")} ({t("Optional")})
                    </Label>
                    <Input
                      value={bucket.prefix}
                      placeholder="2025/08/08"
                      onChange={(e) => {
                        const newBuckets = [...r2Credentials.buckets];
                        newBuckets[index] = {
                          ...bucket,
                          prefix: e.target.value,
                        };
                        setR2Credentials({
                          ...r2Credentials,
                          buckets: newBuckets,
                        });
                      }}
                    />
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
                        setR2Credentials({
                          ...r2Credentials,
                          buckets: r2Credentials.buckets.map((b, i) => {
                            if (i === index) {
                              return {
                                ...b,
                                public: e,
                              };
                            }
                            return b;
                          }),
                        })
                      }
                    />
                  </div>
                  {/* <div className="space-y-1">
                    <Label>
                      {t("Allowed File Types")} ({t("Optional")})
                    </Label>
                    <Input
                      value={bucket.file_types}
                      placeholder=""
                      disabled
                      onChange={(e) => {
                        const newBuckets = [...r2Credentials.buckets];
                        newBuckets[index] = {
                          ...bucket,
                          file_types: e.target.value,
                        };
                        setR2Credentials({
                          ...r2Credentials,
                          buckets: newBuckets,
                        });
                      }}
                    />
                  </div> */}
                </motion.div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <Link
                  className="text-sm text-blue-500 hover:underline"
                  href="/docs/developer/cloud-storage#cloudflare-r2"
                  target="_blank"
                >
                  {t("How to get the R2 credentials?")}
                </Link>
                <Button
                  className="ml-auto"
                  variant="destructive"
                  onClick={() => {
                    setR2Credentials({
                      platform: "cloudflare",
                      channel: "r2",
                      provider_name: "cloudflare",
                      endpoint: "",
                      access_key_id: "",
                      secret_access_key: "",
                      buckets: [],
                      account_id: "",
                      enabled: false,
                    });
                  }}
                >
                  {t("Clear")}
                </Button>
                <Button
                  disabled={isPending || !canSaveR2Credentials}
                  onClick={() => {
                    handleSaveConfigs(r2Credentials, "s3_config_01", "OBJECT");
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
