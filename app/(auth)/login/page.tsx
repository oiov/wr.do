import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  const t = useTranslations("Auth");
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute left-4 top-4 md:left-8 md:top-8 lg:hidden",
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 size-4" />
          {t("Back")}
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          {/* <Icons.logo className="mx-auto size-12 lg:hidden" /> */}
          <div className="text-2xl font-semibold tracking-tight">
            <span>{t("Welcome to")}</span>{" "}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("Choose your login method to continue")}
          </p>
        </div>
        <Suspense>
          <UserAuthForm />
        </Suspense>

        <p className="px-2 text-center text-sm text-muted-foreground">
          {t("By clicking continue, you agree to our")}{" "}
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            {t("Terms of Service")}
          </Link>{" "}
          {t("and")}{" "}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            {t("Privacy Policy")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
