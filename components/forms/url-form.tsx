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
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";

import { siteConfig } from "@/config/site";
import { ShortUrlFormData } from "@/lib/dto/short-urls";
import { EXPIRATION_ENUMS } from "@/lib/enums";
import { fetcher, generateUrlSuffix } from "@/lib/utils";
import { createUrlSchema } from "@/lib/validations/url";
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

export type FormData = ShortUrlFormData;

export type FormType = "add" | "edit";

export interface RecordFormProps {
  user: Pick<User, "id" | "name">;
  isShowForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  type: FormType;
  initData?: ShortUrlFormData | null;
  action: string;
  onRefresh: () => void;
}

export function UrlForm({
  setShowForm,
  type,
  initData,
  action,
  onRefresh,
}: RecordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [currentPrefix, setCurrentPrefix] = useState(initData?.prefix || "");
  const [limitLen, setLimitLen] = useState(3);
  const t = useTranslations("List");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      id: initData?.id || "",
      target: initData?.target || "",
      url: initData?.url || "",
      active: initData?.active || 1,
      prefix: initData?.prefix || "",
      visible: initData?.visible || 0,
      expiration: initData?.expiration || "-1",
      password: initData?.password || "",
    },
  });

  const { data: shortDomains, isLoading } = useSWR<
    { domain_name: string; min_url_length: number }[]
  >("/api/domain?feature=short", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const validDefaultDomain = useMemo(() => {
    if (!shortDomains?.length) return undefined;

    if (
      initData?.prefix &&
      shortDomains.some((d) => d.domain_name === initData.prefix)
    ) {
      return initData.prefix;
    }

    return shortDomains[0].domain_name;
  }, [shortDomains, initData?.prefix]);

  useEffect(() => {
    if (validDefaultDomain) {
      setValue("prefix", validDefaultDomain);
      setCurrentPrefix(validDefaultDomain);
    }
  }, [validDefaultDomain]);

  useEffect(() => {
    setLimitLen(
      shortDomains?.find((d) => d.domain_name === currentPrefix)
        ?.min_url_length || 3,
    );
  }, [currentPrefix]);

  const onSubmit = handleSubmit((data) => {
    if (type === "add") {
      handleCreateUrl(data);
    } else if (type === "edit") {
      handleUpdateUrl(data);
    }
  });

  const handleCreateUrl = async (data: ShortUrlFormData) => {
    if (data.password !== "" && data.password.length !== 6) {
      toast.error("Password must be 6 characters!");
      return;
    }
    startTransition(async () => {
      const response = await fetch(`${action}/add`, {
        method: "POST",
        body: JSON.stringify({
          data,
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

  const handleUpdateUrl = async (data: ShortUrlFormData) => {
    if (data.password !== "" && data.password.length !== 6) {
      toast.error("Password must be 6 characters!");
      return;
    }
    startTransition(async () => {
      if (type === "edit") {
        const response = await fetch(`${action}/update`, {
          method: "POST",
          body: JSON.stringify({ data, userId: initData?.userId }),
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

  const handleDeleteUrl = async () => {
    if (type === "edit") {
      startDeleteTransition(async () => {
        const response = await fetch(`${action}/delete`, {
          method: "POST",
          body: JSON.stringify({
            url_id: initData?.id,
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

  return (
    <div>
      <div className="rounded-t-lg bg-muted px-4 py-2 text-lg font-semibold">
        {type === "add" ? t("Create short link") : t("Edit short link")}
      </div>
      <form className="p-4" onSubmit={onSubmit}>
        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={t("Target URL")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="target">
                {t("Target")}
              </Label>
              <Input
                id="target"
                className="flex-1 shadow-inner"
                size={32}
                {...register("target")}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.target ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.target.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Required")}. https://your-origin-url
                </p>
              )}
            </div>
          </FormSectionColumns>
          <FormSectionColumns title={t("Short Link")} required>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="url">
                Url
              </Label>

              <div className="relative flex w-full items-center">
                {isLoading ? (
                  <Skeleton className="h-9 w-1/3 rounded-r-none border-r-0 shadow-inner" />
                ) : (
                  <Select
                    onValueChange={(value: string) => {
                      setValue("prefix", value);
                      setCurrentPrefix(value);
                    }}
                    name="prefix"
                    defaultValue={validDefaultDomain}
                    disabled={type === "edit"}
                  >
                    <SelectTrigger className="w-1/3 rounded-r-none border-r-0 shadow-inner">
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {shortDomains && shortDomains.length > 0 ? (
                        shortDomains.map((v) => (
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
                <Input
                  id="url"
                  className="w-full rounded-none pl-[8px] shadow-inner"
                  size={20}
                  minLength={limitLen}
                  {...register("url")}
                  disabled={type === "edit"}
                />
                <Button
                  className="rounded-l-none border-l-0"
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={type === "edit"}
                  onClick={() => {
                    setValue("url", generateUrlSuffix(6));
                  }}
                >
                  <Sparkles className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.url ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.url.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("A random url suffix")}. {t("Final url like")}
                  「wr.do/s/suffix」
                </p>
              )}
            </div>
          </FormSectionColumns>
        </div>

        <div className="items-center justify-start gap-4 md:flex">
          <FormSectionColumns title={`${t("Password")} (${t("Optional")})`}>
            <div className="flex w-full items-center gap-2">
              <Label className="sr-only" htmlFor="password">
                {t("Password")}
              </Label>
              <Input
                id="password"
                className="flex-1 shadow-inner"
                size={32}
                maxLength={6}
                type="password"
                placeholder={t("Enter 6 character password")}
                {...register("password")}
              />
            </div>
            <div className="flex flex-col justify-between p-1">
              {errors?.password ? (
                <p className="pb-0.5 text-[13px] text-red-600">
                  {errors.password.message}
                </p>
              ) : (
                <p className="pb-0.5 text-[13px] text-muted-foreground">
                  {t("Optional")}. {t("If you want to protect your link")}.
                </p>
              )}
            </div>
          </FormSectionColumns>
          <FormSectionColumns title={t("Expiration")} required>
            <Select
              onValueChange={(value: string) => {
                setValue("expiration", value);
              }}
              name="expiration"
              defaultValue={initData?.expiration || "-1"}
            >
              <SelectTrigger className="w-full shadow-inner">
                <SelectValue placeholder="Select a time range" />
              </SelectTrigger>
              <SelectContent>
                {EXPIRATION_ENUMS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="p-1 text-[13px] text-muted-foreground">
              {t("Expiration time, default for never")}.
            </p>
          </FormSectionColumns>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex justify-end gap-3">
          {type === "edit" && (
            <Button
              type="button"
              variant="destructive"
              className="mr-auto w-[80px] px-0"
              onClick={() => handleDeleteUrl()}
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
