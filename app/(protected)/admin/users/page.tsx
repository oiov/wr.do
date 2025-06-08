import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import UsersList from "./user-list";

export const metadata = constructMetadata({
  title: "User Management – WR.DO",
  description: "List and manage all users.",
});

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (!user || !user?.id) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <>
      <DashboardHeader
        heading="User Management"
        text="List and manage all users"
      />
      <UsersList user={{ id: user.id, name: user.name || "" }} />
    </>
  );
}
