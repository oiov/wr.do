"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { PenLine, RefreshCwIcon } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";

import { siteConfig } from "@/config/site";
import { ShortUrlFormData } from "@/lib/dto/short-urls";
import { cn, fetcher } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusDot from "@/components/dashboard/status-dot";
import { FormType } from "@/components/forms/record-form";
import { UrlForm } from "@/components/forms/url-form";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export interface UrlListProps {
  user: Pick<User, "id" | "name">;
}

function TableColumnSekleton({ className }: { className?: string }) {
  return (
    <TableRow className="grid grid-cols-3 items-center sm:grid-cols-7">
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
      <TableCell className="col-span-1 flex justify-center">
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

export default function UserUrlsList({ user }: UrlListProps) {
  const { isMobile } = useMediaQuery();
  const [isShowForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentEditUrl, setCurrentEditUrl] = useState<ShortUrlFormData | null>(
    null,
  );

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<ShortUrlFormData[]>(
    "/api/url",
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const handleRefresh = () => {
    mutate("/api/url", undefined);
  };

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Short URLs</CardTitle>
            <CardDescription className="text-balance">
              All Short URLs
            </CardDescription>
          </div>
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
              onRefresh={handleRefresh}
            />
          )}
          <Table>
            <TableHeader>
              <TableRow className="grid grid-cols-3 items-center sm:grid-cols-7">
                <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
                  Target
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
                  Url
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  Visible
                </TableHead>
                <TableHead className="col-span-1 hidden items-center justify-center font-bold sm:flex">
                  Status
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
              ) : data && data.length > 0 ? (
                data.map((short) => (
                  <TableRow
                    key={short.id}
                    className="grid animate-fade-in grid-cols-3 items-center animate-in sm:grid-cols-7"
                  >
                    <TableCell className="col-span-1 sm:col-span-2">
                      <Link
                        className="text-slate-600 hover:text-blue-400 hover:underline"
                        href={short.target}
                        target="_blank"
                      >
                        {short.target.startsWith("http")
                          ? short.target.split("//")[1]
                          : short.target}
                        {/* {isMobile ? short.target.split("//")[1] :short.target} */}
                      </Link>
                    </TableCell>
                    <TableCell className="col-span-1 flex items-center gap-1 sm:col-span-2">
                      <Link
                        className="text-slate-600 hover:text-blue-400 hover:underline"
                        href={`/s/${short.url}`}
                        target="_blank"
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
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      {short.visible === 1 ? "Public" : "Private"}
                    </TableCell>
                    <TableCell className="col-span-1 hidden justify-center sm:flex">
                      <StatusDot status={short.active} />
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
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
