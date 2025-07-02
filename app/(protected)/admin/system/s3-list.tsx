"use client";

import { use, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
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
    bucket: "",
    endpoint: "",
    region: "auto",
    custom_domain: "",
    prefix: "",
    enabled: true,
    file_types: "",
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
      <Collapsible className="group">
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
                  <Label>Endpoint</Label>
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
                  <Label>Access Key ID</Label>
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
                  <Label>Secret Access Key</Label>
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
                <div className="space-y-1">
                  <Label>Bucket Name</Label>
                  <Input
                    value={r2Credentials.bucket}
                    placeholder="bucket1,bucket2"
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        bucket: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Region</Label>
                  <Input
                    value={r2Credentials.region}
                    placeholder="auto"
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        region: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Custom Domain (Optional)</Label>
                  <Input
                    value={r2Credentials.custom_domain}
                    placeholder="https://example.com,https://example2.com"
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        custom_domain: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Prefix (Optional)</Label>
                  <Input
                    value={r2Credentials.prefix}
                    placeholder=""
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        prefix: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>File Types</Label>
                  <Input
                    value={r2Credentials.file_types}
                    placeholder="png,jpg"
                    onChange={(e) =>
                      setR2Credentials({
                        ...r2Credentials,
                        file_types: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Enabled</Label>
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
                      bucket: "",
                      region: "",
                      account_id: "",
                      custom_domain: "",
                      prefix: "",
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
