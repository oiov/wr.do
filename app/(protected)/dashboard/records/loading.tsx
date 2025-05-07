import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardRecordsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Manage&nbsp;&nbsp;DNS&nbsp;&nbsp;Records"
        text="List and manage records."
      />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
