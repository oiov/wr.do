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
import useSWR from "swr";

import { siteConfig } from "@/config/site";
import { TeamPlanQuota } from "@/config/team";
import { UserEmailList } from "@/lib/dto/email";
import { reservedAddressSuffix } from "@/lib/enums";
import { cn, fetcher, nFormatter, timeAgo } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import ApiReference from "@/app/emails/api-reference";

import CountUp from "../dashboard/count-up";
import { CopyButton } from "../shared/copy-button";
import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { Icons } from "../shared/icons";
import { PaginationWrapper } from "../shared/pagination";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { SendEmailModal } from "./SendEmailModal";
import SendsEmailList from "./SendsEmailList";

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
  const { isMobile } = useMediaQuery();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [domainSuffix, setDomainSuffix] = useState<string | null>(
    siteConfig.shortDomains[0],
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const [showSendsModal, setShowSendsModal] = useState(false);

  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error, mutate } = useSWR<{
    list: UserEmailList[];
    total: number;
    totalInboxCount: number;
    totalUnreadCount: number;
  }>(
    `/api/email?page=${currentPage}&size=${pageSize}&search=${searchQuery}&all=${isAdminModel}&unread=${onlyUnread}`,
    fetcher,
    { dedupingInterval: 5000 },
  );

  const { data: sendEmails } = useSWR<number>(
    `/api/email/send?all=${isAdminModel}`,
    fetcher,
    {
      dedupingInterval: 5000,
    },
  );

  if (!selectedEmailAddress && data && data.list.length > 0) {
    onSelectEmail(data.list[0].emailAddress);
  }

  const userEmails = data?.list || [];
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handleSubmitEmail = async (emailSuffix: string) => {
    if (!emailSuffix || emailSuffix.length < 5) {
      toast.error("Email address characters must be at least 5");
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
    if (reservedAddressSuffix.includes(emailSuffix)) {
      toast.error("Email address is reserved, please choose another one");
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
            <div className="flex w-full items-center gap-2">
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
              <div className="relative w-full grow">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emails..."
                  className="h-[30px] w-full border p-1 pl-8 text-xs placeholder:text-xs"
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
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
            {/* Address */}
            <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700">
              <div className="flex items-center gap-1">
                <Icons.mail className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  Email Address
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {nFormatter(data ? data.total : 0)}
              </p>
            </div>

            {/* Inbox Emails */}
            <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700">
              <div className="flex items-center gap-1">
                <Icons.inbox className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  Inbox Emails
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {nFormatter(data ? data.totalInboxCount : 0)}
              </p>
            </div>

            <div
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700",
                {
                  "bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700":
                    onlyUnread,
                },
              )}
              onClick={() => {
                setOnlyUnread(!onlyUnread);
              }}
            >
              <div className="flex items-center gap-1">
                <Icons.mailOpen className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  Unread Emails
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {nFormatter(data ? data.totalUnreadCount : 0)}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.listFilter className="absolute bottom-1 right-1 size-3" />
                  </TooltipTrigger>
                  <TooltipContent>Filter unread emails</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Sent Emails */}
            <div
              onClick={() => setShowSendsModal(!showSendsModal)}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700",
                {
                  "bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700":
                    showSendsModal,
                },
              )}
            >
              <div className="flex items-center gap-1">
                <Icons.send className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  Sent Emails
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {nFormatter(sendEmails || 0)}
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
        {!error && !isLoading && userEmails && userEmails.length === 0 && (
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
              `border-gray-5 group m-1 cursor-pointer bg-neutral-50 p-2 transition-colors hover:bg-neutral-100 dark:border-zinc-700 dark:bg-neutral-800 dark:hover:bg-neutral-900`,
              selectedEmailAddress === email.emailAddress
                ? "bg-gray-100 dark:bg-neutral-900"
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
                  <SendEmailModal
                    emailAddress={selectedEmailAddress}
                    onSuccess={mutate}
                    triggerButton={
                      <Icons.send
                        className={cn(
                          "size-5 rounded border p-1 text-primary",
                          !isMobile
                            ? "hidden hover:bg-neutral-200 group-hover:ml-auto group-hover:inline"
                            : "",
                        )}
                      />
                    }
                  />
                  <PenLine
                    className={cn(
                      "size-5 rounded border p-1 text-primary",
                      !isMobile
                        ? "hidden hover:bg-neutral-200 group-hover:inline"
                        : "",
                    )}
                    onClick={() => handleOpenEditEmail(email)}
                  />
                  <Icons.trash
                    className={cn(
                      "size-5 rounded border p-1 text-primary",
                      !isMobile
                        ? "hidden hover:bg-neutral-200 group-hover:inline"
                        : "",
                      email.deletedAt ? "bg-gray-400" : "",
                    )}
                    onClick={() => {
                      if (!email.deletedAt) {
                        setEmailToDelete(email.id);
                        setShowDeleteModal(true);
                      }
                    }}
                  />
                  <CopyButton
                    value={`${email.emailAddress}`}
                    className={cn(
                      "size-5 rounded border p-1",
                      "duration-250 transition-all hover:bg-neutral-200",
                    )}
                    title="Copy email address"
                  />
                </>
              )}
            </div>
            {!isCollapsed && (
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1 text-nowrap">
                  {email.unreadCount > 0 && (
                    <Badge variant="default">{email.unreadCount}</Badge>
                  )}
                  {email.count} recived
                </div>
                <span className="line-clamp-1 hover:line-clamp-none">
                  {isAdminModel
                    ? `Created by ${email.user || email.email.slice(0, 5)} at`
                    : ""}{" "}
                  {timeAgo(email.createdAt)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!isCollapsed && data && totalPages > 1 && (
        <PaginationWrapper
          className="m-0 scale-75"
          total={data.total}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          layout="center"
        />
      )}

      {showSendsModal && (
        <Modal
          className="md:max-w-2xl"
          showModal={showSendsModal}
          setShowModal={setShowSendsModal}
        >
          <SendsEmailList isAdminModel={isAdminModel} />
        </Modal>
      )}

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
                    defaultValue={domainSuffix || siteConfig.emailDomains[0]}
                    disabled={isEdit}
                  >
                    <SelectTrigger className="w-1/3 rounded-none border-x-0 shadow-inner">
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {siteConfig.emailDomains.map((v) => (
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
