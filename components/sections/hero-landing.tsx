"user client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import EmailManagerExp from "./email";
import UrlShortener from "./url-shortener";

export default function HeroLanding({
  userId,
}: {
  userId: string | undefined;
}) {
  const t = useTranslations("Landing");
  return (
    <section className="custom-bg relative space-y-6 py-12 sm:py-20 lg:py-24">
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

        <div className="flex items-center justify-center gap-4">
          {/* <GitHubStarsWithSuspense
            owner="oiov"
            repo="wr.do"
            className="shadow-sm"
          /> */}
          <Link
            href="/docs"
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

        <UrlShortener />
      </div>
    </section>
  );
}

export function LandingImages() {
  const t = useTranslations("Landing");
  return (
    <>
      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="my-14 flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={t("exampleImageAlt")}
            src="/_static/landing/link.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={280}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              {t("urlShorteningTitle")}
            </h3>
            <p className="text-lg">{t("urlShorteningDescription")}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={t("exampleImageAlt")}
            src="/_static/landing/hosting.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              {t("freeSubdomainHostingTitle")}
            </h3>
            <p className="text-lg">{t("freeSubdomainHostingDescription")}</p>
          </div>
        </div>

        <div className="my-14 flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={t("exampleImageAlt")}
            src="/_static/landing/email.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={450}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              {t("emailReceiversSendersTitle")}
            </h3>
            <p className="text-lg">
              {t("emailReceiversSendersDescription")}{" "}
              <a
                className="underline"
                href="/dashboard/settings"
                target="_blank"
              >
                {t("applyYourApiKey")}
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={t("exampleImageAlt")}
            src="/_static/landing/domain.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              {t("multipleDomainsTitle")}
            </h3>
            <p className="text-lg">{t("multipleDomainsDescription")}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={t("exampleImageAlt")}
            src="/_static/landing/screenshot.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={460}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              {t("websiteScreenshotApiTitle")}
            </h3>
            <p className="text-lg">
              {t("websiteScreenshotApiDescription")}{" "}
              <a
                className="underline"
                href="/dashboard/settings"
                target="_blank"
              >
                {t("applyYourApiKey")}
              </a>
            </p>
          </div>
        </div>

        <div className="my-14 flex flex-col items-center justify-around gap-10 md:flex-row">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={t("exampleImageAlt")}
            src="/_static/landing/info.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              {t("metaInformationApiTitle")}
            </h3>
            <p className="text-lg">
              {t("metaInformationApiDescription")}{" "}
              <a
                className="underline"
                href="/dashboard/settings"
                target="_blank"
              >
                {t("applyYourApiKey")}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="grids grids-dark mx-auto my-10 flex w-full max-w-6xl px-4">
        <EmailManagerExp />
      </div>
    </>
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
