import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";

import UserUrlsList from "../../dashboard/urls/url-list";

export const metadata = constructMetadata({
  title: "Links",
  description: "List and manage short links.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <UserUrlsList
        user={{
          id: user.id,
          name: user.name || "",
          apiKey: user.apiKey || "",
          role: user.role,
          team: user.team,
        }}
        action="/api/url/admin"
      />
    </>
  );
}
