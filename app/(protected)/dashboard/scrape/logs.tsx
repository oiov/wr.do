"use client";

import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";

import { nFormatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationWrapper } from "@/components/shared/pagination";

export interface LogsTableData {
  id: string;
  type: string;
  ip: string;
  link: string;
  createdAt: Date;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getLogsUrl = (
  userId: string,
  page: number,
  filters: { type: string; ip: string; name: string; email: string },
  target: string,
) => {
  const params = new URLSearchParams({
    userId,
    page: page.toString(),
    ...(filters.type && { type: filters.type }),
    ...(filters.ip && { ip: filters.ip }),
    ...(filters.name && { name: filters.name }),
    ...(filters.email && { email: filters.email }),
  });
  return `${target}?${params}`;
};

const LogsTable = ({ userId, target }) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    ip: "",
    name: "",
    email: "",
  });
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR(
    getLogsUrl(userId, page, filters, target),
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: true,
    },
  );

  const logs = data?.logs || [];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
    handleRefresh();
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load logs. Please try again later.
      </div>
    );
  }

  const handleRefresh = () => {
    mutate(getLogsUrl(userId, page, filters, target));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Filter by type..."
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="h-8 max-w-xs placeholder:text-xs"
          />
          <Input
            placeholder="Filter by IP..."
            value={filters.ip}
            onChange={(e) => handleFilterChange("ip", e.target.value)}
            className="h-8 max-w-xs placeholder:text-xs"
          />
          {
            <>
              <Input
                placeholder="Filter by Name..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="h-8 max-w-xs placeholder:text-xs"
              />
              <Input
                placeholder="Filter by Email..."
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                className="h-8 max-w-xs placeholder:text-xs"
              />
            </>
          }

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            size={"sm"}
            className="ml-2 h-8 px-2 py-0"
          >
            {isLoading ? (
              <RefreshCwIcon className={`size-4 animate-spin`} />
            ) : (
              <RefreshCwIcon className={`size-4`} />
            )}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="">
                <TableHead className="hidden items-center justify-start px-2 sm:flex">
                  Date
                </TableHead>
                <TableHead className="px-2">Type</TableHead>
                <TableHead className="hidden items-center justify-start px-2 sm:flex">
                  IP
                </TableHead>
                <TableHead className="px-2">Link</TableHead>
                <TableHead className="px-2">User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && logs.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:inline-block">
                        <Skeleton className="h-2 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-2 w-[80px]" />
                      </TableCell>
                      <TableCell className="hidden sm:inline-block">
                        <Skeleton className="h-2 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-2 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-2 w-[200px]" />
                      </TableCell>
                    </TableRow>
                  ))
                : logs.map((log) => (
                    <TableRow className="text-xs hover:bg-muted" key={log.id}>
                      <TableCell className="hidden truncate p-2 sm:inline-block">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="p-2">{log.type}</TableCell>
                      <TableCell className="hidden p-2 sm:inline-block">
                        {log.ip}
                      </TableCell>
                      <TableCell className="max-w-md truncate p-2">
                        {log.link}
                      </TableCell>
                      <TableCell className="max-w-md truncate p-2">
                        {log.user?.name || log.user?.email}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="ml-auto text-nowrap text-sm">
            {nFormatter(data?.total || 0)} logs
          </p>
          {data && Math.ceil(data.total / 20) > 1 && (
            <PaginationWrapper
              total={Math.ceil(data.total / 20)}
              currentPage={page}
              setCurrentPage={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LogsTable;
