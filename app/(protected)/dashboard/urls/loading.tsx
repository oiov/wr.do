import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardUrlsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Manage Short URLs"
        text="List and manage short urls"
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
