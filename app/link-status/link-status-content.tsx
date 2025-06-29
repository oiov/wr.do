"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import BlurImage from "@/components/shared/blur-image";
import { Icons } from "@/components/shared/icons";

interface StatusConfig {
  titleKey: string;
  descriptionKey: string;
  icon: keyof typeof Icons;
  actionTextKey: string;
  showRetry?: boolean;
}

const statusConfigs: Record<string, StatusConfig> = {
  missing: {
    titleKey: "linkNotExist",
    descriptionKey: "linkNotExistDescription",
    icon: "notFonudLink",
    actionTextKey: "contactCreatorReactivate",
  },
  expired: {
    titleKey: "linkExpired",
    descriptionKey: "linkExpiredDescription",
    icon: "expiredLink",
    actionTextKey: "contactCreatorReactivate",
  },
  disabled: {
    titleKey: "linkDisabled",
    descriptionKey: "linkDisabledDescription",
    icon: "disabledLink",
    actionTextKey: "contactCreatorReactivate",
  },
  system: {
    titleKey: "systemError",
    descriptionKey: "systemErrorDescription",
    icon: "systemErrorLink",
    actionTextKey: "contactCreatorOrAdmin",
    showRetry: true,
  },
};

export default function LinkStatusContent() {
  const t = useTranslations("Components");
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "system";
  const slug = searchParams.get("slug") || "";

  const config = statusConfigs[errorType] || statusConfigs.system;

  const handleRetry = () => {
    if (slug) {
      window.location.href = `/${slug}`;
    } else {
      window.location.reload();
    }
  };

  const Icon = Icons[config.icon];

  return (
    <>
      <div className="grids mx-auto mt-6 flex h-screen max-w-lg flex-col items-center justify-center border-muted p-8 sm:rounded-lg sm:border sm:shadow-md">
        <Icon className="mx-auto size-20" />

        <h1 className="my-2 text-2xl font-bold text-neutral-900 dark:text-white">
          {t(config.titleKey)}
        </h1>

        {slug && (
          <div className="my-4 flex min-w-28 max-w-72 items-center justify-start rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
            {/* <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-mono text-neutral-800 dark:text-white">
                /{slug}
              </span>
            </p> */}
            {t(config.descriptionKey)}
            {t(config.actionTextKey)}
          </div>
        )}

        {/* <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
          {t(config.descriptionKey)}
          {t(config.actionTextKey)}
        </p> */}

        <div className="flex w-full flex-col justify-center gap-3 sm:w-fit sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center rounded-md bg-neutral-800 px-4 py-2 text-white transition-colors hover:bg-neutral-900 dark:bg-neutral-800"
          >
            <Home className="mr-2 size-4" />
            {t("backToHome")}
          </Link>

          <Button
            className="h-9 w-full sm:h-12 sm:w-fit"
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 size-4" />
            {t("goBack")}
          </Button>
        </div>
      </div>

      <footer className="z-10 mt-auto py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-500">
        Powered by{" "}
        <Link
          className="hover:underline"
          href={"https://wr.do"}
          target="_blank"
          style={{ fontFamily: "Bahamas Bold" }}
        >
          {siteConfig.name}
        </Link>
      </footer>
    </>
  );
}
