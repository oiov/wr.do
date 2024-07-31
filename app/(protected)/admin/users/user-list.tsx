"use client";

import { useState } from "react";
import Link from "next/link";
import { Pagination } from "@nextui-org/pagination";
import { User } from "@prisma/client";
import { ArrowLeft, ArrowRight, PenLine, RefreshCwIcon } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";

import { siteConfig } from "@/config/site";
import { fetcher, timeAgo } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaginationWrapper } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StatusDot from "@/components/dashboard/status-dot";
import { FormType } from "@/components/forms/record-form";
import { UserForm } from "@/components/forms/user-form";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import CountUpFn from "../../../../components/dashboard/count-up";

export interface UrlListProps {
  user: Pick<User, "id" | "name">;
}

function TableColumnSekleton({ className }: { className?: string }) {
  return (
    <TableRow className="grid grid-cols-3 items-center sm:grid-cols-7">
      <TableCell className="col-span-1">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="col-span-1 sm:col-span-2">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="col-span-1 hidden justify-center sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 hidden justify-center sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 hidden justify-center sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex justify-center">
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

export default function UsersList({ user }: UrlListProps) {
  const { isMobile } = useMediaQuery();
  const [isShowForm, setShowForm] = useState(false);
  const [currentEditUser, setcurrentEditUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<{ total: number; list: User[] }>(
    `/api/user/admin?page=${currentPage}&size=${pageSize}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const handleRefresh = () => {
    mutate(`/api/user/admin?page=${currentPage}&size=${pageSize}`, undefined);
  };

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <CardDescription className="text-balance text-lg font-bold">
            <span>Total Users:</span>{" "}
            <span className="font-bold">
              {data && <CountUpFn count={data.total} />}
            </span>
          </CardDescription>
          <div className="ml-auto flex items-center justify-end gap-3">
            <Button
              variant={"outline"}
              onClick={() => handleRefresh()}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCwIcon className="size-4 animate-spin" />
              ) : (
                <RefreshCwIcon className="size-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isShowForm && (
            <UserForm
              user={{ id: user.id, name: user.name || "" }}
              isShowForm={isShowForm}
              setShowForm={setShowForm}
              type="edit"
              initData={currentEditUser}
              onRefresh={handleRefresh}
            />
          )}
          <Table>
            <TableHeader className="bg-gray-100/50 dark:bg-primary-foreground">
              <TableRow className="grid grid-cols-3 items-center sm:grid-cols-7">
                <TableHead className="col-span-1 flex items-center font-bold">
                  Email
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
                  Name
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  Role
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  Status
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  CreatedAt
                </TableHead>
                <TableHead className="col-span-1 flex items-center justify-center font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <TableColumnSekleton />
                  <TableColumnSekleton />
                  <TableColumnSekleton />
                </>
              ) : data && data.list && data.list.length ? (
                data.list.map((user) => (
                  <TableRow
                    key={user.id}
                    className="grid animate-fade-in grid-cols-3 items-center animate-in sm:grid-cols-7"
                  >
                    <TableCell className="col-span-1">
                      {user.name || "Anonymous"}
                    </TableCell>
                    <TableCell className="col-span-1 flex items-center gap-1 truncate sm:col-span-2">
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger className="truncate">
                            {user.email}
                          </TooltipTrigger>
                          <TooltipContent>{user.email}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      <Badge className="text-xs" variant="outline">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      <StatusDot status={user.active} />
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      {timeAgo(user.createdAt || "")}
                    </TableCell>
                    <TableCell className="col-span-1 flex justify-center">
                      <Button
                        className="text-sm hover:bg-slate-100"
                        size="sm"
                        variant={"outline"}
                        onClick={() => {
                          setcurrentEditUser(user);
                          setShowForm(false);
                          setShowForm(!isShowForm);
                        }}
                      >
                        <p>Edit</p>
                        <PenLine className="ml-1 size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="user" />
                  <EmptyPlaceholder.Title>No users</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    Here don&apos;t have any user yet.
                  </EmptyPlaceholder.Description>
                  {/* <Button
                    className="w-[120px] shrink-0 gap-1"
                    variant="default"
                    onClick={() => {
                      setcurrentEditUser(null);
                      setShowForm(false);
                      setShowForm(!isShowForm);
                    }}
                  >
                    Add user
                  </Button> */}
                </EmptyPlaceholder>
              )}
            </TableBody>
            {data && Math.ceil(data.total / pageSize) > 1 && (
              <PaginationWrapper
                total={Math.ceil(data.total / pageSize)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
