import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardRecordsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Manage DNS Records"
        text="List and manage records"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        <Skeleton className="h-[102px] w-full rounded-lg" />
        <Skeleton className="h-[102px] w-full rounded-lg" />
        <Skeleton className="h-[102px] w-full rounded-lg" />
        <Skeleton className="h-[102px] w-full rounded-lg" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
