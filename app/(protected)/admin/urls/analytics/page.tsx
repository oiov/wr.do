import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import Globe from "@/app/(protected)/dashboard/urls/globe";

export const metadata = constructMetadata({
  title: "Globe Analytics",
  description: "Display link's globe analytics.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <Globe isAdmin />
    </>
  );
}
