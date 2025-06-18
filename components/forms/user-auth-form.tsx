"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import * as z from "zod";

import { cn, fetcher } from "@/lib/utils";
import { userAuthSchema, userPasswordAuthSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

type FormData = z.infer<typeof userAuthSchema>;
type FormData2 = z.infer<typeof userPasswordAuthSchema>;

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<FormData2>({
    resolver: zodResolver(userPasswordAuthSchema),
  });
  // const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoading, startTransition] = React.useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false);
  const [isLinuxDoLoading, setIsLinuxDoLoading] =
    React.useState<boolean>(false);
  const searchParams = useSearchParams();
  // const router = useRouter();

  const t = useTranslations("Auth");

  async function onSubmit(data: FormData) {
    startTransition(async () => {
      const signInResult = await signIn("resend", {
        email: data.email.toLowerCase(),
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/dashboard",
      });

      if (!signInResult?.ok) {
        toast.error(t("Something went wrong"), {
          description: "Your sign in request failed. Please try again.",
        });
      }

      toast.success(t("Check your email"), {
        description: `${t("We sent you a login link")}. ${t("Be sure to check your spam too")}.`,
      });
    });
  }
  async function onSubmitPwd(data: FormData2) {
    startTransition(async () => {
      const signInResult = await signIn("credentials", {
        name: data.name,
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/dashboard",
      });

      // console.log("[signInResult]", signInResult);

      if (signInResult?.error) {
        toast.error(t("Something went wrong"), {
          description: `[${signInResult?.error}] ${t("Incorrect email or password")}.`,
        });
      } else {
        toast.success(t("Welcome back!"));
        window.location.reload();
        // router.push(searchParams?.get("from") || "/dashboard");
      }
    });
  }

  const { data: loginMethod, isLoading: isLoadingMethod } = useSWR<
    Record<string, boolean>
  >("/api/feature", fetcher, {
    revalidateOnFocus: false,
  });

  const rendeSeparator = () => {
    return (
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("Or continue with")}
          </span>
        </div>
      </div>
    );
  };

  if (isLoadingMethod || !loginMethod) {
    return (
      <div className={cn("grid gap-3", className)} {...props}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        {rendeSeparator()}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const rendeResend = () =>
    loginMethod["resend"] && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            className="my-2"
            disabled={
              !loginMethod.registration ||
              isLoading ||
              isGoogleLoading ||
              isGithubLoading
            }
          >
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {type === "register"
              ? t("Sign Up with Email")
              : t("Sign In with Email")}
          </Button>
        </div>
      </form>
    );

  const rendeCredentials = () =>
    loginMethod["credentials"] && (
      <form onSubmit={handleSubmit2(onSubmitPwd)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register2("email")}
            />
            {errors2?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors2.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register2("password")}
            />
            {errors2?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors2.password.message}
              </p>
            )}
          </div>

          <Button
            className="my-2"
            disabled={
              !loginMethod.registration ||
              isLoading ||
              isGoogleLoading ||
              isGithubLoading
            }
          >
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t("Sign In / Sign Up")}
          </Button>

          <p className="rounded-md border border-dashed bg-muted px-3 py-2 text-xs text-muted-foreground">
            📢 {t("Unregistered users will automatically create an account")}.
          </p>
        </div>
      </form>
    );

  return (
    <div className={cn("grid gap-3", className)} {...props}>
      {!loginMethod.registration && (
        <p className="rounded-md border border-dashed bg-muted p-3 text-sm text-muted-foreground">
          📢 {t("Administrator has disabled new user registration")}.
        </p>
      )}

      {loginMethod["google"] && (
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
          disabled={
            !loginMethod.registration ||
            isLoading ||
            isGoogleLoading ||
            isGithubLoading ||
            isLinuxDoLoading
          }
        >
          {isGoogleLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 size-4" />
          )}{" "}
          Google
        </Button>
      )}
      {loginMethod["github"] && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsGithubLoading(true);
            signIn("github");
          }}
          disabled={
            !loginMethod.registration ||
            isLoading ||
            isGithubLoading ||
            isGoogleLoading ||
            isLinuxDoLoading
          }
        >
          {isGithubLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.github className="mr-2 size-4" />
          )}{" "}
          Github
        </Button>
      )}
      {loginMethod["linuxdo"] && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsLinuxDoLoading(true);
            signIn("linuxdo");
          }}
          disabled={
            !loginMethod.registration ||
            isLoading ||
            isGithubLoading ||
            isGoogleLoading ||
            isLinuxDoLoading
          }
        >
          {isLinuxDoLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <img
              src="/_static/images/linuxdo.webp"
              alt="linuxdo"
              className="mr-2 size-4"
            />
          )}{" "}
          LinuxDo
        </Button>
      )}

      {(loginMethod["google"] ||
        loginMethod["github"] ||
        loginMethod["linuxdo"]) &&
        (loginMethod["resend"] || loginMethod["credentials"]) &&
        rendeSeparator()}

      {loginMethod["resend"] && loginMethod["credentials"] ? (
        <Tabs defaultValue="resend">
          <TabsList className="mb-2 w-full justify-center">
            <TabsTrigger value="resend">{t("Email Code")}</TabsTrigger>
            <TabsTrigger value="password">{t("Password")}</TabsTrigger>
          </TabsList>
          <TabsContent value="resend">{rendeResend()}</TabsContent>
          <TabsContent value="password">{rendeCredentials()}</TabsContent>
        </Tabs>
      ) : (
        <>
          {rendeResend()}
          {rendeCredentials()}
        </>
      )}
    </div>
  );
}
