import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";

import { DNSInfoCard, UrlsInfoCard } from "./info-card";
import UserRecordsList from "./records/record-list";
import UserUrlsList from "./urls/url-list";

export const metadata = constructMetadata({
  title: "Dashboard - WRDO",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader heading="Dashboard" />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <div className="group relative mb-4 h-full w-full shrink-0 origin-left overflow-hidden rounded-lg border bg-gray-200/50 p-4 text-left duration-500 before:absolute before:right-1 before:top-1 before:z-[2] before:h-12 before:w-12 before:rounded-full before:bg-violet-500 before:blur-lg before:duration-500 after:absolute after:right-8 after:top-3 after:z-[2] after:h-20 after:w-20 after:rounded-full after:bg-rose-300 after:blur-lg after:duration-500 hover:border-cyan-600 hover:decoration-2 hover:duration-500 hover:before:-bottom-8 hover:before:right-12 hover:before:blur hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] hover:after:-right-8 group-hover:before:duration-500 group-hover:after:duration-500 dark:bg-primary-foreground md:max-w-[350px]">
            <h1 className="mb-7 text-xl font-bold duration-500 group-hover:text-cyan-500">
              Try free trail
            </h1>
            <p className="text-sm">
              Learn more from{" "}
              <Link
                className="text-blue-500 hover:underline"
                href="/docs"
                target="_blank"
              >
                document.
              </Link>{" "}
            </p>
          </div>
          <DNSInfoCard userId={user.id} />
          <UrlsInfoCard userId={user.id} />
        </div>
        <UserRecordsList user={{ id: user.id, name: user.name || "" }} />
        <UserUrlsList user={{ id: user.id, name: user.name || "" }} />
      </div>
    </>
  );
}
