import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardUrlsLoading() {
  return (
    <>
      <DashboardHeader heading="Live Logs" text="" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
