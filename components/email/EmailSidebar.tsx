"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR from "swr";

import { UserEmailList } from "@/lib/dto/email";
import { reservedAddressSuffix } from "@/lib/enums";
import { cn, fetcher, nFormatter } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

import { CopyButton } from "../shared/copy-button";
import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { Icons } from "../shared/icons";
import { PaginationWrapper } from "../shared/pagination";
import { TimeAgoIntl } from "../shared/time-ago";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
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
  const t = useTranslations("Email");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [domainSuffix, setDomainSuffix] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [showBulkSelector, setShowBulkSelector] = useState(false);
  const [selectedEmailIds, setSelectedEmailIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isFetchingIds, setIsFetchingIds] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteInput, setBulkDeleteInput] = useState("");

  useEffect(() => {
    if (!isAdminModel) {
      setShowBulkSelector(false);
      setSelectedEmailIds([]);
    }
  }, [isAdminModel]);

  useEffect(() => {
    if (isCollapsed) {
      setShowBulkSelector(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    setSelectedEmailIds([]);
    setBulkDeleteInput("");
  }, [searchQuery, onlyUnread]);

  useEffect(() => {
    if (selectedEmailIds.length === 0) {
      setShowBulkDeleteModal(false);
      setBulkDeleteInput("");
    }
  }, [selectedEmailIds.length]);

  const selectedSet = useMemo(
    () => new Set(selectedEmailIds),
    [selectedEmailIds],
  );

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

  const { data: emailDomains, isLoading: isLoadingDomains } = useSWR<
    { domain_name: string; min_email_length: number }[]
  >("/api/domain?feature=email", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  useEffect(() => {
    if (!domainSuffix && emailDomains && emailDomains.length > 0) {
      setDomainSuffix(emailDomains[0].domain_name);
    }
  }, [domainSuffix, emailDomains]);

  if (!selectedEmailAddress && data && data.list.length > 0) {
    onSelectEmail(data.list[0].emailAddress);
  }

  const userEmails = data?.list || [];
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handleSubmitEmail = async (emailSuffix: string) => {
    const limit_len =
      emailDomains?.find((d) => d.domain_name === domainSuffix)
        ?.min_email_length ?? 1;
    if (!emailSuffix || emailSuffix.length < limit_len) {
      toast.error(`Email address characters must be at least ${limit_len}`);
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
          toast.success(t("Bulk.singleDeleteSuccess"));
        } else {
          toast.error(t("Bulk.singleDeleteError"));
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
      toast.error(t("Bulk.mismatch"));
    }
  };

  const toggleBulkSelector = () => {
    if (showBulkSelector) {
      setSelectedEmailIds([]);
      setBulkDeleteInput("");
    }
    setShowBulkSelector((prev) => !prev);
  };

  const handleToggleEmailSelection = (id: string, checked?: boolean) => {
    const shouldSelect = checked ?? !selectedSet.has(id);
    setSelectedEmailIds((prev) => {
      const next = new Set(prev);
      if (shouldSelect) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return Array.from(next);
    });
  };

  const handleSelectCurrentPage = () => {
    if (!userEmails.length) return;
    setSelectedEmailIds((prev) => {
      const next = new Set(prev);
      userEmails
        .filter((email) => !email.deletedAt)
        .forEach((email) => next.add(email.id));
      return Array.from(next);
    });
  };

  const handleSelectAllFiltered = async () => {
    if (!isAdminModel) return;
    setIsFetchingIds(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        all: String(isAdminModel),
        unread: String(onlyUnread),
      });
      const res = await fetch(`/api/email/ids?${params.toString()}`);
      if (!res.ok) {
        toast.error(t("Bulk.fetchError"));
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.ids)) {
        setSelectedEmailIds(Array.from(new Set(data.ids)));
      }
    } catch (error) {
      toast.error(t("Bulk.fetchError"));
    } finally {
      setIsFetchingIds(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedEmailIds([]);
    setBulkDeleteInput("");
  };

  const handleBulkDelete = async () => {
    if (selectedEmailIds.length === 0) return;
    if (bulkDeleteInput.toLowerCase() !== "delete") {
      toast.error(t("Bulk.modalHint"));
      return;
    }
    setIsBulkDeleting(true);
    try {
      const res = await fetch("/api/email", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedEmailIds }),
      });
      if (res.ok) {
        await mutate();
        setSelectedEmailIds([]);
        setShowBulkDeleteModal(false);
        setBulkDeleteInput("");
        onSelectEmail(null);
        toast.success(t("Bulk.deleteSuccess"));
      } else {
        toast.error(t("Bulk.deleteError"), {
          description: await res.text(),
        });
      }
    } catch (error) {
      toast.error(t("Bulk.deleteError"));
    } finally {
      setIsBulkDeleting(false);
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
                  placeholder={t("Search emails")}
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
          {!isCollapsed && (
            <span className="text-xs">{t("Create New Email")}</span>
          )}
        </Button>

        {isAdminModel && !isCollapsed && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <Button
              variant={showBulkSelector ? "secondary" : "outline"}
              size="sm"
              onClick={toggleBulkSelector}
            >
              {showBulkSelector ? t("Bulk.exit") : t("Bulk.enter")}
            </Button>
            {showBulkSelector && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectCurrentPage}
                >
                  {t("Bulk.selectPage")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllFiltered}
                  disabled={isFetchingIds}
                >
                  {isFetchingIds ? t("Bulk.selecting") : t("Bulk.selectAll")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                  disabled={selectedEmailIds.length === 0}
                >
                  {t("Bulk.clear")}
                </Button>
                <Badge variant="outline">
                  {t("Bulk.selectedCount", { count: selectedEmailIds.length })}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={selectedEmailIds.length === 0}
                  onClick={() => setShowBulkDeleteModal(true)}
                >
                  {t("Bulk.button")}
                </Button>
              </>
            )}
          </div>
        )}

        {!isCollapsed && (
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
            {/* Address */}
            <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700">
              <div className="flex items-center gap-1">
                <Icons.mail className="size-3" />
                <p className="line-clamp-1 text-start font-medium">
                  {t("Email Address")}
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
                  {t("Inbox Emails")}
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
                  {t("Unread Emails")}
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
                  <TooltipContent>{t("Filter unread emails")}</TooltipContent>
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
                  {t("Sent Emails")}
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
            {t("Admin Mode")}:{" "}
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
                <EmptyPlaceholder className="shadow-none">
                  <EmptyPlaceholder.Icon name="mailPlus" />
                  <EmptyPlaceholder.Title>
                    {t("No emails")}
                  </EmptyPlaceholder.Title>
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

        {userEmails.map((email) => {
          const isDisabled = !!email.deletedAt;
          const isSelectedForBulk = selectedSet.has(email.id);
          return (
            <div
              key={email.id}
              onClick={() => {
                if (showBulkSelector && !isDisabled) {
                  handleToggleEmailSelection(email.id);
                } else {
                  onSelectEmail(email.emailAddress);
                }
              }}
              className={cn(
                `border-gray-5 group m-1 cursor-pointer bg-neutral-50 p-2 transition-colors hover:bg-neutral-100 dark:border-zinc-700 dark:bg-neutral-800 dark:hover:bg-neutral-900`,
                selectedEmailAddress === email.emailAddress && !showBulkSelector
                  ? "bg-gray-100 dark:bg-neutral-900"
                  : "",
                showBulkSelector && isSelectedForBulk
                  ? "border border-neutral-300 bg-neutral-100 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                  : "border border-transparent",
                isCollapsed ? "flex items-center justify-center" : "",
              )}
            >
              <div
                className={cn(
                  "flex w-full items-start gap-2",
                  isCollapsed ? "justify-center" : "",
                )}
              >
                {showBulkSelector && !isCollapsed && (
                  <Checkbox
                    className="mt-1"
                    checked={isSelectedForBulk}
                    disabled={isDisabled}
                    onCheckedChange={(value) =>
                      handleToggleEmailSelection(email.id, Boolean(value))
                    }
                    onClick={(event) => event.stopPropagation()}
                  />
                )}
                <div className="flex-1">
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
                    {!isCollapsed && !showBulkSelector && (
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
                          onClick={(event) => {
                            event.stopPropagation();
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
                        {t("{email} recived", { email: email.count })}
                      </div>
                      <span className="line-clamp-1 hover:line-clamp-none">
                        {isAdminModel
                          ? `${email.user || email.email.slice(0, 5)} · `
                          : ""}
                        <TimeAgoIntl date={email.createdAt} />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
              {isEdit ? t("Edit email") : t("Create new email")}
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
                  {t("Email Address")}
                </label>
                <div className="flex items-center justify-center">
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="text"
                    placeholder={t("Enter email prefix")}
                    className="w-full rounded-r-none"
                    required
                    defaultValue={
                      isEdit ? selectedEmailAddress?.split("@")[0] || "" : ""
                    }
                  />
                  {isLoadingDomains ? (
                    <Skeleton className="h-9 w-1/3 rounded-none border-x-0 shadow-inner" />
                  ) : (
                    <Select
                      onValueChange={(value: string) => {
                        setDomainSuffix(value);
                      }}
                      name="suffix"
                      defaultValue={domainSuffix || "wr.do"}
                      disabled={isEdit}
                    >
                      <SelectTrigger className="w-1/3 rounded-none border-x-0 shadow-inner">
                        <SelectValue placeholder="Select a domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailDomains && emailDomains.length > 0 ? (
                          emailDomains.map((v) => (
                            <SelectItem
                              key={v.domain_name}
                              value={v.domain_name}
                            >
                              @{v.domain_name}
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
                  {t("Cancel")}
                </Button>
                <Button type="submit" variant="default" disabled={isPending}>
                  {isEdit ? t("Update") : t("Create")}
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
            <h2 className="mb-4 text-lg font-semibold">{t("Delete email")}</h2>
            <p className="mb-4 text-sm text-neutral-600">
              {t(
                "You are about to delete the following email, once deleted, it cannot be recovered",
              )}
              . {t("All emails in inbox will be deleted at the same time")}.{" "}
              {t("Are you sure you want to continue?")}
            </p>
            <p className="mb-4 text-sm text-neutral-600">
              {t("To confirm, please type")}{" "}
              <strong>
                delete{" "}
                {userEmails.find((e) => e.id === emailToDelete)?.emailAddress}
              </strong>
            </p>
            <Input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={t("Bulk.keyword")}
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
                {t("Cancel")}
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
                {t("Confirm Delete")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showBulkDeleteModal && (
        <Modal
          showModal={showBulkDeleteModal}
          setShowModal={setShowBulkDeleteModal}
        >
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {t("Bulk.modalTitle")}
            </h2>
            <p className="mb-2 text-sm text-neutral-600">
              {t("Bulk.modalDescription", { count: selectedEmailIds.length })}
            </p>
            <p className="mb-4 text-sm text-neutral-600">
              {t("Bulk.modalHint")} <strong>{t("Bulk.keyword")}</strong>
            </p>
            <Input
              value={bulkDeleteInput}
              onChange={(e) => setBulkDeleteInput(e.target.value)}
              placeholder={t("Bulk.keyword")}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBulkDeleteModal(false);
                  setBulkDeleteInput("");
                }}
              >
                {t("Cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={
                  isBulkDeleting ||
                  selectedEmailIds.length === 0 ||
                  bulkDeleteInput.toLowerCase() !== "delete"
                }
              >
                {isBulkDeleting && (
                  <Icons.spinner className="mr-1 size-4 animate-spin" />
                )}
                {t("Bulk.deleteButton", { count: selectedEmailIds.length })}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
