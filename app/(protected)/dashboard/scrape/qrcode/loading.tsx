import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardRecordsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Url to QR Code"
        text="Generate QR Code from URL"
      />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </>
  );
}
