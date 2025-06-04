"use client";

import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";

import { siteConfig } from "@/config/site";
import { CreateDNSRecord, RecordType } from "@/lib/cloudflare";
import { UserRecordFormData } from "@/lib/dto/cloudflare-dns-record";
import { RECORD_TYPE_ENUMS, TTL_ENUMS } from "@/lib/enums";
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
  const [currentZoneName, setCurrentZoneName] = useState(
    initData?.zone_name || "wr.do",
  );
  const [email, setEmail] = useState(user.email);
  const isAdmin = action.indexOf("admin") > -1;

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      zone_name: initData?.zone_name || "wr.do",
      type: initData?.type || "CNAME",
      ttl: initData?.ttl || 1,
      proxied: initData?.proxied || false,
      comment: initData?.comment || "",
      name: initData?.name ? initData.name.split(".")[0] : "",
      content: initData?.content || "",
    },
  });

  // Fetch the record domains
  const { data: recordDomains, isLoading } = useSWR<{ domain_name: string }[]>(
    "/api/domain?feature=record",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

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
    if (siteConfig.enableSubdomainApply && data.comment!.length < 20) {
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
          const res = await response.json();
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
        {type === "add" ? "Create" : "Edit"} record
      </div>
      {siteConfig.enableSubdomainApply && (
        <ul className="m-2 list-disc gap-1 rounded-md bg-yellow-600/10 p-2 px-5 pr-2 text-xs font-medium text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-500">
          <li>The administrator has enabled application mode.</li>
          <li>
            After submission, you need to wait for administrator approval before
            the record takes effect.
          </li>
        </ul>
      )}
      <form className="p-4" onSubmit={onSubmit}>
        {isAdmin && (
          <div className="items-center justify-start gap-4 md:flex">
            <FormSectionColumns required title="User email">
              <div className="flex w-full items-center gap-2">
                <Label className="sr-only" htmlFor="content">
                  User email
                </Label>
                <Input
                  id="email"
                  className="flex-1 shadow-inner"
                  size={32}
                  defaultValue={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
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

        {siteConfig.enableSubdomainApply && (
          <FormSectionColumns
            title="What are you planning to use the subdomain for?"
            required
          >
            <div className="flex items-center gap-2">
              <Label className="sr-only" htmlFor="comment">
                What are you planning to use the subdomain for?
              </Label>
              <Textarea
                id="comment"
                className="flex-2 shadow-inner"
                // size={74}
                {...register("comment")}
              />
            </div>
            <p className="p-1 text-[13px] text-muted-foreground">
              At least 20 characters
            </p>
          </FormSectionColumns>
        )}
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title="Domain" required>
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                onValueChange={(value: string) => {
                  setValue("zone_name", value);
                  setCurrentZoneName(value);
                }}
                name="zone_name"
                defaultValue={String(initData?.zone_name || "wr.do")}
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
                      No domains configured
                    </Button>
                  )}
                </SelectContent>
              </Select>
            )}
            <p className="p-1 text-[13px] text-muted-foreground">
              Required. Select a domain.
            </p>
          </FormSectionColumns>
          <FormSectionColumns title="Type" required>
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
                {RECORD_TYPE_ENUMS.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="p-1 text-[13px] text-muted-foreground">Required.</p>
          </FormSectionColumns>
        </div>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title="Name" required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="name">
                Name (required)
              </Label>
              <div className="relative w-full">
                <Input
                  id="name"
                  className="flex-1 shadow-inner"
                  size={32}
                  {...register("name")}
                />
                {(currentRecordType === "CNAME" ||
                  currentRecordType === "A") && (
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
                  Required. E.g. www.
                </p>
              )}
            </div>
          </FormSectionColumns>
          <FormSectionColumns
            required
            title={
              currentRecordType === "CNAME"
                ? "Content"
                : currentRecordType === "A"
                  ? "IPv4 address"
                  : "Content"
            }
          >
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="content">
                Content
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
                  {currentRecordType === "CNAME"
                    ? "Required. E.g. www.example.com"
                    : currentRecordType === "A"
                      ? "Required. E.g. 8.8.8.8"
                      : "Required."}
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
              Optional. Time To Live.
            </p>
          </FormSectionColumns>
          {["A", "CNAME"].includes(currentRecordType) && (
            <FormSectionColumns title="Proxy">
              <div className="flex w-full items-center gap-2">
                <Label className="sr-only" htmlFor="proxy">
                  Proxy
                </Label>
                <Switch
                  id="proxied"
                  {...register("proxied")}
                  onCheckedChange={(value) => setValue("proxied", value)}
                />
              </div>
              <p className="p-1 text-[13px] text-muted-foreground">
                Proxy status.
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
                <p>Delete</p>
              )}
            </Button>
          )}
          <Button
            type="reset"
            variant="outline"
            className="w-[80px] px-0"
            onClick={() => setShowForm(false)}
          >
            Cancle
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
              <p>{type === "edit" ? "Update" : "Save"}</p>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
