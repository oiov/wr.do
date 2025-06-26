"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { PenLine, RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import useSWR, { useSWRConfig } from "swr";

import { fetcher } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
import { FormType, UserForm } from "@/components/forms/user-form";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";
import { PaginationWrapper } from "@/components/shared/pagination";
import { TimeAgoIntl } from "@/components/shared/time-ago";

export interface UrlListProps {
  user: Pick<User, "id" | "name">;
}

function TableColumnSekleton({ className }: { className?: string }) {
  return (
    <TableRow className="grid grid-cols-3 items-center sm:grid-cols-8">
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
  const [formType, setFormType] = useState<FormType>("add");
  const [isShowForm, setShowForm] = useState(false);
  const [currentEditUser, setcurrentEditUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    email: "",
    userName: "",
  });

  const t = useTranslations("List");

  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR<{ total: number; list: User[] }>(
    `/api/user/admin?page=${currentPage}&size=${pageSize}&email=${searchParams.email}&userName=${searchParams.userName}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const handleRefresh = () => {
    mutate(
      `/api/user/admin?page=${currentPage}&size=${pageSize}&email=${searchParams.email}&userName=${searchParams.userName}`,
      undefined,
    );
  };

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <CardDescription className="text-balance text-lg font-bold">
            <span>{t("Total Users")}:</span>{" "}
            <span className="font-bold">{data && data.total}</span>
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
            <Button
              className="flex shrink-0 gap-1"
              variant="default"
              onClick={() => {
                setcurrentEditUser(null);
                setShowForm(false);
                setFormType("add");
                setShowForm(!isShowForm);
              }}
            >
              <Icons.add className="size-4" />
              <span className="hidden sm:inline">{t("Add User")}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex-row items-center gap-2 space-y-2 sm:flex sm:space-y-0">
            <div className="relative w-full">
              <Input
                className="h-8 text-xs md:text-xs"
                placeholder="Search by email..."
                value={searchParams.email}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    email: e.target.value,
                  });
                }}
              />
              {searchParams.email && (
                <Button
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 rounded-full px-1 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setSearchParams({ ...searchParams, email: "" })
                  }
                  variant={"ghost"}
                >
                  <Icons.close className="size-3" />
                </Button>
              )}
            </div>

            <div className="relative w-full">
              <Input
                className="h-8 text-xs md:text-xs"
                placeholder="Search by user name..."
                value={searchParams.userName}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    userName: e.target.value,
                  });
                }}
              />
              {searchParams.userName && (
                <Button
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 rounded-full px-1 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setSearchParams({ ...searchParams, userName: "" })
                  }
                  variant={"ghost"}
                >
                  <Icons.close className="size-3" />
                </Button>
              )}
            </div>
          </div>
          <Table>
            <TableHeader className="bg-gray-100/50 dark:bg-primary-foreground">
              <TableRow className="grid grid-cols-3 items-center sm:grid-cols-8">
                <TableHead className="col-span-1 flex items-center font-bold">
                  {t("Name")}
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
                  {t("Email")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  {t("Role")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  {t("Plan")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  {t("Status")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  {t("Join")}
                </TableHead>
                <TableHead className="col-span-1 flex items-center justify-center font-bold">
                  {t("Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <TableColumnSekleton />
                  <TableColumnSekleton />
                  <TableColumnSekleton />
                  <TableColumnSekleton />
                  <TableColumnSekleton />
                </>
              ) : data && data.list && data.list.length ? (
                data.list.map((user) => (
                  <TableRow
                    key={user.id}
                    className="grid animate-fade-in grid-cols-3 items-center animate-in sm:grid-cols-8"
                  >
                    <TableCell className="col-span-1 truncate">
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger className="truncate">
                            {user.name || "Anonymous"}
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.name || "Anonymous"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                        {t(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      <Badge className="text-xs" variant="outline">
                        {user.team}
                      </Badge>
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      <Switch defaultChecked={user.active === 1} />
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      <TimeAgoIntl date={user.updatedAt as Date} />
                    </TableCell>
                    <TableCell className="col-span-1 flex justify-center">
                      <Button
                        className="text-sm hover:bg-slate-100"
                        size="sm"
                        variant={"outline"}
                        onClick={() => {
                          setcurrentEditUser(user);
                          setShowForm(false);
                          setFormType("edit");
                          setShowForm(!isShowForm);
                        }}
                      >
                        <p className="text-nowrap">{t("Edit")}</p>
                        <PenLine className="ml-1 size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyPlaceholder className="shadow-none">
                  <EmptyPlaceholder.Icon name="users" />
                  <EmptyPlaceholder.Title>No users</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    Here don&apos;t have any user yet.
                  </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
              )}
            </TableBody>
            {data && Math.ceil(data.total / pageSize) > 1 && (
              <PaginationWrapper
                layout={isMobile ? "right" : "split"}
                total={data.total}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            )}
          </Table>
        </CardContent>
      </Card>

      <Modal
        className="md:max-w-2xl"
        showModal={isShowForm}
        setShowModal={setShowForm}
      >
        <UserForm
          user={{ id: user.id, name: user.name || "" }}
          isShowForm={isShowForm}
          setShowForm={setShowForm}
          type={formType}
          initData={currentEditUser}
          onRefresh={handleRefresh}
        />
      </Modal>
    </>
  );
}
