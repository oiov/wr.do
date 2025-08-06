import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { MetaScrapingProps } from "@/app/(protected)/dashboard/scrape/scrapes";

import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import BlurImage, { BlurImg } from "./blur-image";
import { Icons } from "./icons";

export function LinkPreviewer({
  apiKey,
  url,
  formatUrl,
}: {
  apiKey: string;
  url: string;
  formatUrl: string;
}) {
  const [screenshotInfo, setScreenshotInfo] = useState({
    tmp_url: "",
  });

  const handleScrapingScreenshot = async () => {
    if (url) {
      const res = await fetch(
        `/api/v1/scraping/screenshot?url=${url}&key=${apiKey}&width=1200&height=750&viewportWidth=1200&viewportHeight=750`,
      );
      if (!res.ok || res.status !== 200) {
      } else {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setScreenshotInfo({
          tmp_url: imageUrl,
        });
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      handleScrapingScreenshot();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200} onOpenChange={handleOpenChange}>
        <TooltipTrigger className="w-full hover:text-blue-400 hover:underline">
          <Link
            className="flex items-center"
            target="_blank"
            href={url}
            title={url}
          >
            <span className="truncate">{formatUrl}</span>
            <Icons.outLink className="ml-0.5 mt-0.5 size-3 shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent
          align="start"
          className="group flex h-[187px] w-[300px] flex-col items-center justify-center rounded-lg bg-gradient-to-br from-black to-gray-500 p-0 shadow-inner transition-all duration-200"
        >
          <TooltipArrow className="fill-gray-400" />
          {screenshotInfo.tmp_url ? (
            <BlurImage
              className={
                "rounded-md border bg-primary-foreground group-hover:scale-110 group-hover:opacity-95"
              }
              src={
                screenshotInfo.tmp_url ||
                "/_static/illustrations/rocket-crashed.svg"
              }
              width={1200}
              height={750}
              alt={`Preview of ${url}`}
            />
          ) : (
            <Skeleton className="h-[187px] w-[300px]" />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function LinkInfoPreviewer({
  apiKey,
  url,
  formatUrl,
}: {
  apiKey: string;
  url: string;
  formatUrl: string;
}) {
  const placeholdImage = "/_static/illustrations/rocket-crashed.svg";
  const [metaInfo, setMetaInfo] = useState<MetaScrapingProps>({
    title: "",
    description: "",
    image: "",
    icon: "",
    url: "",
    lang: "",
    author: "",
    timestamp: "",
    payload: "",
  });

  const isImageUrl = (url: string): boolean => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
      ".ico",
    ];
    const urlLower = url.toLowerCase();

    const hasImageExtension = imageExtensions.some((ext) =>
      urlLower.includes(ext),
    );

    const imagePatterns = [
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|#|$)/i,
      /\/image\//i,
      /\/img\//i,
      /\/photos?\//i,
      /\/pictures?\//i,
    ];

    const matchesPattern = imagePatterns.some((pattern) => pattern.test(url));

    return hasImageExtension || matchesPattern;
  };

  const handleScrapingInfo = async () => {
    if (!url) return;

    if (isImageUrl(url)) {
      setMetaInfo({
        title: formatUrl,
        description: "",
        image: url,
        icon: "",
        url,
        lang: "",
        author: "",
        timestamp: "",
        payload: "",
      });
      return;
    }

    try {
      const res = await fetch(`/api/v1/scraping/meta?url=${url}&key=${apiKey}`);
      if (!res.ok || res.status !== 200) {
        setMetaInfo({
          title: url,
          description: "",
          image: placeholdImage,
          icon: "",
          url: "",
          lang: "",
          author: "",
          timestamp: "",
          payload: "",
        });
      } else {
        const data = await res.json();
        setMetaInfo({ ...data, title: data.title || url });
      }
    } catch (error) {
      console.error("Error fetching meta info:", error);
      setMetaInfo({
        title: url,
        description: "",
        image: placeholdImage,
        icon: "",
        url: "",
        lang: "",
        author: "",
        timestamp: "",
        payload: "",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      handleScrapingInfo();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200} onOpenChange={handleOpenChange}>
        <TooltipTrigger className="w-full hover:text-blue-400 hover:underline">
          <Link
            className="flex items-center"
            target="_blank"
            href={url}
            title={url}
          >
            <span className="truncate">{formatUrl}</span>
            <Icons.outLink className="ml-0.5 mt-0.5 size-3 shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent
          align="start"
          className="group flex h-[187px] w-[300px] flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gray-300 to-gray-100 p-0 shadow-inner transition-all duration-200"
        >
          <TooltipArrow className="fill-gray-300" />
          {metaInfo.title ? (
            <>
              <BlurImg
                className={cn(
                  "h-full rounded-md bg-primary-foreground group-hover:scale-95 group-hover:opacity-95",
                  (metaInfo.image === placeholdImage || !metaInfo.image) &&
                    "w-full",
                )}
                src={metaInfo.image || placeholdImage}
                alt={`Preview of ${url}`}
              />
              {!isImageUrl(url) && (
                <div className="absolute bottom-0 w-full rounded-b-md p-2 backdrop-blur">
                  <p className="line-clamp-1 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    {metaInfo.title}
                  </p>
                  {metaInfo.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {metaInfo.description}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <Skeleton className="h-[187px] w-[300px]" />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
