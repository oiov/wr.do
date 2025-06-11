"use client";

import { Dispatch, SetStateAction, useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { create } from "lodash";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PlanQuotaFormData } from "@/lib/dto/plan";
import { createPlanSchema } from "@/lib/validations/plan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

import { FormSectionColumns } from "../dashboard/form-section-columns";
import { Switch } from "../ui/switch";

export type FormData = PlanQuotaFormData;

export type FormType = "add" | "edit";

export interface PlanFormProps {
  user: Pick<User, "id" | "name">;
  isShowForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  type: FormType;
  initData?: FormData | null;
  action: string;
  onRefresh: () => void;
}

export function PlanForm({
  setShowForm,
  type,
  initData,
  action,
  onRefresh,
}: PlanFormProps) {
  const t = useTranslations("List");
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      id: initData?.id || "",
      name: initData?.name || "",
      slTrackedClicks: initData?.slTrackedClicks || 10000,
      slNewLinks: initData?.slNewLinks || 100,
      slAnalyticsRetention: initData?.slAnalyticsRetention || 180,
      slDomains: initData?.slDomains || 1,
      slAdvancedAnalytics: initData?.slAdvancedAnalytics || false,
      slCustomQrCodeLogo: initData?.slCustomQrCodeLogo || false,
      rcNewRecords: initData?.rcNewRecords || 1,
      emEmailAddresses: initData?.emEmailAddresses || 100,
      emDomains: initData?.emDomains || 1,
      emSendEmails: initData?.emSendEmails || 100,
      appSupport: initData?.appSupport || "BASIC",
      appApiAccess: initData?.appApiAccess || false,
      isActive: initData?.isActive || false,
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (type === "add") {
      handleCreatePlan(data);
    } else if (type === "edit") {
      handleUpdatePlan(data);
    }
  });

  const handleCreatePlan = async (data: FormData) => {
    startTransition(async () => {
      const response = await fetch(`${action}`, {
        method: "POST",
        body: JSON.stringify({
          plan: data,
        }),
      });
      if (!response.ok || response.status !== 200) {
        toast.error("Created Failed!", {
          description: await response.text(),
        });
      } else {
        // const res = await response.json();
        toast.success(`Created successfully!`);
        setShowForm(false);
        onRefresh();
      }
    });
  };

  const handleUpdatePlan = async (data: FormData) => {
    startTransition(async () => {
      if (type === "edit") {
        const response = await fetch(`${action}`, {
          method: "PUT",
          body: JSON.stringify({ plan: data }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Update Failed", {
            description: await response.text(),
          });
        } else {
          await response.json();
          toast.success(`Update successfully!`);
          setShowForm(false);
          onRefresh();
        }
      }
    });
  };

  const handleDeletePlan = async () => {
    if (type === "edit") {
      startDeleteTransition(async () => {
        const response = await fetch(`${action}`, {
          method: "DELETE",
          body: JSON.stringify({
            id: initData?.id,
          }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Delete Failed", {
            description: await response.text(),
          });
        } else {
          await response.json();
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
        {type === "add" ? t("Create Plan") : t("Edit Plan")}
      </div>
      <form className="p-4" onSubmit={onSubmit}>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={t("Plan Name")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Plan-Name">
                {t("Plan Name")}
              </Label>
              <Input
                id="name"
                className="flex-1 shadow-inner"
                size={32}
                {...register("name")}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.name ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.name.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Required")}. Plan name must be unique
                </p>
              )}
            </div>
          </FormSectionColumns>
        </div>

        <div className="items-center justify-start gap-4 md:flex">
          {/* Short Limit - slNewLinks */}
          <FormSectionColumns title={t("Short Limit")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Short-Limit">
                {t("Short Limit")}
              </Label>
              <Input
                id="short-limit"
                className="flex-1 shadow-inner"
                size={32}
                type="number"
                {...register("slNewLinks", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.slNewLinks ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.slNewLinks.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Monthly limit of short links created")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
          {/* Email Limit - emEmailAddresses */}
          <FormSectionColumns title={t("Email Limit")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Email-Limit">
                {t("Email Limit")}
              </Label>
              <Input
                id="email-limit"
                className="flex-1 shadow-inner"
                size={32}
                type="number"
                {...register("emEmailAddresses", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.emEmailAddresses ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.emEmailAddresses.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Monthly limit of email addresses created")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
        </div>

        <div className="items-center justify-start gap-4 md:flex">
          {/* "Send Limit" - emSendEmails */}
          <FormSectionColumns title={t("Send Limit")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Send-Limit">
                {t("Send Limit")}
              </Label>
              <Input
                id="send-limit"
                className="flex-1 shadow-inner"
                size={32}
                type="number"
                {...register("emSendEmails", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.emSendEmails ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.emSendEmails.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Monthly limit of emails sent")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
          {/* Record Limit - rcNewRecords */}
          <FormSectionColumns title={t("Record Limit")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Record-Limit">
                {t("Record Limit")}
              </Label>
              <Input
                id="record-limit"
                className="flex-1 shadow-inner"
                size={32}
                type="number"
                {...register("rcNewRecords", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.rcNewRecords ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.rcNewRecords.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Monthly limit of subdomains created")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
        </div>

        <FormSectionColumns title={t("Active")} required>
          <Label className="sr-only" htmlFor="active">
            {t("Active")}:
          </Label>
          <Switch
            id="active"
            {...register("isActive")}
            defaultChecked={initData?.isActive ?? true}
            onCheckedChange={(value) => setValue("isActive", value)}
          />
        </FormSectionColumns>

        {/* Action buttons */}
        <div className="mt-3 flex justify-end gap-3">
          {type === "edit" && initData?.name !== "free" && (
            <Button
              type="button"
              variant="destructive"
              className="mr-auto w-[80px] px-0"
              onClick={() => handleDeletePlan()}
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
