import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/session";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { FlipWords } from "@/components/shared/flip-words";
import { Icons } from "@/components/shared/icons";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser();
  const t = await getTranslations("Auth");

  if (user) {
    if (user.role === "ADMIN") redirect("/admin");
    redirect("/dashboard");
  }

  // return <div className="min-h-screen">{children}</div>;
  return (
    <main className="relative flex h-screen w-full flex-col">
      <div className="flex-1">
        <div className="flex min-h-screen w-full">
          <div className="relative hidden flex-col border-r bg-muted p-16 lg:flex lg:w-1/2">
            <div className="absolute inset-0 h-full w-full">
              <BackgroundPaths />
            </div>
            <h1 className="z-10 flex items-center gap-3 text-2xl font-semibold duration-1000 animate-in fade-in">
              <Icons.logo className="size-8" />
              <Link href="/" style={{ fontFamily: "Bahamas Bold" }}>
                {siteConfig.name}
              </Link>
            </h1>
            <div className="flex-1" />

            <FlipWords
              words={[t("description")]}
              className="mb-4 text-muted-foreground"
            />
          </div>

          <div className="w-full p-6 lg:w-1/2">{children}</div>
        </div>
      </div>
    </main>
  );
}
