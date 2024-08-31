import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <Skeleton className="h-[250px] w-full rounded-lg" />
      <Skeleton className="h-[250px] w-full rounded-lg" />
    </>
  );
}
