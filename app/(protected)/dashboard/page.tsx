import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { AddRecordForm } from "@/components/forms/add-record-form";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Dashboard – Next Template",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        // text={`Current Role : ${user?.role}`}
      />
      <AddRecordForm user={{ id: user.id, name: user.name || "" }} />、
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>No record created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any record yet. Start creating record.
        </EmptyPlaceholder.Description>
        <Button>Add Record</Button>
      </EmptyPlaceholder>
    </>
  );
}
