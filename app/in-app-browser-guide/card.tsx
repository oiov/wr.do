"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Globe2, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { InAppBrowserPlatform } from "@/lib/in-app-browser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InAppBrowserGuideCardProps {
  shortUrl: string;
  platform: InAppBrowserPlatform;
  message?: string | null;
  copyEnabled: boolean;
}

const INSTRUCTION_KEYS: Record<InAppBrowserPlatform, string> = {
  wechat: "instructionsWechat",
  qq: "instructionsQq",
  weibo: "instructionsOther",
  other: "instructionsOther",
};

export default function InAppBrowserGuideCard({
  shortUrl,
  platform,
  message,
  copyEnabled,
}: InAppBrowserGuideCardProps) {
  const t = useTranslations("InAppBrowserGuide");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Globe2 className="size-7" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription className="max-w-md text-base">
          {message || t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          {t(INSTRUCTION_KEYS[platform])}
        </p>
        <div className="break-all rounded-md border bg-muted/50 p-3 text-center font-mono text-sm">
          {shortUrl}
        </div>
      </CardContent>
      {copyEnabled && (
        <CardFooter className="flex justify-center">
          <Button type="button" onClick={copyLink} className="gap-2">
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? t("copied") : t("copyLink")}
          </Button>
        </CardFooter>
      )}
      <Link
        href="/"
        className="flex items-center justify-center gap-1 pb-6 text-xs text-muted-foreground hover:text-foreground"
      >
        <Home className="size-3" aria-hidden="true" />
        {t("backToHome")}
      </Link>
    </Card>
  );
}
