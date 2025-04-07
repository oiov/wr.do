import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <Skeleton className="h-full w-full rounded-lg" />
    </>
  );
}
