"use client";

import { useState, useTransition } from "react";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

import { CopyButton } from "../shared/copy-button";

interface UserNameFormProps {
  user: Pick<User, "id" | "name" | "apiKey">;
}

type FormData = {
  apiKey: string;
};

export function UserApiKeyForm({ user }: UserNameFormProps) {
  const [isPending, startTransition] = useTransition();
  const [apiKey, setApiKey] = useState(user?.apiKey || "");

  const t = useTranslations("Setting");

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      apiKey: user?.apiKey || "",
    },
  });

  const onSubmit = handleSubmit(() => {
    startTransition(async () => {
      const response = await fetch(`/api/keys`, {
        method: "POST",
      });
      if (!response.ok || response.status !== 200) {
        toast.error("Created Failed!", {
          description: response.statusText,
        });
      } else {
        const res = await response.json();
        setApiKey(res);
        toast.success(`Generated successfully!`);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={t("API Key")}
        description={t("Generate a new API key to access the open apis")}
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            {t("API Key")}
          </Label>
          <div className="flex w-full items-center">
            <input
              value={apiKey || "Click to generate your API key"}
              disabled
              type="password"
              className="flex h-9 flex-1 shrink-0 items-center truncate rounded-l-md border border-r-0 border-input bg-transparent px-3 py-2 text-sm"
            />
            <CopyButton
              value={apiKey}
              className={cn(
                "size-[36px]",
                "duration-250 rounded-l-none border transition-all group-hover:opacity-100",
              )}
            />
          </div>

          <Button
            type="submit"
            variant={"blue"}
            size={"sm"}
            disabled={isPending}
            className="shrink-0 px-4"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              t("Generate")
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.apiKey && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.apiKey.message}
            </p>
          )}
        </div>
      </SectionColumns>
    </form>
  );
}
