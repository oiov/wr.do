import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardUrlsLoading() {
  return (
    <>
      <Skeleton className="h-[120px] w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
