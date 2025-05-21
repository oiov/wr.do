import { redirect } from "next/navigation";

import { getAllUsersCount } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";

import SetupGuide from "./guide";

export const metadata = constructMetadata({
  title: "Setup Guide",
  description: "Setup Guide",
});

export default async function SetupPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  if (user.role === "ADMIN") redirect("/admin");

  const count = await getAllUsersCount();

  if (count === 1 && user.role === "USER") {
    return <SetupGuide user={{ id: user.id, email: user.email! }} />;
  }

  return redirect("/admin");
}
