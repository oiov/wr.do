import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import EmailManagerExp from "./email";
import UrlShortener from "./url-shortener";

export default async function HeroLanding() {
  const user = await getCurrentUser();
  return (
    <section className="custom-bg relative space-y-6 py-12 sm:py-20 lg:py-24">
      <div className="container flex max-w-screen-lg flex-col items-center gap-5 text-center">
        <Link
          href="/dashboard"
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4",
          )}
        >
          <span className="mr-3">🎉</span>Email features are&nbsp;
          <span className="font-bold" style={{ fontFamily: "Bahamas Bold" }}>
            available
          </span>
          &nbsp;now!
        </Link>

        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          One platform powers{" "}
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            endless solutions
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          Link shortening, domain hosting, email receivers/senders <br /> and
          screenshot api, everything you need to build better.
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
            <span>Documents</span>
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
            <span>{user?.id ? "Dashboard" : "Sign in for free"}</span>
            {/* <Icons.arrowRight className="size-4" /> */}
          </Link>
        </div>

        <UrlShortener />
      </div>
    </section>
  );
}

export function LandingImages() {
  return (
    <>
      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="my-14 flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/landing/link.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={280}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              URL Shortening
            </h3>
            <p className="text-lg">
              📖 Instantly transform long, unwieldy URLs into short, memorable
              links that are easy to share. Enjoy built-in analytics to track
              clicks, monitor performance, and gain insights into your
              audience—all in real time.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/landing/hosting.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Free Subdomain Hosting
            </h3>
            <p className="text-lg">
              🎉 Kickstart your online presence with free, fully customizable
              subdomains. Whether you&apos;re launching a personal project or
              testing a business idea, get started quickly with no cost and
              reliable hosting you can trust.
            </p>
          </div>
        </div>

        <div className="my-14 flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/landing/email.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={450}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Email Receivers & Senders
            </h3>
            <p className="text-lg">
              📧 Seamlessly receive and send emails from any email provider with
              top-notch security. Stay connected and manage your communications
              effortlessly, knowing your data is protected with robust
              encryption and privacy features.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/landing/domain.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Multiple Domains
            </h3>
            <p className="text-lg">
              🤩 Empower your business with the flexibility of multiple domains,
              such as wr.do, uv.do, and more. Establish a strong digital
              footprint, create branded links, or manage diverse projects—all
              under one unified platform.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-around gap-10 md:flex-row-reverse">
          <Image
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/landing/screenshot.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={460}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Website Screenshot API
            </h3>
            <p className="text-lg">
              📷 Capture high-quality screenshots of any webpage instantly with
              our powerful Screenshot API. Integrate seamlessly into your
              applications, access third-party services, and unlock advanced
              features by applying your unique API key.
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
            className="size-[260px] rounded-lg transition-all hover:opacity-90 hover:shadow-xl"
            alt={"example"}
            src="/_static/landing/info.svg"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAACCSURBVBhXZYzBCgIxDEQnTdPau+hveBB/XtiLn+NJQdoNS2Orq6zuO0zgZRhSVbvegeAJGx7hvUeMAUSEzu1RUesEKuNkIgyrFaoFzB4i8i1+cDEwXHOuRc65lbVpe38XuPm+YMdIKa3WOj9F60vWcj0IOg8Xy7ngdDxgv9vO+h/gCZNAKuSRdQ2rAAAAAElFTkSuQmCC"
            width={430}
            height={280}
          />
          <div className="grids grids-dark px-2 py-4">
            <h3 className="mb-6 text-xl font-bold md:text-3xl">
              Meta Information API
            </h3>
            <p className="text-lg">
              🍥 Extract rich, structured web data effortlessly with our smart
              Meta Information API. Perfect for developers, businesses, or
              researchers, this tool offers seamless integration, third-party
              service access, and enhanced functionality.
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
