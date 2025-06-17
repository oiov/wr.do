"use client";

import { useState, useTransition } from "react";
import {
  updateUserPassword,
  type FormData,
} from "@/actions/update-user-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userPasswordSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserPasswordFormProps {
  user: Pick<User, "id" | "name">;
}

export function UserPasswordForm({ user }: UserPasswordFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserPasswordWithId = updateUserPassword.bind(null, user.id);

  const t = useTranslations("Setting");

  const checkUpdate = (value: string) => {
    setUpdated(value !== "");
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserPasswordWithId(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your password was not updated. Please try again.",
        });
      } else {
        await update();
        setUpdated(false);
        toast.success("Your password has been updated.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={t("Your Password")}
        description={t("Update your password")}
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="Password">
            {t("Password")}
          </Label>
          <Input
            id="Password"
            className="flex-1"
            size={32}
            type="password"
            placeholder="••••••••"
            {...register("password")}
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <Button
            type="submit"
            variant={updated ? "blue" : "disable"}
            disabled={isPending || !updated}
            className="h-9 w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>{t("Save")}</p>
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.password && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.password.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">
            {t("At least 6 characters, Max 32 characters")}
          </p>
        </div>
      </SectionColumns>
    </form>
  );
}
