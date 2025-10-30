import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";

import DomainList from "../domain-list";

export const metadata = constructMetadata({
  title: "System Settings",
  description: "",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DomainList
        user={{
          id: user.id,
          name: user.name || "",
          apiKey: user.apiKey || "",
          email: user.email || "",
          role: user.role,
          team: user.team,
        }}
        action="/api/admin/domain"
      />
      <p className="rounded-md border border-dashed bg-muted px-3 py-2 text-xs text-muted-foreground">
        <strong>Note</strong>: Once the domain is bound to the project, it will
        be used as a business domain to provide services, and direct access to
        the business domain will redirect to the main site you deploy.
      </p>
    </>
  );
}
