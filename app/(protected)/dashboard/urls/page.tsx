import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import UserUrlsList from "./url-list";

export const metadata = constructMetadata({
  title: "Short URLs - WRDO",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Manage&nbsp;Short&nbsp;URLs"
        text="List and manage short urls."
        link="/docs/short-urls"
        linkText="Short urls."
      />
      <UserUrlsList user={{ id: user.id, name: user.name || "" }} />
    </>
  );
}
