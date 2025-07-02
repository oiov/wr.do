import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import FileManager from "@/components/shared/file-manager";

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
        text="List and manage cloud storage."
        link="/docs/cloud-storage"
        linkText="Cloud Storage"
      />

      <FileManager />
    </>
  );
}
