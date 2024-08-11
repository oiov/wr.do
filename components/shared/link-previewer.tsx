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
      className="line-clamp-1 max-w-64 overflow-hidden truncate overflow-ellipsis whitespace-normal text-slate-600 transition-colors duration-300 after:content-['↗'] hover:underline group-hover:text-blue-400 dark:text-slate-400"
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
          className="group flex h-full max-h-56 w-72 flex-col items-center justify-center py-3 shadow-inner transition-all duration-200 hover:bg-gray-50"
          onPointerDownOutside={() => setOpen(false)}
          // onMouseLeave={() => setOpen(false)}
        >
          <TooltipArrow className="fill-gray-400" />
          {isScraping ? (
            <div className="relative flex h-full min-h-48 w-full items-center justify-center">
              <Skeleton className="absolute h-full w-full rounded-lg" />
              <p>Previewing...</p>
            </div>
          ) : metaInfo?.title ? (
            <div className="flex h-full w-full flex-col items-center justify-start rounded-lg border bg-primary-foreground group-hover:opacity-80">
              <BlurImg
                className={
                  "w-full rounded-t-lg " + metaInfo?.image
                    ? "h-32 group-hover:scale-110 group-hover:opacity-95"
                    : ""
                }
                src={
                  metaInfo?.image || "/_static/illustrations/rocket-crashed.svg"
                }
                alt={metaInfo?.title || ""}
              />
              <div className="mr-auto max-w-64 truncate p-2">
                {renderLink(metaInfo?.title ?? url)}
                <p className="max-w-64 truncate text-xs text-slate-500">
                  {metaInfo?.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-48 w-full flex-col items-center justify-center rounded-lg border bg-primary-foreground group-hover:opacity-80">
              <p className="mb-2 text-lg font-bold text-slate-600">
                Faild to preview link
              </p>
              {renderLink(formatUrl ?? url)}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
0;
