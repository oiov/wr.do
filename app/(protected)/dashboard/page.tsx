import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import UserRecordsList from "./record-list";

export const metadata = constructMetadata({
  title: "Dashboard - WRDO",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader heading="Dashboard" />
      <UserRecordsList user={{ id: user.id, name: user.name || "" }} />
    </>
  );
}