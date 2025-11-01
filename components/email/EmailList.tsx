"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ForwardEmail } from "@prisma/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR from "swr";

import { cn, fetcher, htmlToText } from "@/lib/utils";

import BlurImage from "../shared/blur-image";
import { Icons } from "../shared/icons";
import { PaginationWrapper } from "../shared/pagination";
import { TimeAgoIntl } from "../shared/time-ago";
// import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import EmailDetail from "./EmailDetail";
import Loader from "./Loader";
import { SendEmailModal } from "./SendEmailModal";

interface EmailListProps {
  emailAddress: string | null;
  selectedEmailId: string | null;
  onSelectEmail: (emailId: string | null) => void;
  className?: string;
  isAdminModel: boolean;
}

export default function EmailList({
  emailAddress,
  selectedEmailId,
  onSelectEmail,
  className,
  isAdminModel,
}: EmailListProps) {
  const t = useTranslations("Email");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showMutiCheckBox, setShowMutiCheckBox] = useState(false);

  const [isDeleting, startDeleteTransition] = useTransition();

  const { data, error, isLoading, mutate } = useSWR<{
    total: number;
    list: ForwardEmail[];
  }>(
    emailAddress
      ? `/api/email/inbox?emailAddress=${emailAddress}&page=${currentPage}&size=${pageSize}`
      : null,
    fetcher,
    {
      refreshInterval: isAutoRefresh ? 5000 : 0,
      dedupingInterval: 2000,
    },
  );

  useEffect(() => {
    if (emailAddress && selectedEmailId) {
      const emailExists = data?.list.some(
        (email) => email.id === selectedEmailId,
      );
      if (!emailExists) {
        onSelectEmail(null);
      }
    }
  }, [emailAddress, data, selectedEmailId]);

  const handleMarkAsRead = async (emailId: string) => {
    await fetch("/api/email/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailId }),
    }).then(() => mutate());
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one email");
      return;
    }

    try {
      const response = await fetch("/api/email/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailIds: selectedEmails }),
      });

      if (response.ok) {
        setSelectedEmails([]);
        mutate();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to mark emails as read");
      }
    } catch (error) {
      toast.error("Error marking emails as read");
    }
  };

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId],
    );
  };

  const handleSelectAllEmails = () => {
    setSelectedEmails(data?.list.map((email) => email.id) || []);
  };

  const handleSetAutoRefresh = (value: boolean) => {
    setIsAutoRefresh(value);
  };

  const handleManualRefresh = async () => {
    if (!isAutoRefresh) {
      setIsRefreshing(true);
      await mutate();
      setIsRefreshing(false);
    }
  };

  const handleEmailSelection = (emailId: string | null) => {
    if (emailId) {
      const selectedEmail = data?.list?.find((email) => email.id === emailId);
      if (selectedEmail && !selectedEmail.readAt) {
        handleMarkAsRead(emailId);
      }
    }
    onSelectEmail(emailId);
  };

  const handleDeletEmails = async (ids: string[]) => {
    startDeleteTransition(async () => {
      await fetch("/api/email/inbox", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      }).then((v) => {
        v.status === 200 && mutate();
      });
    });
  };

  if (!emailAddress) {
    return <EmptyInboxSection />;
  }

  return (
    <div className={cn("grids flex flex-1 flex-col", className)}>
      <div className="flex items-center gap-2 bg-neutral-200/40 p-2 text-base font-semibold text-neutral-600 backdrop-blur dark:bg-neutral-800 dark:text-neutral-50">
        <Icons.inbox size={20} />
        <span>{t("INBOX")}</span>
        <div className="ml-auto flex items-center justify-center gap-2">
          <SendEmailModal emailAddress={emailAddress} onSuccess={mutate} />
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger>
                <Switch
                  className="mt-1 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-200"
                  onCheckedChange={handleSetAutoRefresh}
                  defaultChecked={isAutoRefresh}
                  aria-label="Auto refresh"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">{t("Auto refresh")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading || isAutoRefresh}
          >
            <Icons.refreshCw
              size={15}
              className={cn(
                isRefreshing || isLoading || isAutoRefresh
                  ? "animate-spin"
                  : "",
              )}
            />
          </Button>
          <Button
            className={cn(
              showMutiCheckBox ? "bg-primary text-primary-foreground" : "",
            )}
            variant="outline"
            size="sm"
            onClick={() => setShowMutiCheckBox(!showMutiCheckBox)}
          >
            <Icons.listChecks className="size-4" />
          </Button>
          {showMutiCheckBox && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex w-full items-center gap-1"
                >
                  <span className="text-sm">{t("more")}</span>
                  <Icons.chevronDown className="mt-0.5 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllEmails}
                    className="w-full"
                  >
                    <span className="text-xs">{t("Select all")}</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  disabled={selectedEmails.length === 0}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkSelectedAsRead}
                    className="w-full"
                  >
                    <span className="text-xs">{t("Mask as read")}</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  disabled={isDeleting || selectedEmails.length === 0}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDeletEmails(selectedEmails)}
                  >
                    {isDeleting && (
                      <Icons.spinner className="mr-1 size-4 animate-spin" />
                    )}
                    <span className="text-xs">{t("Delete selected")}</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="flex flex-col gap-2 p-1">
          {[...Array(9)].map((_, index) => (
            <Skeleton key={index} className="h-[80px] w-full rounded-lg" />
          ))}
        </div>
      )}
      {!isLoading && !error && (
        <div className="scrollbar-hidden relative h-[calc(100vh-105px)] animate-fade-in overflow-scroll">
          {selectedEmailId ? (
            <EmailDetail
              email={data?.list?.find((email) => email.id === selectedEmailId)}
              selectedEmailId={selectedEmailId}
              onClose={() => onSelectEmail(null)}
              onMarkAsRead={() => handleMarkAsRead(selectedEmailId)}
            />
          ) : (
            <>
              {data && data.total > 0 ? (
                data.list.map((email) => (
                  <div
                    key={email.id}
                    className="border-b border-dotted bg-neutral-100/50 px-3 py-2 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900 hover:dark:bg-neutral-700"
                  >
                    <div className="flex items-center justify-between">
                      {showMutiCheckBox && (
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedEmails.includes(email.id)}
                            onCheckedChange={() => handleSelectEmail(email.id)}
                            className="mr-3 size-4 border-neutral-300 bg-neutral-100 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:data-[state=checked]:border-neutral-300 dark:data-[state=checked]:bg-neutral-300"
                          />
                        </div>
                      )}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleEmailSelection(email.id)}
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="w-3/4 truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            {email.fromName || email.subject || "Untitled"}
                          </span>
                          <span className="ml-auto text-xs text-neutral-600 dark:text-neutral-400">
                            <TimeAgoIntl
                              date={(email.date as any) || email.createdAt}
                            />
                          </span>
                          {email.readAt && (
                            <Icons.checkCheck className="ml-2 size-3 text-green-600" />
                          )}
                        </div>
                        <div className="mb-0.5 line-clamp-1 w-3/4 truncate text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          {email.subject}
                        </div>
                        <div className="line-clamp-2 break-all text-xs text-neutral-500">
                          {email.html
                            ? htmlToText(email.html)
                            : email.text || "No content"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-[calc(100vh-135px)] flex-col items-center justify-center gap-8">
                  <Loader />
                  <p className="font-mono font-semibold text-neutral-500">
                    {t("Waiting for emails")}...
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {data && Math.ceil(data.total / pageSize) > 1 && (
        <PaginationWrapper
          className="mx-2 my-1"
          total={data.total}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
}

export function EmptyInboxSection() {
  const t = useTranslations("Email");
  return (
    <div className="grids flex flex-1 animate-fade-in flex-col items-center justify-center p-4 text-center text-neutral-600 dark:text-neutral-400">
      <BlurImage
        className="size-40"
        src="/_static/landing/mailbox.svg"
        height={200}
        width={200}
        alt="Inbox"
      />
      <h2 className="my-2 text-lg font-semibold">
        {t("No Email Address Selected")}
      </h2>
      <p className="max-w-md text-sm">
        {t("Please select an email address from the list to view your inbox")}.
        {t("Once selected, your emails will appear here automatically")}.
      </p>
      <ul className="mt-3 list-disc text-left">
        <li>
          <Link
            className="text-blue-500 underline"
            href="/docs/emails#how-it-works"
            target="_blank"
            rel="noreferrer"
          >
            {t("How to use email to send or receive emails?")}
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-500 underline"
            href="/docs/emails#expiration"
            target="_blank"
            rel="noreferrer"
          >
            {t("Will my email or inbox expire?")}
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-500 underline"
            href="/docs/emails#limit"
            target="_blank"
            rel="noreferrer"
          >
            {t("What is the limit? It's free?")}
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-500 underline"
            href="/docs/emails#api-reference"
            target="_blank"
            rel="noreferrer"
          >
            {t("How to create emails with api?")}
          </Link>
        </li>
      </ul>
      <div className="mt-6 flex gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-300 delay-100 dark:bg-neutral-600" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-300 delay-200 dark:bg-neutral-600" />
      </div>
    </div>
  );
}
