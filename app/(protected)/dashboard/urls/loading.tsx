import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardUrlsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Manage Short URLs"
        text="List and manage short urls"
      />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
