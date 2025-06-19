"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";

import { CreateDNSRecord, RecordType } from "@/lib/cloudflare";
import { UserRecordFormData } from "@/lib/dto/cloudflare-dns-record";
import { TTL_ENUMS } from "@/lib/enums";
import { fetcher } from "@/lib/utils";
import { createRecordSchema } from "@/lib/validations/record";
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
import { Textarea } from "../ui/textarea";

export type FormData = CreateDNSRecord;

export type FormType = "add" | "edit";

export interface RecordFormProps {
  user: Pick<User, "id" | "name" | "email">;
  isShowForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  type: FormType;
  initData?: UserRecordFormData | null;
  action: string;
  onRefresh: () => void;
}

export function RecordForm({
  user,
  isShowForm,
  setShowForm,
  type,
  initData,
  action,
  onRefresh,
}: RecordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [currentRecordType, setCurrentRecordType] = useState(
    initData?.type || "CNAME",
  );
  const [currentZoneName, setCurrentZoneName] = useState(initData?.zone_name);
  const [limitLen, setLimitLen] = useState(3);
  const [email, setEmail] = useState(initData?.user.email || user.email);
  const [allowedRecordTypes, setAllowedRecordTypes] = useState<string[]>([]);
  const isAdmin = action.indexOf("admin") > -1;

  const t = useTranslations("List");

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      zone_name: initData?.zone_name,
      type: initData?.type || "CNAME",
      ttl: initData?.ttl || 1,
      proxied: initData?.proxied || false,
      comment: initData?.comment || "",
      name: initData?.name ? initData.name.split(".")[0] : "",
      content: initData?.content || "",
    },
  });

  // Fetch the record domains
  const { data: recordDomains, isLoading } = useSWR<
    {
      domain_name: string;
      cf_record_types: string;
      min_record_length: number;
    }[]
  >("/api/domain?feature=record", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const { data: configs } = useSWR<Record<string, any>>(
    "/api/configs?key=enable_subdomain_apply",
    fetcher,
  );

  const validDefaultDomain = useMemo(() => {
    if (!recordDomains?.length) return undefined;

    if (
      initData?.zone_name &&
      recordDomains.some((d) => d.domain_name === initData.zone_name)
    ) {
      return initData.zone_name;
    }

    return recordDomains[0].domain_name;
  }, [recordDomains, initData?.zone_name]);

  useEffect(() => {
    if (validDefaultDomain) {
      setValue("zone_name", validDefaultDomain);
      setCurrentZoneName(validDefaultDomain);
    }
  }, [validDefaultDomain]);

  useEffect(() => {
    if (recordDomains && recordDomains.length > 0) {
      setAllowedRecordTypes(
        recordDomains
          .find((d) => d.domain_name === validDefaultDomain)!
          .cf_record_types.split(","),
      );
      setLimitLen(
        recordDomains.find((d) => d.domain_name === currentZoneName)
          ?.min_record_length || 3,
      );
    }
  }, [currentZoneName, recordDomains, validDefaultDomain]);

  const onSubmit = handleSubmit((data) => {
    if (isAdmin && type === "edit" && initData?.active === 2) {
      handleApplyRecord(data);
    } else if (type === "add") {
      handleCreateRecord(data);
    } else if (type === "edit") {
      handleUpdateRecord(data);
    }
  });

  const handleCreateRecord = async (data: CreateDNSRecord) => {
    if (configs?.enable_subdomain_apply && data.comment!.length < 20) {
      toast.warning("Apply reason must be at least 20 characters!");
    } else {
      startTransition(async () => {
        const response = await fetch(`${action}/add`, {
          method: "POST",
          body: JSON.stringify({
            records: [data],
            email,
          }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Created Failed!", {
            description: await response.text(),
          });
        } else {
          toast.success(`Created successfully!`);
          setShowForm(false);
          onRefresh();
        }
      });
    }
  };

  const handleUpdateRecord = async (data: CreateDNSRecord) => {
    startTransition(async () => {
      if (type === "edit") {
        const response = await fetch(`${action}/update`, {
          method: "POST",
          body: JSON.stringify({
            recordId: initData?.record_id,
            record: data,
            userId: initData?.userId,
          }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Update Failed", {
            description: await response.text(),
          });
        } else {
          toast.success(`Update successfully!`);
          setShowForm(false);
          onRefresh();
        }
      }
    });
  };

  const handleRejectRecord = async (data: CreateDNSRecord) => {
    startTransition(async () => {
      if (type === "edit") {
        const response = await fetch(`${action}/reject`, {
          method: "POST",
          body: JSON.stringify({
            id: initData?.id,
            userId: initData?.userId,
            record: data,
            recordId: initData?.record_id,
          }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Update Failed", {
            description: await response.text(),
          });
        } else {
          toast.success(`Update successfully!`);
          setShowForm(false);
          onRefresh();
        }
      }
    });
  };

  const handleDeleteRecord = async () => {
    if (type === "edit") {
      startDeleteTransition(async () => {
        const response = await fetch(`${action}/delete`, {
          method: "POST",
          body: JSON.stringify({
            record_id: initData?.record_id,
            zone_id: initData?.zone_id,
            active: initData?.active,
            userId: initData?.userId,
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

  const handleApplyRecord = async (data: CreateDNSRecord) => {
    startTransition(async () => {
      const response = await fetch(`${action}/apply`, {
        method: "POST",
        body: JSON.stringify({
          record: data,
          recordId: initData?.record_id,
          userId: initData?.userId,
          id: initData?.id,
        }),
      });
      if (!response.ok || response.status !== 200) {
        toast.error("Failed", {
          description: await response.text(),
        });
      } else {
        await response.json();
        toast.success(`Success`);
        setShowForm(false);
        onRefresh();
      }
    });
  };

  return (
    <div>
      <div className="rounded-t-lg bg-muted px-4 py-2 text-lg font-semibold">
        {type === "add" ? t("Create record") : t("Edit record")}
      </div>
      {configs?.enable_subdomain_apply && (
        <ul className="m-2 list-disc gap-1 rounded-md bg-yellow-600/10 p-2 px-5 pr-2 text-xs font-medium text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-500">
          <li>{t("The administrator has enabled application mode")}.</li>
          <li>
            {t(
              "After submission, you need to wait for administrator approval before the record takes effect",
            )}
            .
          </li>
        </ul>
      )}
      <form className="p-4" onSubmit={onSubmit}>
        {isAdmin && (
          <div className="items-center justify-start gap-4 md:flex">
            <FormSectionColumns required title={t("User email")}>
              <div className="flex w-full items-center gap-2">
                <Label className="sr-only" htmlFor="content">
                  {t("User email")}
                </Label>
                <Input
                  id="email"
                  className="flex-1 shadow-inner"
                  size={32}
                  defaultValue={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={type === "edit"}
                />
              </div>
              <div className="flex flex-col justify-between p-1">
                {errors?.content ? (
                  <p className="pb-0.5 text-[13px] text-red-600">
                    {errors.content.message}
                  </p>
                ) : (
                  <p className="pb-0.5 text-[13px] text-muted-foreground">
                    Required. Enter user email
                  </p>
                )}
              </div>
            </FormSectionColumns>
          </div>
        )}

        {configs?.enable_subdomain_apply && (
          <FormSectionColumns
            title={t("What are you planning to use the subdomain for?")}
            required
          >
            <div className="flex items-center gap-2">
              <Label className="sr-only" htmlFor="comment">
                {t("What are you planning to use the subdomain for?")}
              </Label>
              <Textarea
                id="comment"
                className="flex-2 shadow-inner"
                // size={74}
                {...register("comment")}
              />
            </div>
            <p className="p-1 text-[13px] text-muted-foreground">
              {t("At least 20 characters")}
            </p>
          </FormSectionColumns>
        )}
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={t("Domain")} required>
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                onValueChange={(value: string) => {
                  setValue("zone_name", value);
                  setCurrentZoneName(value);
                }}
                name="zone_name"
                defaultValue={validDefaultDomain}
                disabled={type === "edit"}
              >
                <SelectTrigger className="w-full shadow-inner">
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {recordDomains && recordDomains.length > 0 ? (
                    recordDomains.map((v) => (
                      <SelectItem key={v.domain_name} value={v.domain_name}>
                        {v.domain_name}
                      </SelectItem>
                    ))
                  ) : (
                    <Button className="w-full" variant="ghost">
                      {t("No domains configured")}
                    </Button>
                  )}
                </SelectContent>
              </Select>
            )}
            <p className="p-1 text-[13px] text-muted-foreground">
              {t("Required")}. {t("Select a domain")}.
            </p>
          </FormSectionColumns>
          <FormSectionColumns title={t("Type")} required>
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                onValueChange={(value: RecordType) => {
                  setValue("type", value);
                  setCurrentRecordType(value);
                }}
                name={"type"}
                defaultValue={initData?.type || "CNAME"}
              >
                <SelectTrigger className="w-full shadow-inner">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {allowedRecordTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="p-1 text-[13px] text-muted-foreground">
              {t("Required")}.
            </p>
          </FormSectionColumns>
        </div>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={t("Name")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="name">
                {t("Name")}
              </Label>
              <div className="relative w-full">
                <Input
                  id="name"
                  className="flex-1 shadow-inner"
                  size={32}
                  minLength={limitLen}
                  {...register("name")}
                />
                {["CNAME", "A", "AAAA"].includes(currentRecordType) && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    .{currentZoneName}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.name ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.name.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Required")}. {t("Example")} www
                </p>
              )}
            </div>
          </FormSectionColumns>
          <FormSectionColumns
            required
            title={
              ["CNAME"].includes(currentRecordType)
                ? t("Content")
                : ["A", "AAAA"].includes(currentRecordType)
                  ? t("IPv4 address")
                  : t("Content")
            }
          >
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="content">
                t("Content")
              </Label>
              <Input
                id="content"
                className="flex-1 shadow-inner"
                size={32}
                {...register("content")}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.content ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.content.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {["CNAME"].includes(currentRecordType)
                    ? `${t("Required")}. ${t("Example")} www.example.com`
                    : ["A", "AAAA"].includes(currentRecordType)
                      ? `${t("Required")}. ${t("Example")} 8.8.8.8`
                      : t("Required")}
                </p>
              )}
            </div>
          </FormSectionColumns>
        </div>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title="TTL" required>
            <Select
              onValueChange={(value: string) => {
                setValue("ttl", Number(value));
              }}
              name="ttl"
              defaultValue={String(initData?.ttl || 1)}
            >
              <SelectTrigger className="w-full shadow-inner">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {TTL_ENUMS.map((ttl) => (
                  <SelectItem key={ttl.value} value={ttl.value}>
                    {ttl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="p-1 text-[13px] text-muted-foreground">
              {t("Optional")}. {t("Time To Live")}.
            </p>
          </FormSectionColumns>
          {["CNAME", "A", "AAAA"].includes(currentRecordType) && (
            <FormSectionColumns title={t("Proxy")}>
              <div className="flex w-full items-center gap-2">
                <Label className="sr-only" htmlFor="proxy">
                  {t("Proxy")}
                </Label>
                <Switch
                  id="proxied"
                  {...register("proxied")}
                  onCheckedChange={(value) => setValue("proxied", value)}
                />
              </div>
              <p className="p-1 text-[13px] text-muted-foreground">
                {t("Proxy status")}.
              </p>
            </FormSectionColumns>
          )}
        </div>
        {/* Action buttons */}
        <div className="mt-3 flex justify-end gap-3">
          {type === "edit" && (
            <Button
              type="button"
              variant="destructive"
              className="mr-auto w-[80px] px-0"
              onClick={() => handleDeleteRecord()}
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
          {type === "edit" && initData?.active === 2 && isAdmin && (
            <Button
              type="button"
              className="w-[80px] px-0"
              onClick={() => handleRejectRecord(getValues())}
              disabled={isPending}
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <p>{t("Reject")}</p>
              )}
            </Button>
          )}
          {initData?.active !== 3 && (
            <Button
              type="submit"
              variant="blue"
              disabled={isPending}
              className="w-[80px] shrink-0 px-0"
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <p>
                  {type === "edit"
                    ? initData?.active === 2 && isAdmin
                      ? t("Agree")
                      : t("Update")
                    : t("Save")}
                </p>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
