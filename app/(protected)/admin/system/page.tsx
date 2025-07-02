import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import AppConfigs from "./app-configs";
import DomainList from "./domain-list";
import PlanList from "./plan-list";
import S3Configs from "./s3-list";

export const metadata = constructMetadata({
  title: "System Settings",
  description: "",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader heading="System Settings" text="" />
      <AppConfigs />
      <S3Configs />
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
      <PlanList
        user={{
          id: user.id,
          name: user.name || "",
          apiKey: user.apiKey || "",
          email: user.email || "",
          role: user.role,
          team: user.team,
        }}
        action="/api/admin/plan"
      />
    </>
  );
}
