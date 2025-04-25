import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function OrdersLoading() {
  return (
    <>
      <DashboardHeader
        heading="User Management"
        text="List and manage all users."
      />
      <Skeleton className="h-full w-full rounded-lg" />
    </>
  );
}
