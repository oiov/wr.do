"use client";

import { useCallback, useState } from "react";
import { User, UserSendEmail } from "@prisma/client";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { cn, fetcher, formatDate, htmlToText, nFormatter } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { Icons } from "../shared/icons";
import { PaginationWrapper } from "../shared/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Switch } from "../ui/switch";

export default function SendsEmailList({ user }: { user: User }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isAdminModel, setAdminModel] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations("Email");

  const { data: sendEmails } = useSWR<number>(
    `/api/email/send?all=${isAdminModel}`,
    fetcher,
    {
      dedupingInterval: 5000,
    },
  );

  const { data, isLoading, error } = useSWR<{
    list: UserSendEmail[];
    total: number;
  }>(
    `/api/email/send/list?page=${currentPage}&size=${pageSize}&search=${encodeURIComponent(searchQuery)}&all=${isAdminModel}`,
    fetcher,
    { dedupingInterval: 5000 },
  );

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  const debouncedSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="h-[calc(100vh-60px)] w-full overflow-auto p-4 xl:p-8">
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
        <div className="flex flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700">
          <div className="flex items-center gap-1">
            <Icons.send className="size-3" />
            <p className="line-clamp-1 text-start font-medium">
              {t("Sent Emails")}
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {nFormatter(sendEmails ?? 0)}
          </p>
        </div>

        {/* Admin Mode */}
        {user.role === "ADMIN" && (
          <div
            onClick={() => setAdminModel(!isAdminModel)}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1 rounded-md bg-neutral-100 px-1 pb-1 pt-2 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700",
              {
                "bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-gray-700":
                  isAdminModel,
              },
            )}
          >
            <div className="flex items-center gap-1">
              <Icons.lock className="size-3" />
              <p className="line-clamp-1 text-start font-medium">
                {t("Admin Mode")}
              </p>
            </div>
            <Switch
              className="scale-90"
              checked={isAdminModel}
              onCheckedChange={(v) => setAdminModel(v)}
            />
          </div>
        )}
      </div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Input
          placeholder={t("Search by send to email")}
          value={searchQuery}
          onChange={handleSearch}
          className="w-full bg-neutral-50"
        />
        <Input
          placeholder={t("Search by from email")}
          value={searchQuery}
          onChange={handleSearch}
          className="w-full bg-neutral-50"
          disabled
        />
      </div>
      {isLoading ? (
        <div className="space-y-1.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          {t("Failed to load emails")}. {t("Please try again")}.
        </div>
      ) : !data || data.list.length === 0 ? (
        <div className="text-center text-muted-foreground">
          {t("No emails found")}.
        </div>
      ) : (
        <div className="scrollbar-hidden overflow-y-auto">
          <div className="space-y-1.5">
            {data.list.map((email) => (
              <Collapsible
                className="w-full rounded-lg border bg-primary-foreground transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-500"
                key={email.id}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="grids flex items-center justify-between rounded-t-lg bg-neutral-300/70 px-2 py-1.5">
                    <span className="truncate text-xs font-semibold text-neutral-600 dark:text-neutral-200">
                      {email.from}
                    </span>
                    <span className="text-xs text-neutral-800 dark:text-neutral-300">
                      {formatDate(email.createdAt as any)}
                    </span>
                  </div>
                  <div className="grid w-full grid-cols-1 gap-3 p-2 sm:grid-cols-2">
                    <div className="text-start">
                      <div className="truncate text-xs font-semibold text-neutral-600 dark:text-neutral-200">
                        <strong>Send To:</strong> {email.to}
                      </div>
                      <p className="line-clamp-1 truncate text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        <strong>Subject:</strong>{" "}
                        {email.subject || "No subject"}
                      </p>
                    </div>
                    <p className="line-clamp-2 break-all text-start text-xs text-neutral-500">
                      {htmlToText(email.html || "")}
                    </p>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="animate-fade-in break-all border-t border-dashed p-2 text-sm text-neutral-500 dark:text-neutral-100">
                    {htmlToText(email.html || "")}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
          {data && totalPages > 1 && (
            <PaginationWrapper
              className="m-0 mt-6"
              total={data.total}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              layout="split"
            />
          )}
        </div>
      )}
    </div>
  );
}
