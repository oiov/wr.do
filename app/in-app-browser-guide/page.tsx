import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getInAppBrowserGuideConfig } from "@/lib/dto/domains";
import { getUrlBySuffix } from "@/lib/dto/short-urls";
import { getInAppBrowserPlatform } from "@/lib/in-app-browser";
import { constructMetadata } from "@/lib/utils";

import InAppBrowserGuideCard from "./card";

export const metadata = constructMetadata({
  title: "Open in browser",
  description: "Open this short link in your system browser",
});

function buildShortUrl(prefix: string, slug: string) {
  const origin = prefix.includes("://") ? prefix : `https://${prefix}`;
  return new URL(`/${encodeURIComponent(slug)}`, origin).toString();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;
  if (!slug) notFound();

  const platform = getInAppBrowserPlatform((await headers()).get("user-agent"));
  if (!platform) notFound();

  const shortUrl = await getUrlBySuffix(slug);
  if (!shortUrl) notFound();

  if (shortUrl.active !== 1) notFound();

  const now = Date.now();
  const createdAt = new Date(shortUrl.updatedAt).getTime();
  const expirationMilliseconds = Number(shortUrl.expiration) * 1000;
  const expirationTime = createdAt + expirationMilliseconds;

  if (shortUrl.expiration !== "-1" && now > expirationTime) {
    notFound();
  }

  const domainConfig = await getInAppBrowserGuideConfig(shortUrl.prefix);

  if (shortUrl.inAppBrowserGuideOverride === false) notFound();

  if (
    shortUrl.inAppBrowserGuideOverride !== true &&
    !domainConfig?.in_app_browser_guide_enabled
  ) {
    notFound();
  }

  return (
    <InAppBrowserGuideCard
      shortUrl={buildShortUrl(shortUrl.prefix, slug)}
      platform={platform}
      message={domainConfig?.in_app_browser_guide_message}
      copyEnabled={domainConfig?.in_app_browser_guide_copy_enabled ?? true}
    />
  );
}
