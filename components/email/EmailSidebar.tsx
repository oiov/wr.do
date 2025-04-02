"use client";

import { useState, useTransition } from "react";
import { User, UserEmail } from "@prisma/client";
import randomName from "@scaleway/random-name";
import {
  PanelLeftClose,
  PanelRightClose,
  PenLine,
  Search,
  Sparkles,
  SquarePlus,
} from "lucide-react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

import { siteConfig } from "@/config/site";
import { UserEmailList } from "@/lib/dto/email";
import { cn, fetcher, timeAgo } from "@/lib/utils";

import CountUp from "../dashboard/count-up";
import { CopyButton } from "../shared/copy-button";
import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { Icons } from "../shared/icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal"; // 引入 Modal 组件

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";

interface EmailSidebarProps {
  user: User;
  onSelectEmail: (emailAddress: string | null) => void;
  selectedEmailAddress: string | null;
  className?: string;
  isCollapsed?: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isAdminModel: boolean;
  setAdminModel: (isAdminModel: boolean) => void;
}

export default function EmailSidebar({
  user,
  onSelectEmail,
  selectedEmailAddress,
  className,
  isCollapsed,
  setIsCollapsed,
  isAdminModel,
  setAdminModel,
}: EmailSidebarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [domainSuffix, setDomainSuffix] = useState<string | null>(
    siteConfig.shortDomains[0],
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false); // 删除确认弹框状态
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null); // 要删除的邮箱 ID
  const [deleteInput, setDeleteInput] = useState("");

  const pageSize = 10;

  const getKey = (
    pageIndex: number,
    previousPageData: { list: UserEmail[] } | null,
  ) => {
    if (previousPageData && !previousPageData.list.length) return null;
    return `/api/email?page=${pageIndex}&size=${pageSize}&search=${searchQuery}&all=${isAdminModel}`;
  };

  const { data, isLoading, error, size, setSize, mutate } = useSWRInfinite<{
    list: UserEmailList[];
    total: number;
  }>(getKey, fetcher, { dedupingInterval: 3000 });

  if (
    !selectedEmailAddress &&
    data &&
    data.length > 0 &&
    data[0].list.length > 0
  ) {
    onSelectEmail(data[0].list[0].emailAddress);
  }

  const userEmails = data ? data.flatMap((page) => page.list) : [];
  const hasMore = data && data[data.length - 1]?.list.length === pageSize;

  const totalInboxEmails = userEmails.reduce(
    (sum, email) => sum + (email.count || 0),
    0,
  );

  const totalUnreadEmails = userEmails.reduce(
    (sum, email) => sum + (email.unreadCount || 0),
    0,
  );

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setSize(size + 1);
    }
  };

  const handleSubmitEmail = async (emailSuffix: string) => {
    if (!emailSuffix) {
      toast.error("Email address cannot be empty");
      return;
    }
    if (/[^a-zA-Z0-9_\-\.]/.test(emailSuffix)) {
      toast.error("Invalid email address");
      return;
    }
    if (!domainSuffix) {
      toast.error("Domain suffix cannot be empty");
      return;
    }
    startTransition(async () => {
      if (isEdit) {
        const editEmailId = userEmails.find(
          (email) => email.emailAddress === selectedEmailAddress,
        )?.id;
        const res = await fetch(`/api/email/${editEmailId}`, {
          method: "PUT",
          body: JSON.stringify({
            emailAddress: `${emailSuffix}@${domainSuffix}`,
          }),
        });
        if (res.ok) {
          mutate();
          setShowEmailModal(false);
          toast.success("Email updated successfully");
        } else {
          toast.error("Failed to update email", {
            description: await res.text(),
          });
        }
        return;
      } else {
        try {
          const res = await fetch("/api/email", {
            method: "POST",
            body: JSON.stringify({
              emailAddress: `${emailSuffix}@${domainSuffix}`,
            }),
          });
          if (res.ok) {
            mutate();
            setShowEmailModal(false);
            toast.success("Email created successfully");
          } else {
            toast.error("Failed to create email", {
              description: await res.text(),
            });
          }
        } catch (error) {
          console.log("Error creating email:", error);
          toast.error("Error creating email");
        }
      }
    });
  };

  const handleOpenEditEmail = async (email: UserEmail) => {
    onSelectEmail(email.emailAddress);
    setDomainSuffix(email.emailAddress.split("@")[1]);
    if (selectedEmailAddress === email.emailAddress) {
      setIsEdit(true);
      setShowEmailModal(true);
    }
  };
  const handleDeleteEmail = async (id: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/email/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          mutate();
          setShowDeleteModal(false);
          setDeleteInput("");
          setEmailToDelete(null);
          toast.success("Email deleted successfully");
        } else {
          toast.error("Failed to delete email");
        }
      } catch (error) {
        console.log("Error deleting email:", error);
      }
    });
  };

  const confirmDelete = () => {
    if (!emailToDelete) return;

    const selectedEmail = userEmails.find(
      (email) => email.id === emailToDelete,
    );
    if (!selectedEmail) return;

    const expectedInput = `delete ${selectedEmail.emailAddress}`;
    if (deleteInput === expectedInput) {
      handleDeleteEmail(emailToDelete);
    } else {
      toast.error("Input does not match. Please type correctly.");
    }
  };

  return (
    <div
      className={cn(`flex h-full flex-col border-r transition-all`, className)}
    >
      {/* Header */}
      <div className="border-b p-2 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Button
                className="size-8 lg:size-7"
                variant="outline"
                size="icon"
                onClick={async () => {
                  setIsRefreshing(true);
                  await mutate();
                  setIsRefreshing(false);
                }}
                disabled={isRefreshing}
              >
                <Icons.refreshCw
                  size={15}
                  className={
                    isRefreshing || isLoading
                      ? "animate-spin stroke-muted-foreground"
                      : "stroke-muted-foreground"
                  }
                />
              </Button>
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emails..."
                  className="h-[30px] w-full border p-1 pl-8 text-xs"
                />
                <Search className="absolute left-2 top-2 size-4 text-gray-500" />
              </div>
            </div>
          )}
          <Button
            className={cn("px-1", !isCollapsed ? "size-7" : "size-8")}
            variant="outline"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <PanelRightClose size={16} className="stroke-muted-foreground" />
            ) : (
              <PanelLeftClose size={16} className="stroke-muted-foreground" />
            )}
          </Button>
        </div>

        <Button
          className={
            isCollapsed
              ? "mx-auto size-9 lg:size-8"
              : "flex h-8 w-full items-center justify-center gap-2"
          }
          variant="default"
          size="icon"
          onClick={() => {
            setIsEdit(false);
            setShowEmailModal(true);
          }}
        >
          <SquarePlus className="size-4" />
          {!isCollapsed && <span className="text-xs">Create New Email</span>}
        </Button>

        {!isCollapsed && (
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg text-xs text-neutral-700 dark:bg-gray-900 dark:text-neutral-400">
            {/* Address */}
            <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div className="flex items-center gap-1">
                <Icons.mail className="size-3" />
                <p className="line-clamp-1 text-start font-medium">Address</p>
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                <CountUp count={data ? data[0].total : 0} />
              </p>
            </div>

            {/* Inbox Emails */}
            <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div className="flex items-center gap-1">
                <Icons.inbox className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  Inbox Emails
                </p>
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                <CountUp count={totalInboxEmails} />
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div className="flex items-center gap-1">
                <Icons.mailOpen className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  Unread Emails
                </p>
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                <CountUp count={totalUnreadEmails} />
              </p>
            </div>

            {/* Sent Emails */}
            <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-200 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div className="flex items-center gap-1">
                <Icons.send className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  Sent Emails
                </p>
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {/* <CountUp count={0} /> */}--
              </p>
            </div>
          </div>
        )}

        {!isCollapsed && user.role === "ADMIN" && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            Admin Mode:{" "}
            <Switch
              defaultChecked={isAdminModel}
              onCheckedChange={(v) => setAdminModel(v)}
            />
          </div>
        )}
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-scroll">
        {isLoading && (
          <div className="flex flex-col gap-1 px-1 pt-1">
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
            <Skeleton className="h-[60px] w-full rounded-lg" />
          </div>
        )}
        {error && (
          <div className="flex flex-col gap-1 p-1">
            <Skeleton className="h-[50px] w-full rounded-lg" />
            <Skeleton className="h-[50px] w-full rounded-lg" />
            <Skeleton className="h-[50px] w-full rounded-lg" />
          </div>
        )}
        {!error && userEmails && userEmails.length === 0 && (
          <>
            {!isCollapsed ? (
              <div className="flex h-full items-center justify-center">
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="mailPlus" />
                  <EmptyPlaceholder.Title>No emails</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any email yet. Start creating email.
                  </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
              </div>
            ) : (
              <div className="flex flex-col gap-1 px-1 pt-1">
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
                <Skeleton className="h-[55px] w-full rounded-lg" />
              </div>
            )}
          </>
        )}

        {userEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email.emailAddress)}
            className={cn(
              `border-gray-5 m-1 cursor-pointer bg-neutral-50 p-2 transition-colors hover:bg-neutral-100 dark:border-zinc-700 dark:hover:bg-neutral-800`,
              selectedEmailAddress === email.emailAddress
                ? "bg-gray-100 dark:bg-neutral-800"
                : "",
              isCollapsed ? "flex items-center justify-center" : "",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between gap-1 text-sm font-bold text-neutral-500 dark:text-zinc-400",
                isCollapsed
                  ? "size-10 justify-center rounded-xl bg-neutral-400 text-center text-white dark:text-neutral-100"
                  : "",
                selectedEmailAddress === email.emailAddress && isCollapsed
                  ? "bg-neutral-600"
                  : "",
              )}
            >
              <span className="w-2/3 truncate" title={email.emailAddress}>
                {isCollapsed
                  ? email.emailAddress.slice(0, 1).toLocaleUpperCase()
                  : email.emailAddress}
              </span>
              {!isCollapsed && (
                <>
                  <CopyButton
                    value={`${email.emailAddress}`}
                    className={cn(
                      "ml-auto size-5 rounded border p-1",
                      "duration-250 transition-all group-hover:opacity-100",
                    )}
                    title="Copy email address"
                  />
                  <PenLine
                    className="size-5 rounded border p-1 text-primary"
                    onClick={() => handleOpenEditEmail(email)}
                  />
                  <Icons.trash
                    className="size-5 rounded border p-1 text-primary"
                    onClick={() => {
                      setEmailToDelete(email.id);
                      setShowDeleteModal(true);
                    }}
                  />
                </>
              )}
            </div>
            {!isCollapsed && (
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  {email.unreadCount > 0 && (
                    <Badge variant="default">{email.unreadCount}</Badge>
                  )}
                  {email.count} recived
                </div>
                <span>
                  {isAdminModel
                    ? `Created by ${email.user || email.email.slice(0, 5)} at`
                    : ""}{" "}
                  {timeAgo(email.createdAt)}
                </span>
              </div>
            )}
          </div>
        ))}
        {hasMore && !isLoading && (
          <Button
            className="mx-auto w-full text-xs"
            variant="secondary"
            onClick={handleLoadMore}
          >
            Load more {data[0].total - userEmails.length}+
          </Button>
        )}
      </div>

      {/* 创建\编辑邮箱的 Modal */}
      {showEmailModal && (
        <Modal showModal={showEmailModal} setShowModal={setShowEmailModal}>
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {isEdit ? "Edit" : "Create new"} email
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const emailAddress = (e.target as any).emailAddress.value;
                handleSubmitEmail(emailAddress);
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="emailAddress"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="flex items-center justify-center">
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="text"
                    placeholder="Enter email suffix"
                    className="w-full rounded-r-none"
                    required
                    defaultValue={
                      isEdit ? selectedEmailAddress?.split("@")[0] || "" : ""
                    }
                  />
                  <Select
                    onValueChange={(value: string) => {
                      setDomainSuffix(value);
                    }}
                    name="suffix"
                    defaultValue={domainSuffix || siteConfig.shortDomains[0]}
                    disabled={isEdit}
                  >
                    <SelectTrigger className="w-1/3 rounded-none border-x-0 shadow-inner">
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {siteConfig.shortDomains.map((v) => (
                        <SelectItem key={v} value={v}>
                          @{v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="rounded-l-none"
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isEdit}
                    onClick={() => {
                      (
                        document.getElementById(
                          "emailAddress",
                        ) as HTMLInputElement
                      ).value = randomName("", ".");
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" disabled={isPending}>
                  {isEdit ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* 删除邮箱的 Modal */}
      {showDeleteModal && (
        <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Delete email</h2>
            <p className="mb-4 text-sm text-neutral-600">
              You are about to delete the following email, once deleted, it
              cannot be recovered. All emails in inbox will be deleted at the
              same time. Are you sure you want to continue?
            </p>
            <p className="mb-4 text-sm text-neutral-600">
              To confirm, please type{" "}
              <strong>
                delete{" "}
                {userEmails.find((e) => e.id === emailToDelete)?.emailAddress}
              </strong>{" "}
              below:
            </p>
            <Input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={`please input`}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteInput("");
                  setEmailToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={
                  isPending ||
                  deleteInput !==
                    `delete ${
                      userEmails.find((e) => e.id === emailToDelete)
                        ?.emailAddress
                    }`
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
