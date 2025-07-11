"use client";

import { Dispatch, SetStateAction, useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { create, get } from "lodash";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PlanQuotaFormData } from "@/lib/dto/plan";
import { formatFileSize } from "@/lib/utils";
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
  const [currentStMaxTotalSize, setCurrentStMaxTotalSize] = useState(
    initData?.stMaxTotalSize || "5242880000",
  );
  const [currentStMaxFileSize, setCurrentStMaxFileSize] = useState(
    initData?.stMaxFileSize || "26214400",
  );

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
      slTrackedClicks: initData?.slTrackedClicks ?? 10000,
      slNewLinks: initData?.slNewLinks ?? 100,
      slAnalyticsRetention: initData?.slAnalyticsRetention ?? 180,
      slDomains: initData?.slDomains ?? 1,
      slAdvancedAnalytics: initData?.slAdvancedAnalytics || false,
      slCustomQrCodeLogo: initData?.slCustomQrCodeLogo || false,
      rcNewRecords: initData?.rcNewRecords ?? 1,
      emEmailAddresses: initData?.emEmailAddresses ?? 100,
      emDomains: initData?.emDomains ?? 1,
      emSendEmails: initData?.emSendEmails ?? 100,
      stMaxFileSize: initData?.stMaxFileSize || "26214400",
      stMaxTotalSize: initData?.stMaxTotalSize || "524288000",
      stMaxFileCount: initData?.stMaxFileCount ?? 1000,
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
      <form className="space-y-3 p-4" onSubmit={onSubmit}>
        <div className="relative grid-cols-1 gap-2 rounded-md border bg-neutral-50 px-3 pb-3 pt-8 dark:bg-neutral-900 md:grid md:grid-cols-2">
          <h2 className="absolute left-2 top-2 text-xs font-semibold text-neutral-400">
            {t("Base")}
          </h2>
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
                  {t("Required")}. {t("Plan name must be unique")}
                </p>
              )}
            </div>
          </FormSectionColumns>
          <FormSectionColumns title={t("Active")}>
            <Label className="sr-only" htmlFor="active">
              {t("Active")}:
            </Label>
            <Switch
              id="active"
              className="mb-3"
              {...register("isActive")}
              defaultChecked={initData?.isActive ?? true}
              onCheckedChange={(value) => setValue("isActive", value)}
            />
            <p className="pb-1 text-[13px] text-muted-foreground">
              {t("Only active plans can be used")}
            </p>
          </FormSectionColumns>
        </div>

        <div className="relative grid-cols-1 gap-2 rounded-md border bg-neutral-50 px-3 pb-3 pt-8 dark:bg-neutral-900 md:grid md:grid-cols-2">
          <h2 className="absolute left-2 top-2 text-xs font-semibold text-neutral-400">
            {t("Shorten Service")}
          </h2>
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
          {/* Short Limit -  slAnalyticsRetention*/}
          <FormSectionColumns title={t("View Period")}>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="View-Period">
                {t("View Period")}
              </Label>
              <Input
                id="short-limit"
                className="flex-1 shadow-inner"
                size={32}
                type="number"
                {...register("slAnalyticsRetention", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.slAnalyticsRetention ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.slAnalyticsRetention.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t(
                    "Time range for viewing short link visitor statistics data (days)",
                  )}
                  .
                </p>
              )}
            </div>
          </FormSectionColumns>
          {/* Short Limit -  slTrackedClicks*/}
          <FormSectionColumns title={t("Tracked Limit")}>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Click-Limit">
                {t("Tracked Limit")}
              </Label>
              <Input
                id="short-limit"
                className="flex-1 shadow-inner"
                size={32}
                type="number"
                {...register("slTrackedClicks", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.slTrackedClicks ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.slTrackedClicks.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Monthly limit of tracked clicks (times)")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
          {/* Short Limit -  slDomains */}
          <FormSectionColumns title={t("Domain Limit")}>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Domain-Limit">
                {t("Domain Limit")}
              </Label>
              <Input
                id="short-limit"
                className="flex-1 shadow-inner"
                size={32}
                type="number"
                {...register("slDomains", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.slDomains ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.slDomains.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Limit on the number of allowed domains")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
        </div>

        <div className="relative grid-cols-1 gap-2 rounded-md border bg-neutral-50 px-3 pb-3 pt-8 dark:bg-neutral-900 md:grid md:grid-cols-2">
          <h2 className="absolute left-2 top-2 text-xs font-semibold text-neutral-400">
            {t("Email Service")}
          </h2>
          {/* Email Limit - emEmailAddresses */}
          <FormSectionColumns title={t("Email Limit")}>
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
          {/* "Send Limit" - emSendEmails */}
          <FormSectionColumns title={t("Send Limit")}>
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
        </div>

        <div className="relative grid-cols-1 gap-2 rounded-md border bg-neutral-50 px-3 pb-3 pt-8 dark:bg-neutral-900 md:grid md:grid-cols-2">
          <h2 className="absolute left-2 top-2 text-xs font-semibold text-neutral-400">
            {t("Subdomain Service")}
          </h2>
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

        <div className="relative grid-cols-1 gap-2 rounded-md border bg-neutral-50 px-3 pb-3 pt-8 dark:bg-neutral-900 md:grid md:grid-cols-2">
          <h2 className="absolute left-2 top-2 text-xs font-semibold text-neutral-400">
            {t("Storage Service")}
          </h2>
          {/* Max File Size - stMaxFileSize */}
          <FormSectionColumns title={t("Max File Size")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Record-Limit">
                {t("Max File Size")}
              </Label>
              <div className="relative flex-1">
                <Input
                  id="max-file-size"
                  className="shadow-inner"
                  size={32}
                  {...register("stMaxFileSize")}
                  onChange={(e) => setCurrentStMaxFileSize(e.target.value)}
                />
                <span className="absolute right-2 top-[11px] text-xs text-muted-foreground">
                  =
                  {formatFileSize(Number(currentStMaxFileSize), {
                    precision: 0,
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.stMaxFileSize ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.stMaxFileSize.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Maximum uploaded single file size in bytes")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
          {/* Max File Size - stMaxTotalSize */}
          <FormSectionColumns title={t("Max Total Size")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="Record-Limit">
                {t("Max Total Size")}
              </Label>
              <div className="relative flex-1">
                <Input
                  id="max-total-size"
                  className="shadow-inner"
                  size={32}
                  type="number"
                  {...register("stMaxTotalSize")}
                  onChange={(e) => setCurrentStMaxTotalSize(e.target.value)}
                />
                <span className="absolute right-2 top-[11px] text-xs text-muted-foreground">
                  =
                  {formatFileSize(Number(currentStMaxTotalSize), {
                    precision: 0,
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.stMaxTotalSize ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.stMaxTotalSize.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Maximum uploaded total file size in bytes")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
        </div>

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
