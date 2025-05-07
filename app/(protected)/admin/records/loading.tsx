import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardRecordsLoading() {
  return (
    <>
      <DashboardHeader heading="DNS Records" text="" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
