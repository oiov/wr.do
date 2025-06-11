import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export default function DashboardRecordsLoading() {
  return (
    <>
      <DashboardHeader heading="System Settings" text="" />
      <SkeletonSection />
      <SkeletonSection />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
