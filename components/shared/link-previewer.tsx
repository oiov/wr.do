import { useState } from "react";
import Link from "next/link";

import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import BlurImage from "./blur-image";
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
0;
