"user client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import CountUpFn from "../dashboard/count-up";
import { InfiniteSlider } from "../ui/infinite-slider";
import { ProgressiveBlur } from "../ui/progressive-blur";
import EmailManagerExp from "./email";
import PreviewLanding from "./preview-landing";
import UrlShortener from "./url-shortener";

export default function HeroLanding({
  userId,
}: {
  userId: string | undefined;
}) {
  const t = useTranslations("Landing");
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

        <div className="group relative m-auto max-w-5xl">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-4 hidden md:mb-0 md:block md:max-w-44 md:border-r md:border-gray-600 md:pr-6">
              <p className="text-end text-sm text-black dark:text-gray-400">
                Powering the best teams
              </p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              <InfiniteSlider durationOnHover={20} duration={40} gap={112}>
                <div className="flex">
                  <img
                    className="mx-auto h-5 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/nvidia-TAN2JNiFDeluYk9hlkv4qXwWtfx5Cy.svg"
                    alt="Nvidia Logo"
                    height="20"
                    width="auto"
                  />
                </div>

                <div className="flex">
                  <img
                    className="mx-auto h-4 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/column-qYeLfzzj1ni9E7PhooLL6Mzip5Zeb4.svg"
                    alt="Column Logo"
                    height="16"
                    width="auto"
                  />
                </div>
                <div className="flex">
                  <img
                    className="mx-auto h-4 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/github-twQNbc5nAy2jUs7yh5xic8hsEfBYpQ.svg"
                    alt="GitHub Logo"
                    height="16"
                    width="auto"
                  />
                </div>
                <div className="flex">
                  <img
                    className="mx-auto h-5 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/nike-H0OCso4JdUtllUTdAverMAjJmcKVXU.svg"
                    alt="Nike Logo"
                    height="20"
                    width="auto"
                  />
                </div>
                <div className="flex">
                  <img
                    className="mx-auto h-5 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/lemonsqueezy-ZL7mmIzqR10hWcodoO19ajha8AS9VK.svg"
                    alt="Lemon Squeezy Logo"
                    height="20"
                    width="auto"
                  />
                </div>
                <div className="flex">
                  <img
                    className="mx-auto h-4 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/laravel-sDCMR3A82V8F6ycZymrDlmiFpxyUd4.svg"
                    alt="Laravel Logo"
                    height="16"
                    width="auto"
                  />
                </div>
                <div className="flex">
                  <img
                    className="mx-auto h-7 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/lilly-Jhslk9VPUVAVK2SCJmCGTEbqKMef5v.svg"
                    alt="Lilly Logo"
                    height="28"
                    width="auto"
                  />
                </div>

                <div className="flex">
                  <img
                    className="mx-auto h-6 w-fit opacity-80 dark:opacity-60 dark:invert"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/openai-5TPubXl1hnLxeIs4ygVSLjJcUoBOCB.svg"
                    alt="OpenAI Logo"
                    height="24"
                    width="auto"
                  />
                </div>
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
            {t("Features")}
          </h2>
          <p className="text-balance text-2xl text-foreground">
            {"All In One Means"}
          </p>
        </div>

        <div className="mb-14 mt-6 flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
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
            {t("Stats")}
          </h2>
          <div className="text-balance text-2xl text-foreground">
            <span style={{ fontFamily: "Bahamas Bold" }}>WR.DO Cloud</span> in
            numbers
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12 divide-y-0 text-center md:grid-cols-4 md:gap-2 md:divide-x">
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">
              <CountUpFn count={2500} />+
            </div>
            <p>{t("Happy Customers")}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">
              <CountUpFn count={6100} />+
            </div>
            <p>{t("Short Links")}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">
              <CountUpFn count={19000} />+
            </div>
            <p>{t("Email Addresses")}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-blue-600">
              <CountUpFn count={40000} />+
            </div>
            <p>{t("Inbox Emails")}</p>
          </div>
        </div>
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
