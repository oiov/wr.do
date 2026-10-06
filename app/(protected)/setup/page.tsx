import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

export default async function SetupPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  if (user.role === "ADMIN") redirect("/admin");

  return redirect("/dashboard");
}
