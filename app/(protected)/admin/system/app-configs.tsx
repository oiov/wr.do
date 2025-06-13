"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/shared/icons";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export default function AppConfigs({}: {}) {
  const [isPending, startTransition] = useTransition();

  const { data: configs, isLoading } = useSWR<Record<string, any>>(
    "/api/admin/configs",
    fetcher,
  );
  const [notification, setNotification] = useState("");

  const t = useTranslations("Setting");

  useEffect(() => {
    if (!isLoading && configs?.system_notification) {
      setNotification(configs.system_notification);
    }
  }, [configs, isLoading]);

  const handleChange = (value: any, key: string, type: string) => {
    startTransition(async () => {
      const res = await fetch("/api/admin/configs", {
        method: "POST",
        body: JSON.stringify({ key, value, type }),
      });
      if (res.ok) {
        toast.success("Updated!");
      } else {
        toast.error("Failed!", {
          description: await res.text(),
        });
      }
    });
  };

  if (isLoading) {
    return (
      <>
        <SkeletonSection />
        <SkeletonSection />
      </>
    );
  }

  return (
    <Card className="bg-neutral-50 dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{t("App Configs")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-3 space-y-6 border-t pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1 leading-none">
              <p className="font-medium">{t("User Registration")}</p>
              <p className="text-xs text-muted-foreground">
                {t("Allow users to sign up")}
              </p>
            </div>
            {configs && (
              <Switch
                defaultChecked={configs.enable_user_registration}
                onCheckedChange={(v) =>
                  handleChange(v, "enable_user_registration", "BOOLEAN")
                }
              />
            )}
          </div>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <div className="space-y-1 text-start leading-none">
                <p className="font-medium">{t("Login Methods")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("Select the login methods that users can use to log in")}
                </p>
              </div>
              <Icons.chevronDown className="ml-2 size-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-3 rounded-md bg-neutral-100 p-3">
              {configs && (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm">GitHub OAuth</p>
                    <Switch
                      defaultChecked={configs.enable_github_oauth}
                      onCheckedChange={(v) =>
                        handleChange(v, "enable_github_oauth", "BOOLEAN")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm">Google OAuth</p>
                    <Switch
                      defaultChecked={configs.enable_google_oauth}
                      onCheckedChange={(v) =>
                        handleChange(v, "enable_google_oauth", "BOOLEAN")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm">LinuxDo OAuth</p>
                    <Switch
                      defaultChecked={configs.enable_liunxdo_oauth}
                      onCheckedChange={(v) =>
                        handleChange(v, "enable_liunxdo_oauth", "BOOLEAN")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm">{t("Resend Email")}</p>
                    <Switch
                      defaultChecked={configs.enable_resend_email_login}
                      onCheckedChange={(v) =>
                        handleChange(v, "enable_resend_email_login", "BOOLEAN")
                      }
                    />
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1 leading-none">
              <p className="font-medium">{t("Subdomain Apply Mode")}</p>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Enable subdomain apply mode, each submission requires administrator review",
                )}
              </p>
            </div>
            {configs && (
              <Switch
                defaultChecked={configs.enable_subdomain_apply}
                onCheckedChange={(v) =>
                  handleChange(v, "enable_subdomain_apply", "BOOLEAN")
                }
              />
            )}
          </div>

          <div className="flex flex-col items-start justify-start gap-3">
            <div className="space-y-1 leading-none">
              <p className="font-medium">{t("Notification")}</p>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Set system notification, this will be displayed in the header",
                )}
              </p>
            </div>
            {configs && (
              <div className="flex w-full items-start gap-2">
                <Textarea
                  className="h-16 max-h-32 min-h-9 resize-y"
                  placeholder="Support HTML format, such as <div>info</div>"
                  rows={5}
                  defaultValue={configs.system_notification}
                  value={notification}
                  onChange={(e) => setNotification(e.target.value)}
                />
                <Button
                  className="h-9 text-nowrap"
                  disabled={
                    isPending || notification === configs.system_notification
                  }
                  onClick={() =>
                    handleChange(notification, "system_notification", "STRING")
                  }
                >
                  {isPending && (
                    <Icons.spinner className="mr-1 size-4 animate-spin" />
                  )}
                  {t("Save")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
