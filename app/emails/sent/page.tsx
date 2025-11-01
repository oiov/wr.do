import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import SendsEmailList from "@/components/email/SendsEmailList";

export const metadata = constructMetadata({
  title: "Emails",
  description: "List and manage emails.",
});

export default async function SentEmailPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return <SendsEmailList user={user as any} />;
}
