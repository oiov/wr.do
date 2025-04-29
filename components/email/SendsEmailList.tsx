"use client";

import { useCallback, useState } from "react";
import { UserSendEmail } from "@prisma/client";
import useSWR from "swr";

import { cn, fetcher, formatDate, htmlToText } from "@/lib/utils";
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
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Sent Emails</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between gap-4">
          <Input
            placeholder="Search by send to email..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
        {isLoading ? (
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load emails. Please try again.
          </div>
        ) : !data || data.list.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No emails found.
          </div>
        ) : (
          <div className="scrollbar-hidden max-h-[50vh] overflow-y-auto">
            <div className="space-y-1">
              {data.list.map((email) => (
                <Collapsible
                  className="w-full rounded-lg border bg-white p-2 transition-all duration-200 hover:bg-gray-50"
                  key={email.id}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="text-start">
                        <div className="truncate text-xs font-semibold text-neutral-600 dark:text-neutral-200">
                          <strong>From:</strong> {email.from}
                        </div>
                        <div className="truncate text-xs font-semibold text-neutral-600 dark:text-neutral-200">
                          <strong>To:</strong> {email.to}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          <strong>Date:</strong>{" "}
                          {formatDate(email.createdAt as any)}
                        </div>
                      </div>
                      <div className="text-start">
                        <p className="line-clamp-1 truncate text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                          {email.subject || "No subject"}
                        </p>
                        <p className="line-clamp-2 break-all text-xs text-neutral-500">
                          {htmlToText(email.html || "")}
                        </p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 animate-fade-in break-all text-sm text-neutral-500">
                      {htmlToText(email.html || "")}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
            {data && totalPages > 1 && (
              <PaginationWrapper
                className="m-0 mt-6 scale-75 justify-center"
                total={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
