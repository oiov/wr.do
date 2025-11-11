"use client";

import { useState, useTransition } from "react";
import { updateUserName } from "@/actions/update-user-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { formatDate, formatTime } from "@/lib/utils";
import { userEmailSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

import { TimeAgoIntl } from "../shared/time-ago";
import { Badge } from "../ui/badge";

interface UserEmailFormProps {
  user: Pick<User, "id" | "name" | "email" | "emailVerified">;
}

export type FormData = {
  email: string;
};

export function UserEmailForm({ user }: UserEmailFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateUserName.bind(null, user.id);
  const userEmailVerified = new Date(user.emailVerified || "").getSeconds();

  const t = useTranslations("Setting");

  const checkUpdate = (value) => {
    setUpdated(user.email !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userEmailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserNameWithId(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your name was not updated. Please try again.",
        });
      } else {
        await update();
        setUpdated(false);
        toast.success("Your name has been updated.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={t("Your Account Email")}
        description={t("Bind your account to an email address")}
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="email">
            {t("Email")}
          </Label>
          <Input
            id="email"
            className="flex-1"
            size={32}
            {...register("email")}
            disabled
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
        <div className="mt-2 text-xs font-semibold">
          {user.emailVerified ? (
            <Badge variant={"default"}>
              <Icons.shieldUser className="mr-1 size-4 text-green-600" />
              {t("Verified at {date}", {
                date: format(
                  new Date(user.emailVerified),
                  "MM/dd/yyyy HH:mm:ss",
                ),
              })}
            </Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant={"secondary"}>{t("Unverified")}</Badge>
              {/* <p className="ml-2">点击验证</p> */}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.email && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>
      </SectionColumns>
    </form>
  );
}
