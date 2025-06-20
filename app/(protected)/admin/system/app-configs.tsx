"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/shared/icons";
import VersionNotifier from "@/components/shared/version-notifier";

export default function AppConfigs({}: {}) {
  const [isPending, startTransition] = useTransition();
  const [loginMethodCount, setLoginMethodCount] = useState(0);

  const {
    data: configs,
    isLoading,
    mutate,
  } = useSWR<Record<string, any>>("/api/admin/configs", fetcher);
  const [notification, setNotification] = useState("");
  const [catchAllEmails, setCatchAllEmails] = useState("");

  const t = useTranslations("Setting");

  useEffect(() => {
    if (!isLoading && configs?.system_notification) {
      setNotification(configs.system_notification);
    }
    if (!isLoading && configs?.catch_all_emails) {
      setCatchAllEmails(configs.catch_all_emails);
    }
    // 计算登录方式数量
    if (!isLoading) {
      let count = 0;
      if (configs?.enable_google_oauth) count++;
      if (configs?.enable_github_oauth) count++;
      if (configs?.enable_liunxdo_oauth) count++;
      if (configs?.enable_resend_email_login) count++;
      if (configs?.enable_email_password_login) count++;
      setLoginMethodCount(count);
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
        mutate();
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
        <Skeleton className="h-48 w-full rounded-lg" />
      </>
    );
  }

  return (
    <Card>
      <Collapsible className="group">
        <CollapsibleTrigger className="flex w-full items-center justify-between bg-neutral-50 px-4 py-5 dark:bg-neutral-900">
          <div className="text-lg font-bold">{t("App Configs")}</div>
          <Icons.chevronDown className="ml-auto size-4" />
          <Icons.settings className="ml-3 size-4 transition-all group-hover:scale-110" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 border-t bg-neutral-100 p-4 dark:bg-neutral-800">
          <div className="space-y-6">
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

                <Icons.chevronDown className="ml-auto mr-2 size-4" />
                <Badge>{loginMethodCount}</Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3 rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
                {configs && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-sm">
                        <Icons.github className="size-4" /> GitHub OAuth
                      </p>
                      <Switch
                        defaultChecked={configs.enable_github_oauth}
                        onCheckedChange={(v) =>
                          handleChange(v, "enable_github_oauth", "BOOLEAN")
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-sm">
                        <Icons.google className="size-4" />
                        Google OAuth
                      </p>
                      <Switch
                        defaultChecked={configs.enable_google_oauth}
                        onCheckedChange={(v) =>
                          handleChange(v, "enable_google_oauth", "BOOLEAN")
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-sm">
                        <img
                          src="/_static/images/linuxdo.webp"
                          alt="linuxdo"
                          className="size-4"
                        />
                        LinuxDo OAuth
                      </p>
                      <Switch
                        defaultChecked={configs.enable_liunxdo_oauth}
                        onCheckedChange={(v) =>
                          handleChange(v, "enable_liunxdo_oauth", "BOOLEAN")
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-sm">
                        <Icons.resend className="size-4" />
                        {t("Resend Email")}
                      </p>
                      <Switch
                        defaultChecked={configs.enable_resend_email_login}
                        onCheckedChange={(v) =>
                          handleChange(
                            v,
                            "enable_resend_email_login",
                            "BOOLEAN",
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-sm">
                        <Icons.pwdKey className="size-4" />
                        {t("Email Password")}
                      </p>
                      <Switch
                        defaultChecked={configs.enable_email_password_login}
                        onCheckedChange={(v) =>
                          handleChange(
                            v,
                            "enable_email_password_login",
                            "BOOLEAN",
                          )
                        }
                      />
                    </div>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>

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
                    className="h-16 max-h-32 min-h-9 resize-y bg-white"
                    placeholder="Support HTML format, such as <div>info</div>"
                    rows={5}
                    // defaultValue={configs.system_notification}
                    value={notification}
                    onChange={(e) => setNotification(e.target.value)}
                  />
                  <Button
                    className="h-9 text-nowrap"
                    disabled={
                      isPending || notification === configs.system_notification
                    }
                    onClick={() =>
                      handleChange(
                        notification,
                        "system_notification",
                        "STRING",
                      )
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

            <VersionNotifier />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="group border-y">
        <CollapsibleTrigger className="flex w-full items-center justify-between bg-neutral-50 px-4 py-5 dark:bg-neutral-900">
          <div className="text-lg font-bold">{t("Email Configs")}</div>
          <Icons.chevronDown className="ml-auto size-4" />
          <Icons.mail className="ml-3 size-4 transition-all group-hover:scale-110" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 border-t bg-neutral-100 p-4 dark:bg-neutral-800">
          <div className="space-y-6">
            {/* Catch-All */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1 leading-none">
                <p className="flex items-center gap-1 font-medium">
                  Catch-All <Badge>Beta</Badge>
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "Enable email catch-all, all user's email address which created on this platform will be redirected to the catch-all email address",
                  )}
                </p>
              </div>
              {configs && (
                <Switch
                  defaultChecked={configs.enable_email_catch_all}
                  onCheckedChange={(v) =>
                    handleChange(v, "enable_email_catch_all", "BOOLEAN")
                  }
                />
              )}
            </div>
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="space-y-1 leading-none">
                <p className="font-medium">{t("Catch-All Email Address")}</p>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "Set catch-all email address, split by comma if more than one, such as: 1@a-com,2@b-com, Only works when email catch all is enabled",
                  )}
                </p>
              </div>
              {configs && (
                <div className="flex w-full items-start gap-2">
                  <Textarea
                    className="h-16 max-h-32 min-h-9 resize-y bg-white dark:bg-neutral-700"
                    placeholder="1@a.com,2@b.com"
                    rows={5}
                    // defaultValue={configs.catch_all_emails}
                    value={catchAllEmails}
                    disabled={!configs.enable_email_catch_all}
                    onChange={(e) => setCatchAllEmails(e.target.value)}
                  />
                  <Button
                    className="h-9 text-nowrap"
                    disabled={
                      isPending || catchAllEmails === configs.catch_all_emails
                    }
                    onClick={() =>
                      handleChange(catchAllEmails, "catch_all_emails", "STRING")
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

            {/* Message Pusher */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1 leading-none">
                <p className="flex items-center gap-1 font-medium">
                  {t("Message Pusher")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "Push message to third-party services, such as Telegram, 飞书 etc",
                  )}
                  .
                </p>
              </div>
              {configs && (
                <Switch
                  defaultChecked={false}
                  disabled
                  // onCheckedChange={(v) =>
                  //   handleChange(v, "enable_email_catch_all", "BOOLEAN")
                  // }
                />
              )}
            </div>
            {/* Webhook */}
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="space-y-1 leading-none">
                <p className="font-medium">Webhook</p>
                <p className="text-xs text-muted-foreground"></p>
              </div>
              {configs && (
                <div className="flex w-full items-start gap-2">
                  <Textarea
                    className="h-16 max-h-32 min-h-9 resize-y bg-white dark:bg-neutral-700"
                    placeholder=""
                    rows={5}
                    // defaultValue={configs.catch_all_emails}
                    // value={catchAllEmails}
                    disabled
                    // onChange={(e) => setCatchAllEmails(e.target.value)}
                  />
                  <Button
                    className="h-9 text-nowrap"
                    disabled
                    onClick={() =>
                      handleChange(catchAllEmails, "catch_all_emails", "STRING")
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
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="group">
        <CollapsibleTrigger className="flex w-full items-center justify-between bg-neutral-50 px-4 py-5 dark:bg-neutral-900">
          <div className="text-lg font-bold">{t("Subdomain Configs")}</div>
          <Icons.chevronDown className="ml-auto size-4" />
          <Icons.globeLock className="ml-3 size-4 transition-all group-hover:scale-110" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 border-t bg-neutral-100 p-4 dark:bg-neutral-800">
          <div className="space-y-6">
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
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
