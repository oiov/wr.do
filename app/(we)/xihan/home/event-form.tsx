"use client";

import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { HanEvent, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  EVENT_IMPORTANCE_ENUMS,
  HAN_EVENT_STATUS_ENUMS,
  HAN_EVENT_TYPE_ENUMS,
} from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormSectionColumns } from "@/components/dashboard/form-section-columns";
import { Icons } from "@/components/shared/icons";

export type FormData = HanEvent;

export type FormType = "add" | "edit";

export interface EventFormProps {
  isShowForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  type: FormType;
  initData?: HanEvent | null;
  onRefresh: () => void;
}

export function EventForm({
  isShowForm,
  setShowForm,
  type,
  initData,
  onRefresh,
}: EventFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  // const [currentEventType, setCurrentEventType] = useState(
  //   initData?.type || "record",
  // );

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    // resolver: zodResolver(createRecordSchema),
    defaultValues: {
      id: initData?.id,
      type: initData?.type || "record",
      name: initData?.name || "",
      code: initData?.code || "",
      notes: initData?.notes || "",
      firstOccurredAt: initData?.firstOccurredAt,
      lastOccurredAt: initData?.lastOccurredAt,
      location: initData?.location || "",
      participants: initData?.participants || "",
      photos: initData?.photos || "",
      status: initData?.status || -1,
      importance: initData?.importance || -1,
      reminder: initData?.reminder || false,
      reminderTime: initData?.reminderTime,
      recurrent: initData?.recurrent || true,
      frequency: initData?.frequency,
      tags: initData?.tags || "",
      count: initData?.count || 0,
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (type === "add") {
      handleCreate(data);
    } else if (type === "edit") {
      handleUpdate(data);
    }
  });

  const handleCreate = async (data: HanEvent) => {
    startTransition(async () => {
      const response = await fetch(`/api/xihan/event`, {
        method: "POST",
        body: JSON.stringify({
          data,
        }),
      });
      if (!response.ok || response.status !== 200) {
        toast.error("添加失败", {
          description: response.statusText,
        });
      } else {
        const res = await response.json();
        toast.success(`添加成功`);
        setShowForm(false);
        onRefresh();
      }
    });
  };

  const handleUpdate = async (data: HanEvent) => {
    startTransition(async () => {
      if (type === "edit") {
        const response = await fetch(`/api/xihan/event`, {
          method: "PUT",
          body: JSON.stringify({
            data,
          }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("更新失败", {
            description: response.statusText,
          });
        } else {
          const res = await response.json();
          toast.success(`更新成功`);
          setShowForm(false);
          onRefresh();
        }
      }
    });
  };

  const handleDelete = async () => {
    if (type === "edit") {
      startDeleteTransition(async () => {
        const response = await fetch(`/api/xihan/event`, {
          method: "DELETE",
          body: JSON.stringify({
            id: initData?.id,
          }),
        });
        if (!response.ok || response.status !== 200) {
          toast.error("删除失败", {
            description: response.statusText,
          });
        } else {
          await response.json();
          toast.success(`已删除`);
          setShowForm(false);
          onRefresh();
        }
      });
    }
  };

  return (
    <form className="mb-4 rounded-lg p-4" onSubmit={onSubmit}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {type === "edit" ? "更新" : "添加"}事件
        </h1>
        <Icons.close
          className="cursor-pointer text-slate-500"
          onClick={() => setShowForm(false)}
        />
      </div>

      <div className="items-center justify-start gap-4 md:flex">
        <FormSectionColumns title="事件名称">
          <div className="flex items-center gap-2">
            <Input
              id="name"
              className="h-12 bg-[#fff3fd] text-sm"
              size={74}
              placeholder="输入事件名称"
              {...register("name")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="事件代号">
          <div className="flex items-center gap-2">
            <Input
              id="code"
              className="h-12 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="输入事件代号"
              {...register("code")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="第一次发生日期">
          <div className="flex items-center gap-2">
            <Input
              id="firstOccurredAt"
              className="h-10 bg-[#fff3fd] text-sm"
              size={74}
              placeholder="如 2024-09-15"
              {...register("firstOccurredAt")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="最近一次发生日期">
          <div className="flex items-center gap-2">
            <Input
              id="lastOccurredAt"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="如 2024-09-15"
              {...register("lastOccurredAt")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="备注或描述">
          <div className="flex items-center gap-2">
            <Input
              id="notes"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="输入备注或描述"
              {...register("notes")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="事件发生地点">
          <div className="flex items-center gap-2">
            <Input
              id="location"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="输入事件发生地点"
              {...register("location")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="事件参与者">
          <div className="flex items-center gap-2">
            <Input
              id="participants"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="输入事件参与者"
              {...register("participants")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="照片或视频链接">
          <div className="flex items-center gap-2">
            <Input
              id="photos"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="输入照片或视频链接"
              {...register("photos")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="标签">
          <div className="flex items-center gap-2">
            <Input
              id="tags"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="输入标签, 用逗号间隔"
              {...register("tags")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="事件参与者">
          <div className="flex items-center gap-2">
            <Input
              id="participants"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="输入事件参与者"
              {...register("participants")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="事件发生次数">
          <div className="flex items-center gap-2">
            <Input
              id="count"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="次数"
              {...register("count")}
            />
          </div>
        </FormSectionColumns>
      </div>
      <div className="items-center justify-start gap-4 md:flex">
        <FormSectionColumns title="类型">
          <Select
            onValueChange={(value: string) => {
              setValue("type", value);
              // setCurrentEventType(value);
            }}
            name="type"
            defaultValue={initData?.type || "record"}
          >
            <SelectTrigger className="h-10 w-full bg-[#fff3fd] text-sm shadow-inner">
              <SelectValue placeholder="选择事件类型" />
            </SelectTrigger>
            <SelectContent>
              {HAN_EVENT_TYPE_ENUMS.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormSectionColumns>
        <FormSectionColumns title="事件状态">
          <Select
            onValueChange={(value: string) => {
              setValue("status", Number(value));
            }}
            name="status"
            defaultValue={String(initData?.status || -1)}
          >
            <SelectTrigger className="h-10 w-full bg-[#fff3fd] text-sm shadow-inner">
              <SelectValue placeholder="选择事件状态" />
            </SelectTrigger>
            <SelectContent>
              {HAN_EVENT_STATUS_ENUMS.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormSectionColumns>
        <FormSectionColumns title="重要性">
          <Select
            onValueChange={(value: string) => {
              setValue("importance", Number(value));
            }}
            name="importance"
            defaultValue={String(initData?.importance || -1)}
          >
            <SelectTrigger className="h-10 w-full bg-[#fff3fd] text-sm shadow-inner">
              <SelectValue placeholder="选择事件重要性" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_IMPORTANCE_ENUMS.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormSectionColumns>
        <FormSectionColumns title="是否设置提醒">
          <div className="flex w-full items-center gap-2">
            <Switch
              id="reminder"
              defaultChecked={initData?.reminder || false}
              {...register("reminder")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="提醒日期">
          <div className="flex items-center gap-2">
            <Input
              id="reminderTime"
              className="h-10 bg-[#fff3fd] text-sm shadow-inner"
              size={74}
              placeholder="如 2024-09-15"
              {...register("reminderTime")}
            />
          </div>
        </FormSectionColumns>
        <FormSectionColumns title="是否为重复事件">
          <div className="flex w-full items-center gap-2">
            <Switch
              id="recurrent"
              defaultChecked={initData?.recurrent || true}
              {...register("recurrent")}
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
              <p>删除</p>
            )}
          </Button>
        )}
        <Button
          type="reset"
          variant="outline"
          className="w-[80px] px-0"
          onClick={() => setShowForm(false)}
        >
          取消
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
            <p>{type === "edit" ? "更新" : "保存"}</p>
          )}
        </Button>
      </div>
    </form>
  );
}
