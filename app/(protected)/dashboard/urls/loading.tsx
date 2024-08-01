import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardUrlsLoading() {
  return (
    <>
      <DashboardHeader heading="Short Urls" text="" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
