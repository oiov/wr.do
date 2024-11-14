import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardRecordsLoading() {
  return (
    <>
      <DashboardHeader heading="Scraping API" text="" />
      <Skeleton className="h-full w-full rounded-lg" />
    </>
  );
}
