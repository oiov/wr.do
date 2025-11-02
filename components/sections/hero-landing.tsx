"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { siteConfig } from "@/config/site";
import { cn, fetcher } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { InfiniteSlider } from "../ui/infinite-slider";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { Separator } from "../ui/separator";
import EmailManagerExp from "./email";
import PreviewLanding from "./preview-landing";
import UrlShortener from "./url-shortener";

export default function HeroLanding({
  userId,
}: {
  userId: string | undefined;
}) {
  const t = useTranslations("Landing");

  const { data: shortDomains, isLoading } = useSWR<{ domain_name: string }[]>(
    "/api/domain?feature=short",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  return (
    <section className="relative space-y-6 py-12 sm:py-16">
      <div className="container flex max-w-screen-lg flex-col items-center gap-5 text-center">
        <Link
          href={siteConfig.links.github}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4",
          )}
        >
          <span className="mr-1">🚀</span>
          {t("deployWithVercel")}&nbsp;
          <span className="font-bold" style={{ fontFamily: "Bahamas Bold" }}>
            Vercel
          </span>
          &nbsp;
          {t("now")}
        </Link>

        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          {t("onePlatformPowers")}
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {t("endlessSolutions")}
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          {t("platformDescription")}
        </p>

        <div className="mb-10 flex items-center justify-center gap-4">
          {/* <GitHubStarsWithSuspense
            owner="oiov"
            repo="wr.do"
            className="shadow-sm"
          /> */}
          <Link
            href="/docs/developer"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg", variant: "outline" }),
              "gap-2 bg-primary-foreground px-4 text-[15px] font-semibold text-primary hover:bg-slate-100",
            )}
          >
            <span>{t("documents")}</span>
            <Icons.bookOpen className="size-4" />
          </Link>
          <Link
            href="/dashboard"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "px-4 text-[15px] font-semibold",
            )}
          >
            <span>{userId ? t("Dashboard") : t("signInForFree")}</span>
            {/* <Icons.arrowRight className="size-4" /> */}
          </Link>
        </div>

        <PreviewLanding />

        <div className="group relative m-auto hidden max-w-4xl md:block">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-4 hidden md:mb-0 md:block md:max-w-44 md:border-r md:border-gray-600 md:pr-6">
              <p className="text-end text-sm text-blue-600">
                {t("Activated Domains")}
              </p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              <InfiniteSlider durationOnHover={20} duration={40} gap={112}>
                {isLoading
                  ? [1, 2, 3, 4].map(() => (
                      <span
                        className="text-lg"
                        style={{ fontFamily: "Bahamas Bold" }}
                      >
                        wr.do
                      </span>
                    ))
                  : shortDomains?.map((domain) => (
                      <span
                        className="text-lg"
                        style={{ fontFamily: "Bahamas Bold" }}
                      >
                        {domain.domain_name}
                      </span>
                    ))}
              </InfiniteSlider>

              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingImages() {
  const t = useTranslations("Landing");
  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-mono font-semibold uppercase tracking-wider text-blue-600">
            {t("FEATURES")}
          </h2>
          <p className="text-balance text-2xl font-semibold text-muted-foreground">
            {"All In One Means"}
          </p>
        </div>

        {/* Short Link Service */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              {t("shortLinkService")}
            </h3>
            <p className="font-semibold text-muted-foreground">
              {t("shortLinkDescription")}
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.link className="mr-2 size-4" /> {t("customSuffix")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("customSuffixDetail", {
                    defaultValue:
                      "Create personalized short links with custom suffixes for better branding",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.lineChart className="mr-2 size-4" />{" "}
                  {t("realtimeStats")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("realtimeStatsDetail", {
                    defaultValue:
                      "Track visitor counts, geographic locations, and device information in real-time",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.pwdKey className="mr-2 size-4" />{" "}
                  {t("passwordProtection")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("passwordProtectionDetail", {
                    defaultValue:
                      "Add password protection to sensitive short links for enhanced security",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.clock className="mr-2 size-4" />
                  {t("linkExpiration")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("linkExpirationDetail", {
                    defaultValue:
                      "Set custom expiration dates for temporary links and campaigns",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.qrcode className="mr-2 size-4" />
                  {t("customQRCode")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("customQRCodeDetail", {
                    defaultValue:
                      "Generate customizable QR codes for your short links",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.braces className="mr-2 size-4" />
                  {t("shortLinkOpenAPI")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("shortLinkOpenAPIDetail", {
                    defaultValue:
                      "Create and manage short links programmatically via REST API",
                  })}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt={t("exampleImageAlt")}
                src="/_static/landing/link.svg"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>

        {/* Domain Email Service */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              {t("domainEmail")}
            </h3>
            <p className="font-semibold text-muted-foreground">
              {t("domainEmailDescription")}
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.mail className="mr-2 size-4" />
                  {t("customEmailPrefix")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("customEmailPrefixDetail", {
                    defaultValue:
                      "Create email addresses with custom prefixes using your domain",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.mailPlus className="mr-2 size-4" />
                  {t("unlimitedMailboxes")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("unlimitedMailboxesDetail", {
                    defaultValue:
                      "Create as many email addresses as you need for different purposes",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.inbox className="mr-2 size-4" />
                  {t("unlimitedReceiving")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("unlimitedReceivingDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.send className="mr-2 size-4" />
                  {t("flexibleSending")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("flexibleSendingDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.mailOpen className="mr-2 size-4" />
                  {t("emailForwarding")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("emailForwardingDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.braces className="mr-2 size-4" />
                  {t("emailOpenAPI")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("emailOpenAPIDetail")}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt={t("exampleImageAlt")}
                src="/_static/landing/email.svg"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>

        {/* Subdomain Hosting Service */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              {t("subdomainHosting")}
            </h3>
            <p className="font-semibold text-muted-foreground">
              {t("subdomainDescription")}
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.cloudflare className="mr-2 size-4" />
                  {t("cloudflareHosting")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("cloudflareHostingDetail", {
                    defaultValue:
                      "Leverage Cloudflare's global infrastructure for fast and reliable DNS hosting",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.globe className="mr-2 size-4" />
                  {t("multiDomainSync")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("multiDomainSyncDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.puzzle className="mr-2 size-4" />
                  {t("flexibleDNSConfig")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("flexibleDNSConfigDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.globeLock className="mr-2 size-4" />
                  {t("antiAbuseManagement")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("antiAbuseManagementDetail")}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt={t("exampleImageAlt")}
                src="/_static/landing/hosting.svg"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>

        {/* File Storage Service */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              {t("fileStorage")}
            </h3>
            <p className="font-semibold text-muted-foreground">
              {t("fileStorageDescription")}
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.globe className="mr-2 size-4" />
                  {t("s3Compatible")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("s3CompatibleDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.dashboard className="mr-2 size-4" />
                  {t("multipleBuckets")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("multipleBucketsDetail", {
                    defaultValue:
                      "Configure multiple storage buckets within a single cloud provider for better organization",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.fileText className="mr-2 size-4" />
                  {t("uploadSizeLimit")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("uploadSizeLimitDetail", {
                    defaultValue:
                      "Set and adjust maximum file upload sizes based on your requirements",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.hand className="mr-2 size-4" />
                  {t("multipleUploadMethods")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("multipleUploadMethodsDetail", {
                    defaultValue:
                      "Upload files using drag-and-drop, batch uploads, or paste from clipboard",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.trash className="mr-2 size-4" />
                  {t("batchDelete")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("batchDeleteDetail", {
                    defaultValue:
                      "Delete multiple files at once for efficient file management",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.qrcode className="mr-2 size-4" />
                  {t("quickShortLink")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("quickShortLinkDetail", {
                    defaultValue:
                      "Instantly generate short links and QR codes for your stored files",
                  })}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt={t("exampleImageAlt")}
                src="/_static/landing/domain.svg"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>

        {/* Open API Service */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              {t("openAPI")}
            </h3>
            <p className="font-semibold text-muted-foreground">
              {t("openAPIDescription")}
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.scanQrCode className="mr-2 size-4" />
                  {t("websiteMetadata")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("websiteMetadataDetail", {
                    defaultValue:
                      "Extract metadata such as title, description, and Open Graph tags from any website",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.camera className="mr-2 size-4" />
                  {t("websiteScreenshot")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("websiteScreenshotDetail", {
                    defaultValue:
                      "Capture high-quality screenshots of any website for previews and documentation",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.qrcode className="mr-2 size-4" />
                  {t("websiteQRCode")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("websiteQRCodeDetail", {
                    defaultValue:
                      "Convert any website URL into a scannable QR code",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.monitorDown className="mr-2 size-4" />
                  {t("websiteConversion")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("websiteConversionDetail", {
                    defaultValue:
                      "Convert website content to Markdown or plain text format for easy integration",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.braces className="mr-2 size-4" />
                  {t("apiKeyMechanism")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("apiKeyMechanismDetail")}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt={t("exampleImageAlt")}
                src="/_static/landing/screenshot.svg"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>

        {/* Permission Management Module */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              {t("permissionManagement")}
            </h3>
            <p className="font-semibold text-muted-foreground">
              {t("permissionManagementDescription")}
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.lineChart className="mr-2 size-4" />
                  {t("dataVisualization")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("dataVisualizationDetail", {
                    defaultValue:
                      "View comprehensive dashboard with charts showing usage trends and analytics",
                  })}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.cog className="mr-2 size-4" />
                  {t("serviceConfiguration")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("serviceConfigurationDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.users className="mr-2 size-4" />
                  {t("userManagement")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("userManagementDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.shieldCheck className="mr-2 size-4" />
                  {t("loginMethods")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("loginMethodsDetail")}
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.databaseZap className="mr-2 size-4" />
                  {t("resourceManagement")}
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  {t("resourceManagementDetail")}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt={t("exampleImageAlt")}
                src="/_static/landing/info.svg"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>
      </div>

      <TechStackGrid />

      <DynamicData />

      <div className="grids grids-dark mx-auto my-12 flex w-full max-w-6xl px-4">
        <UrlShortener />
        <EmailManagerExp />
      </div>
    </>
  );
}

export function DynamicData() {
  const t = useTranslations("Landing");
  return (
    <div>
      <div className="mx-auto mt-10 max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-mono font-semibold uppercase tracking-wider text-blue-600">
            {t("STATS")}
          </h2>
          <div className="text-balance text-2xl text-foreground">
            <span style={{ fontFamily: "Bahamas Bold" }}>WR.DO Cloud</span> in
            numbers
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12 divide-y-0 text-center md:grid-cols-4 md:gap-2 md:divide-x">
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">2.5K+</div>
            <p>{t("Happy Customers")}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">6.2K+</div>
            <p>{t("Short Links")}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">2M+</div>
            <p>{t("Tracked Clicks")}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">40K+</div>
            <p>{t("Inbox Emails")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechStackGrid() {
  const t = useTranslations("Landing");
  const items = [
    {
      icon: "N",
      title: "Next.js",
      description: "The most popular full stack React framework.",
    },
    {
      icon: "🔐",
      title: "Next Auth",
      description: "The best open source authentication library.",
    },
    {
      icon: "🗂️",
      title: "Prisma ORM",
      description: "Lightweight, performant, headless TypeScript ORM.",
    },
    {
      icon: "✏️",
      title: "Shadcn UI",
      description: "Open source components for building modern websites.",
    },
    {
      icon: "🎨",
      title: "Tailwind CSS",
      description: "The CSS framework for rapid UI development.",
    },
    {
      icon: "☁️",
      title: "Cloudflare",
      description: "The best open source cloud platform.",
    },
    {
      icon: "▲",
      title: "Vercel",
      description: "The best open source hosting platform.",
    },
    {
      icon: "📧",
      title: "Resend/Brevo",
      description: "The best email service.",
    },
  ];

  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="font-mono font-semibold uppercase tracking-wider text-blue-600">
          {t("TECH STACK")}
        </h2>
        <p className="text-balance text-2xl font-semibold text-muted-foreground">
          {t("Build with your favorite tech stack")}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-muted"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-lg font-bold text-gray-700">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardItem({
  bgColor = "bg-yellow-400",
  rotate = "rotate-12",
  icon,
}: {
  bgColor?: string;
  rotate?: string;
  icon: ReactNode;
}) {
  return (
    <>
      <div
        className={
          `${bgColor} ${rotate}` +
          " flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl text-xl transition-all hover:rotate-0 md:h-20 md:w-20"
        }
      >
        <span className="font-bold text-slate-100 md:scale-150">{icon}</span>
      </div>
    </>
  );
}
