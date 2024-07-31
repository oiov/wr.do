import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardRecordsLoading() {
  return (
    <>
      <DashboardHeader heading="DNS Records" text="" />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
