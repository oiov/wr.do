"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserRole } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";

import { ROLE_ENUM } from "@/lib/enums";
import { fetcher } from "@/lib/utils";
import { updateUserSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

import { FormSectionColumns } from "../dashboard/form-section-columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";

export type FormData = User;

export type FormType = "edit";

export interface RecordFormProps {
  user: Pick<User, "id" | "name">;
  isShowForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  type: FormType;
  initData?: User | null;
  onRefresh: () => void;
}

export function UserForm({
  setShowForm,
  type,
  initData,
  onRefresh,
}: RecordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const t = useTranslations("List");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: initData?.id || "",
      name: initData?.name || "",
      active: initData?.active || 1,
      email: initData?.email || "",
      image: initData?.image || "",
      role: initData?.role || "USER",
      team: initData?.team || "free",
      password: "",
    },
  });

  const { data: plans, isLoading } = useSWR<string[]>(
    "/api/plan/names",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  const onSubmit = handleSubmit((data) => {
    if (type === "edit") {
      handleUpdate(data);
    }
  });

  const handleUpdate = async (data: User) => {
    startTransition(async () => {
      if (type === "edit") {
        const response = await fetch("/api/user/admin/update", {
          method: "POST",
          body: JSON.stringify({ id: initData?.id, data }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Update Failed", {
            description: response.statusText,
          });
        } else {
          toast.success(`Update successfully!`);
          setShowForm(false);
          onRefresh();
        }
      }
    });
  };

  const handleDelete = async () => {
    if (type === "edit") {
      startDeleteTransition(async () => {
        const response = await fetch("/api/user/admin/delete", {
          method: "POST",
          body: JSON.stringify({ id: initData?.id }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Delete Failed", {
            description: response.statusText,
          });
        } else {
          toast.success(`Success`);
          setShowForm(false);
          onRefresh();
        }
      });
    }
  };

  return (
    <div>
      <div className="rounded-t-lg bg-muted px-4 py-2 text-lg font-semibold">
        {t("Edit User")}
      </div>
      <form className="max-w-2xl p-4" onSubmit={onSubmit}>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={t("Email")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="email">
                {t("Email")}
              </Label>
              <Input
                id="email"
                className="flex-1 shadow-inner"
                size={32}
                disabled
                {...register("email")}
              />
            </div>
            {errors?.email && (
              <p className="p-1 text-[13px] text-red-600">
                {errors.email.message}
              </p>
            )}
          </FormSectionColumns>
          <FormSectionColumns title={t("Name")}>
            <Label className="sr-only" htmlFor="name">
              {t("Name")}
            </Label>
            <Input
              id="name"
              className="flex-1 shadow-inner"
              size={20}
              {...register("name")}
            />
            {errors?.name && (
              <p className="p-1 text-[13px] text-red-600">
                {errors.name.message}
              </p>
            )}
          </FormSectionColumns>
        </div>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={t("Role")}>
            <Select
              onValueChange={(value: string) => {
                setValue("role", value as UserRole);
              }}
              name="role"
              defaultValue={`${initData?.role}` || "USER"}
            >
              <SelectTrigger className="w-full shadow-inner">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_ENUM.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {t(role.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormSectionColumns>
          <FormSectionColumns title={t("Plan")}>
            {isLoading ? (
              <Skeleton className="h-9 w-full rounded-r-none border-r-0 shadow-inner" />
            ) : (
              plans &&
              plans.length > 0 && (
                <Select
                  onValueChange={(value: string) => {
                    setValue("team", value);
                  }}
                  name="plan"
                  defaultValue={`${initData?.team}` || "free"}
                >
                  <SelectTrigger className="w-full shadow-inner">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            )}
          </FormSectionColumns>
        </div>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={t("Login Password")}>
            <Label className="sr-only" htmlFor="password">
              {t("Login Password")}
            </Label>
            <Input
              id="password"
              className="flex-1 shadow-inner"
              size={20}
              type="password"
              {...register("password")}
            />
            {errors?.password && (
              <p className="p-1 text-[13px] text-red-600">
                {errors.password.message}
              </p>
            )}
          </FormSectionColumns>
          <FormSectionColumns title={t("Active")}>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="active">
                {t("Active")}
              </Label>
              <Switch
                id="active"
                {...register("active")}
                defaultChecked={initData?.active === 1}
                onCheckedChange={(value) => setValue("active", value ? 1 : 0)}
              />
            </div>
          </FormSectionColumns>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex justify-end gap-3">
          {type === "edit" && (
            <Button
              type="button"
              variant="destructive"
              className="mr-auto w-[80px] px-0"
              onClick={() => handleDelete()}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <p>{t("Delete")}</p>
              )}
            </Button>
          )}
          <Button
            type="reset"
            variant="outline"
            className="w-[80px] px-0"
            onClick={() => setShowForm(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            variant="blue"
            disabled={isPending}
            className="w-[80px] shrink-0 px-0"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>{type === "edit" ? t("Update") : t("Save")}</p>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
