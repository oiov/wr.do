import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import LiveLog from "@/app/(protected)/dashboard/urls/live-logs";

export const metadata = constructMetadata({
  title: "Live Logs",
  description: "Display link's real-time live logs.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader heading="Live Logs" text="" />
      <LiveLog live={true} admin />
    </>
  );
}
