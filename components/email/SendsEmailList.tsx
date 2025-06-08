"use client";

import { useCallback, useState } from "react";
import { UserSendEmail } from "@prisma/client";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { fetcher, formatDate, htmlToText } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { PaginationWrapper } from "../shared/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export default function SendsEmailList({
  isAdminModel,
}: {
  isAdminModel: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations("Email");

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
    <Card className="mx-auto w-full max-w-4xl border-none">
      <CardHeader>
        <CardTitle>{t("Sent Emails")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between gap-4">
          <Input
            placeholder={t("Search by send to email")}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-neutral-50"
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
          <div className="scrollbar-hidden max-h-[50vh] overflow-y-auto">
            <div className="space-y-1.5">
              {data.list.map((email) => (
                <Collapsible
                  className="w-full rounded-lg border bg-white transition-all duration-200 hover:bg-gray-50"
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
                    <div className="animate-fade-in break-all border-t border-dashed p-2 text-sm text-neutral-500">
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
      </CardContent>
    </Card>
  );
}
