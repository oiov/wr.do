"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ShortUrlFormData } from "@/lib/dto/short-urls";
import { createUrlSchema } from "@/lib/validations/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

import { FormSectionColumns } from "../dashboard/form-section-columns";
import { Switch } from "../ui/switch";

export type FormData = ShortUrlFormData;

export type FormType = "add" | "edit";

export interface RecordFormProps {
  user: Pick<User, "id" | "name">;
  isShowForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  type: FormType;
  initData?: ShortUrlFormData | null;
  onRefresh: () => void;
}

export function UrlForm({
  setShowForm,
  type,
  initData,
  onRefresh,
}: RecordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      id: initData?.id || "",
      target: initData?.target || "",
      url: initData?.url || "",
      active: initData?.active || 1,
      visible: initData?.visible || 0,
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (type === "add") {
      handleCreateUrl(data);
    } else if (type === "edit") {
      handleUpdateUrl(data);
    }
  });

  const handleCreateUrl = async (data: ShortUrlFormData) => {
    startTransition(async () => {
      const response = await fetch("/api/url/add", {
        method: "POST",
        body: JSON.stringify({
          data,
        }),
      });
      if (!response.ok || response.status !== 200) {
        toast.error("Created Failed!", {
          description: response.statusText,
        });
      } else {
        const res = await response.json();
        toast.success(`Created successfully!`);
        setShowForm(false);
        onRefresh();
      }
    });
  };

  const handleUpdateUrl = async (data: ShortUrlFormData) => {
    startTransition(async () => {
      if (type === "edit") {
        const response = await fetch("/api/url/update", {
          method: "POST",
          body: JSON.stringify({ data }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Update Failed", {
            description: response.statusText,
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
        const response = await fetch("/api/url/delete", {
          method: "POST",
          body: JSON.stringify({ url_id: initData?.id }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("Delete Failed", {
            description: response.statusText,
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
    <form
      className="rounded-lg border border-dashed p-4 shadow-sm animate-in fade-in-50"
      onSubmit={onSubmit}
    >
      <div className="items-center justify-start gap-4 md:flex">
        <FormSectionColumns title="Target">
          <div className="flex w-full items-center gap-2">
            <Label className="sr-only" htmlFor="target">
              Target
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
                Required. https://your-origin-url
              </p>
            )}
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="Url">
          <div className="flex w-full items-center gap-2">
            <Label className="sr-only" htmlFor="url">
              Url
            </Label>

            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 whitespace-nowrap text-sm text-gray-400">
                https://wr.do/s/
              </span>
              <Input
                id="url"
                className="flex-1 pl-[116px] shadow-inner"
                size={20}
                {...register("url")}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between p-1">
            {errors?.url ? (
              <p className="pb-0.5 text-[13px] text-red-600">
                {errors.url.message}
              </p>
            ) : (
              <p className="pb-0.5 text-[13px] text-muted-foreground">
                A random url.
              </p>
            )}
          </div>
        </FormSectionColumns>
      </div>

      <div className="items-center justify-start gap-4 md:flex">
        <FormSectionColumns title="Visible">
          <div className="flex w-full items-center gap-2">
            <Label className="sr-only" htmlFor="visible">
              Visible
            </Label>
            <Switch
              id="visible"
              {...register("visible")}
              defaultChecked={initData?.visible === 1 || false}
              onCheckedChange={(value) => setValue("visible", value ? 1 : 0)}
            />
          </div>
          <p className="p-1 text-[13px] text-muted-foreground">
            Public or private short url.
          </p>
        </FormSectionColumns>
        <FormSectionColumns title="Active">
          <div className="flex w-full items-center gap-2">
            <Label className="sr-only" htmlFor="active">
              Active
            </Label>
            <Switch
              id="active"
              {...register("active")}
              defaultChecked={initData?.active === 1 || true}
              onCheckedChange={(value) => setValue("active", value ? 1 : 0)}
            />
          </div>
          <p className="p-1 text-[13px] text-muted-foreground">
            Enable or disable short url.
          </p>
        </FormSectionColumns>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
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
          variant="default"
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
  );
}
