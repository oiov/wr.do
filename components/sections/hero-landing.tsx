import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-24">
      <div className="container flex max-w-screen-md flex-col items-center gap-5 text-center">
        <Link
          href="https://wr.do"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4",
          )}
        >
          <span className="mr-3">🎉</span>Screenshot API&nbsp;
          <span className="font-bold" style={{ fontFamily: "Bahamas Bold" }}>
            available
          </span>
          &nbsp;now!
        </Link>

        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          One Platform Powers{" "}
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Endless Solutions
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          Link shortening, domain hosting, and screenshot api -<br /> everything
          you need to build better.
        </p>

        <div className="flex justify-center space-x-2">
          <Link
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                rounded: "xl",
                size: "lg",
                className: "bg-primary-foreground hover:opacity-70",
              }),
              "px-4 text-[15px]",
            )}
          >
            <Icons.bookOpen className="mr-2 size-4" />
            <p>Documents</p>
          </Link>
          <Link
            href="/dashboard"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "gap-2 px-5 text-[15px] font-semibold",
            )}
          >
            <span>Sign in for free</span>
            <Icons.arrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingImages() {
  return (
    <>
      <div className="mt-12 w-full max-w-6xl px-6">
        <div className="my-14 flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="rounded-lg shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/blog/blog-post-1.jpg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={450}
            height={280}
          />
          <div className="grids px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Free Subdomain Hosting
            </h3>
            <p className="text-lg">
              🎉 Launch your web presence with free custom subdomains.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row">
          <Image
            className="rounded-lg shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/blog/blog-post-2.jpg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              URL Shortening
            </h3>
            <p className="text-lg">
              📖 Transform long URLs into memorable links instantly with stats.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="rounded-lg shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/blog/blog-post-3.jpg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={460}
            height={280}
          />
          <div className="grids px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Website Screenshot API
            </h3>
            <p className="text-lg">
              📷 Capture any webpage instantly with our Screenshot API. Access
              to third party services.{" "}
              <a
                className="underline"
                href="/dashboard/settings"
                target="_blank"
              >
                Apply your api key--&gt;
              </a>
            </p>
          </div>
        </div>

        <div className="my-14 flex flex-col items-center justify-around gap-10 md:flex-row">
          <Image
            className="rounded-lg shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/blog/blog-post-4.jpg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Meta Information API
            </h3>
            <p className="text-lg">
              🍥 Smart web data extraction for seamless integration.Access to
              third party services.{" "}
              <a
                className="underline"
                href="/dashboard/settings"
                target="_blank"
              >
                Apply your api key--&gt;
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="grids my-10 flex w-full max-w-6xl items-center justify-center gap-8 pb-6 pt-6 md:gap-14 md:pb-10 md:pt-10">
        <CardItem
          bgColor="bg-cyan-400"
          rotate="rotate-12 origin-top-left"
          icon={"✏️"}
        />
        <CardItem bgColor="bg-orange-400" rotate="rotate-45" icon="👻" />
        <CardItem rotate="rotate-12 origin-top-left" icon={"📷"} />
        <CardItem bgColor="bg-pink-400" rotate="-rotate-12" icon="🎓" />
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
          " flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl text-xl shadow-lg transition-all hover:rotate-0 md:h-20 md:w-20"
        }
      >
        <span className="font-bold text-slate-100 md:scale-150">{icon}</span>
      </div>
    </>
  );
}
