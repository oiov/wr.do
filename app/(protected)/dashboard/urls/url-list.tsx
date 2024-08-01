"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { PenLine, RefreshCwIcon } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";

import { siteConfig } from "@/config/site";
import { EXPIRATION_ENUMS, ShortUrlFormData } from "@/lib/dto/short-urls";
import { cn, expirationTime, fetcher, timeAgo } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import CountUpFn from "@/components/dashboard/count-up";
import StatusDot from "@/components/dashboard/status-dot";
import { FormType } from "@/components/forms/record-form";
import { UrlForm } from "@/components/forms/url-form";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export interface UrlListProps {
  user: Pick<User, "id" | "name">;
  action: string;
}

function TableColumnSekleton() {
  return (
    <TableRow className="grid grid-cols-3 items-center sm:grid-cols-8">
      <TableCell className="col-span-1 sm:col-span-2">
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

export default function UserUrlsList({ user, action }: UrlListProps) {
  const { isMobile } = useMediaQuery();
  const [isShowForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentEditUrl, setCurrentEditUrl] = useState<ShortUrlFormData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<{
    total: number;
    list: ShortUrlFormData[];
  }>(`${action}?page=${currentPage}&size=${pageSize}`, fetcher, {
    revalidateOnFocus: false,
  });

  const handleRefresh = () => {
    mutate(`${action}?page=${currentPage}&size=${pageSize}`, undefined);
  };

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          {action.includes("/admin") ? (
            <CardDescription className="text-balance text-lg font-bold">
              <span>Total URLs:</span>{" "}
              <span className="font-bold">
                {data && <CountUpFn count={data.total ?? 0} />}
              </span>
            </CardDescription>
          ) : (
            <div className="grid gap-2">
              <CardTitle>Short URLs</CardTitle>
              <CardDescription className="text-balance">
                Your Short URLs
              </CardDescription>
            </div>
          )}
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
              className="w-[120px] shrink-0 gap-1"
              variant="default"
              onClick={() => {
                setCurrentEditUrl(null);
                setShowForm(false);
                setFormType("add");
                setShowForm(!isShowForm);
              }}
            >
              Add url
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isShowForm && (
            <UrlForm
              user={{ id: user.id, name: user.name || "" }}
              isShowForm={isShowForm}
              setShowForm={setShowForm}
              type={formType}
              initData={currentEditUrl}
              action={action}
              onRefresh={handleRefresh}
            />
          )}
          <Table>
            <TableHeader className="bg-gray-100/50 dark:bg-primary-foreground">
              <TableRow className="grid grid-cols-3 items-center sm:grid-cols-8">
                <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
                  Url
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
                  Target
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  Status
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  Expiration
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  Update
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
                data.list.map((short) => (
                  <TableRow
                    key={short.id}
                    className="grid animate-fade-in grid-cols-3 items-center animate-in sm:grid-cols-8"
                  >
                    <TableCell className="col-span-1 flex items-center gap-1 sm:col-span-2">
                      <Link
                        className="text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-400"
                        href={`/s/${short.url}`}
                        target="_blank"
                        prefetch={false}
                      >
                        {short.url}
                      </Link>
                      <CopyButton
                        value={`${siteConfig.url}/s/${short.url}`}
                        className={cn(
                          "size-[25px]",
                          "duration-250 transition-all group-hover:opacity-100",
                        )}
                      />
                    </TableCell>
                    <TableCell className="col-span-1 sm:col-span-2">
                      <Link
                        className="text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-400"
                        href={short.target}
                        target="_blank"
                        prefetch={false}
                      >
                        {short.target.startsWith("http")
                          ? short.target.split("//")[1]
                          : short.target}
                      </Link>
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      <StatusDot status={short.active} />
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      {expirationTime(short.expiration, short.updatedAt)}
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      {timeAgo(short.updatedAt as Date)}
                    </TableCell>
                    <TableCell className="col-span-1 flex justify-center">
                      <Button
                        className="text-sm hover:bg-slate-100"
                        size="sm"
                        variant={"outline"}
                        onClick={() => {
                          setCurrentEditUrl(short);
                          setShowForm(false);
                          setFormType("edit");
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
                  {/* <EmptyPlaceholder.Icon name="link" /> */}
                  <EmptyPlaceholder.Title>No urls</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any url yet. Start creating url.
                  </EmptyPlaceholder.Description>
                  <Button
                    className="w-[120px] shrink-0 gap-1"
                    variant="default"
                    onClick={() => {
                      setCurrentEditUrl(null);
                      setShowForm(false);
                      setFormType("add");
                      setShowForm(!isShowForm);
                    }}
                  >
                    Add url
                  </Button>
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
