"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spotlight } from "@/components/ui/spotlight";
import { Icons } from "@/components/shared/icons";

export default function PasswordPrompt() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const initialPassword = searchParams.get("password") || "";
  const isError = searchParams.get("error") === "1";
  const [password, setPassword] = useState(["", "", "", "", "", ""]);
  const [isHidden, setIsHidden] = useState(true);
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const t = useTranslations("Components");

  useEffect(() => {
    if (initialPassword) {
      const paddedPassword = initialPassword
        .padEnd(6, "")
        .split("")
        .slice(0, 6);
      setPassword(paddedPassword);
      handleSubmit(new Event("submit") as any);
    }
  }, [initialPassword]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPassword = [...password];
    newPassword[index] = value;
    setPassword(newPassword);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !password[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    startTransition(async () => {
      e.preventDefault();
      const fullPassword = password.join("");
      if (slug && !isPending && fullPassword.length === 6) {
        router.push(`/s/${slug}?password=${encodeURIComponent(fullPassword)}`);
      }
    });
  };

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-900">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none [background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#1e1e1e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e1e_1px,transparent_1px)]",
        )}
      />
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />

      <div className="flex flex-1 items-center justify-center">
        <div className="mx-3 w-full max-w-md rounded-lg bg-black/70 px-6 py-6 shadow-md shadow-neutral-900 backdrop-blur-xl md:px-[50px]">
          <h1 className="mb-4 flex items-center justify-center gap-2 text-center text-2xl font-bold text-neutral-50">
            {t("Protected Link")}
          </h1>

          <div className="mb-4 break-all text-left text-sm text-neutral-400">
            <p>
              {t("You are attempting to access a password-protected link")}.{" "}
              <strong>
                {t("Please contact the owner to get the password")}
              </strong>
              . {t("Learn more about this from our")}{" "}
              <Link
                className="underline"
                target="_blank"
                href="/docs/short-urls#password"
              >
                {t("docs")}
              </Link>
              .
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-between gap-2">
              {password.map((char, index) => (
                <Input
                  key={index}
                  type={isHidden ? "password" : "text"}
                  value={char}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el as any)}
                  maxLength={1}
                  autoFocus={index === 0}
                  className="h-12 w-12 rounded-md border border-gray-300 text-center text-lg font-medium text-neutral-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            {isError && (
              <p className="mb-2 animate-fade-in text-left text-sm text-red-500">
                {t("Incorrect password")}! {t("Please try again")}.
              </p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={toggleVisibility}
                className="flex items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-600"
              >
                {isHidden ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>

              <Button
                type="submit"
                variant={"default"}
                className="flex items-center gap-2 bg-neutral-300 text-neutral-800 hover:bg-neutral-400"
                disabled={
                  !(slug && !isPending && password.join("").length === 6)
                }
              >
                {isPending ? (
                  <Icons.spinner className="size-4 animate-spin" />
                ) : (
                  <Icons.unLock className="size-4" />
                )}
                {isPending ? t("Unlocking") : t("Unlock")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <footer className="z-10 py-4 text-center text-sm font-semibold text-neutral-300">
        Powered by{" "}
        <Link
          className="hover:underline"
          href={"https://wr.do"}
          target="_blank"
          style={{ fontFamily: "Bahamas Bold" }}
        >
          {siteConfig.name}
        </Link>
      </footer>
    </div>
  );
}
