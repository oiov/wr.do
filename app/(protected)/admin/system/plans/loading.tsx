import { Skeleton } from "@/components/ui/skeleton";

export default function SystemSettingsLoading() {
  return (
    <>
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-56 w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
