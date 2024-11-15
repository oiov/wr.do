"use client";

import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";

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
import { Icons } from "@/components/shared/icons";
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
  filters: { type: string; ip: string },
) => {
  const params = new URLSearchParams({
    userId,
    page: page.toString(),
    ...(filters.type && { type: filters.type }),
    ...(filters.ip && { ip: filters.ip }),
  });
  return `/api/scraping/logs?${params}`;
};

const LogsTable = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    ip: "",
  });
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR(
    getLogsUrl(userId, page, filters),
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
    mutate(getLogsUrl(userId, page, filters));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by type..."
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="max-w-xs"
          />
          {/* <Input
            placeholder="Filter by IP..."
            value={filters.ip}
            onChange={(e) => handleFilterChange("ip", e.target.value)}
            className="max-w-xs"
          /> */}
          <p className="ml-auto text-sm">{data?.total || 0} logs</p>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="ml-2"
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
                <TableHead className="">Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="">IP</TableHead>
                <TableHead>Link</TableHead>
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
                    </TableRow>
                  ))
                : logs.map((log) => (
                    <TableRow className="text-xs hover:bg-muted" key={log.id}>
                      <TableCell className="hidden p-2 sm:inline-block">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="p-2">{log.type}</TableCell>
                      <TableCell className="hidden p-2 sm:inline-block">
                        {log.ip}
                      </TableCell>
                      <TableCell className="max-w-md truncate p-2">
                        {log.link}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {data && Math.ceil(data.total / 20) > 1 && (
          <PaginationWrapper
            total={Math.ceil(data.total / 20)}
            currentPage={page}
            setCurrentPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default LogsTable;
