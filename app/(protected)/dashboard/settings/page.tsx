import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserApiKeyForm } from "@/components/forms/user-api-key-form";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";

export const metadata = constructMetadata({
  title: "Settings – BiuXin",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Account Settings"
        text="Manage account and website settings."
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        {user.role === "ADMIN" && (
          <UserRoleForm user={{ id: user.id, role: user.role }} />
        )}
        <UserApiKeyForm
          user={{
            id: user.id,
            name: user.name || "",
            apiKey: user.apiKey || "",
          }}
        />
        <DeleteAccountSection />
      </div>
    </>
  );
}
