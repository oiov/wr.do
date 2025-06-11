import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";

import { EmailDashboard } from "./email";

export const metadata = constructMetadata({
  title: "Emails",
  description: "List and manage emails.",
});

export default async function EmailPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return <EmailDashboard user={user as any} />;
}
