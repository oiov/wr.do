import { useEffect, useState } from "react";
import Link from "next/link";
import BlogPost from "@/public/_static/illustrations/rocket-crashed.svg";

import { MetaScrapingProps } from "@/app/(protected)/dashboard/scrape/meta-scraping";

import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import BlurImage, { BlurImg } from "./blur-image";

export function LinkPreviewer({
  url,
  formatUrl,
}: {
  url: string;
  formatUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [metaInfo, setMetaInfo] = useState<MetaScrapingProps | null>(null);

  const handleScrapingMeta = async () => {
    if (url && open) {
      setIsScraping(true);
      const res = await fetch(`/api/scraping/meta?url=${url}`);
      if (!res.ok || res.status !== 200) {
      } else {
        const data = await res.json();
        setMetaInfo(data);
      }
      setIsScraping(false);
    }
  };

  useEffect(() => {
    handleScrapingMeta();
  }, [url, open]);

  const renderLink = (text: string) => (
    <Link
      className="mt-2 line-clamp-2 max-w-64 overflow-hidden truncate overflow-ellipsis whitespace-normal text-slate-600 after:content-['↗'] hover:underline group-hover:text-blue-400 dark:text-slate-400"
      href={url}
      target="_blank"
      prefetch={false}
    >
      {text}
    </Link>
  );

  return (
    <TooltipProvider>
      <Tooltip open={open} delayDuration={200}>
        <TooltipTrigger
          className="truncate hover:text-blue-400 hover:underline"
          onClick={() => setOpen(!open)}
        >
          {formatUrl}
        </TooltipTrigger>
        <TooltipContent
          className="group flex h-64 w-72 flex-col items-center justify-center py-3 shadow-inner transition-all duration-200 hover:bg-gray-50"
          onPointerDownOutside={() => setOpen(false)}
          onMouseLeave={() => setOpen(false)}
        >
          <TooltipArrow className="fill-gray-400" />
          {isScraping ? (
            <div className="relative flex h-full w-full items-center justify-center">
              <Skeleton className="absolute h-full w-full rounded-lg" />
              <p>Previewing...</p>
            </div>
          ) : metaInfo?.title !== "" ? (
            <div className="relative flex h-full w-full items-end justify-start rounded-lg border bg-primary-foreground p-3 group-hover:opacity-80">
              <BlurImg
                className="absolute left-1/2 top-24 h-2/3 -translate-x-1/2 -translate-y-1/2 transform rounded-lg group-hover:scale-105"
                src={metaInfo?.image || BlogPost}
                alt={metaInfo?.title || ""}
              />
              <div className="max-w-64 space-y-1 truncate">
                {renderLink(metaInfo?.title ?? url)}
                <p className="max-w-64 truncate text-xs">
                  {metaInfo?.description}
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-lg font-bold text-slate-600">
                Faild to preview link
              </p>
              {renderLink(formatUrl ?? url)}
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
0;
