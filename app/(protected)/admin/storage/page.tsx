import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import UserFileList from "@/components/file";

export const metadata = constructMetadata({
  title: "Cloud Storage",
  description: "List and manage cloud storage.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Cloud Storage"
        text="List and manage cloud storage"
        link="/docs/developer/cloud-storage"
        linkText="Cloud Storage"
      />
      <UserFileList
        user={{
          id: user.id,
          name: user.name || "",
          apiKey: user.apiKey || "",
          email: user.email || "",
          role: user.role,
          team: user.team,
        }}
        action="/api/storage/admin"
      />
    </>
  );
}
