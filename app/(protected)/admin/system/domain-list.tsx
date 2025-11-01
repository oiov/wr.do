"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { DomainFormData } from "@/lib/dto/domains";
import { fetcher } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DomainForm } from "@/components/forms/domain-form";
import { FormType } from "@/components/forms/record-form";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";
import { PaginationWrapper } from "@/components/shared/pagination";
import { TimeAgoIntl } from "@/components/shared/time-ago";

export interface DomainListProps {
  user: Pick<User, "id" | "name" | "email" | "apiKey" | "role" | "team">;
  action: string;
}

function TableColumnSekleton() {
  return (
    <TableRow className="grid grid-cols-4 items-center sm:grid-cols-7">
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-32" />
      </TableCell>
    </TableRow>
  );
}

export default function DomainList({ user, action }: DomainListProps) {
  const { isMobile } = useMediaQuery();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("List");
  const [isShowForm, setShowForm] = useState(false);
  const [isShowDuplicateForm, setShowDuplicateForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentEditDomain, setCurrentEditDomain] =
    useState<DomainFormData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchParams, setSearchParams] = useState({
    slug: "",
    target: "",
    userName: "",
  });

  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR<{
    total: number;
    list: DomainFormData[];
  }>(
    `${action}?page=${currentPage}&size=${pageSize}&target=${searchParams.target}`,
    fetcher,
  );

  const handleRefresh = () => {
    mutate(
      `${action}?page=${currentPage}&size=${pageSize}&target=${searchParams.target}`,
      undefined,
    );
  };

  const handleChangeStatus = async (
    checked: boolean,
    target: string,
    domain: DomainFormData,
  ) => {
    const res = await fetch(action, {
      method: "PUT",
      body: JSON.stringify({
        id: domain.id,
        enable_short_link:
          target === "enable_short_link" ? checked : domain.enable_short_link,
        enable_email: target === "enable_email" ? checked : domain.enable_email,
        enable_dns: target === "enable_dns" ? checked : domain.enable_dns,
        active: target === "active" ? checked : domain.active,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        toast.success("Saved");
        handleRefresh();
      }
    } else {
      toast.error("Activation failed!");
    }
  };

  const handleDuplicate = () => {
    startTransition(async () => {
      const response = await fetch(`${action}/duplicate`, {
        method: "POST",
        body: JSON.stringify({
          domain: currentEditDomain?.domain_name,
        }),
      });
      if (!response.ok || response.status !== 200) {
        toast.error("Duplicate Failed!", {
          description: await response.text(),
        });
      } else {
        toast.success(`Duplicate successfully!`);
        setShowDuplicateForm(false);
        handleRefresh();
      }
    });
  };

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="flex items-center gap-1 text-lg font-bold">
            <span className="text-nowrap">{t("Total Domains")}:</span>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span>{data && data.total}</span>
            )}
          </div>

          <div className="ml-auto flex items-center justify-end gap-3">
            <Button
              variant={"outline"}
              onClick={() => handleRefresh()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.refreshCw className="size-4 animate-spin" />
              ) : (
                <Icons.refreshCw className="size-4" />
              )}
            </Button>
            <Button
              className="flex shrink-0 gap-1"
              variant="default"
              onClick={() => {
                setCurrentEditDomain(null);
                setShowForm(false);
                setFormType("add");
                setShowForm(!isShowForm);
              }}
            >
              <Icons.add className="size-4" />
              <span className="hidden sm:inline">{t("Add Domain")}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex-row items-center gap-2 space-y-2 sm:flex sm:space-y-0">
            <div className="relative w-full">
              <Input
                className="h-8 text-xs md:text-xs"
                placeholder={t("Search by domain name") + "..."}
                value={searchParams.target}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    target: e.target.value,
                  });
                }}
              />
              {searchParams.target && (
                <Button
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 rounded-full px-1 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setSearchParams({ ...searchParams, target: "" })
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
              <TableRow className="grid grid-cols-4 items-center text-xs sm:grid-cols-7">
                <TableHead className="col-span-1 flex items-center font-bold">
                  {t("Domain Name")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center text-nowrap font-bold sm:flex">
                  {t("Shorten Service")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center text-nowrap font-bold sm:flex">
                  {t("Email Service")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center text-nowrap font-bold sm:flex">
                  {t("Subdomain Service")}
                </TableHead>
                <TableHead className="col-span-1 flex items-center text-nowrap font-bold">
                  {t("Active")}
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold">
                  {t("Updated")}
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold">
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
                data.list.map((domain) => (
                  <div className="border-b" key={domain.id}>
                    <TableRow className="grid grid-cols-4 items-center sm:grid-cols-7">
                      <TableCell className="col-span-1 flex items-center gap-1">
                        <Link
                          className="overflow-hidden text-ellipsis whitespace-normal text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-400"
                          href={`https://${domain.domain_name}`}
                          target="_blank"
                          prefetch={false}
                          title={domain.domain_name}
                        >
                          {domain.domain_name}
                        </Link>
                      </TableCell>
                      <TableCell className="col-span-1 hidden items-center gap-1 sm:flex">
                        <Switch
                          defaultChecked={domain.enable_short_link}
                          onCheckedChange={(value) =>
                            handleChangeStatus(
                              value,
                              "enable_short_link",
                              domain,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="col-span-1 hidden items-center gap-1 sm:flex">
                        <Switch
                          defaultChecked={domain.enable_email}
                          onCheckedChange={(value) =>
                            handleChangeStatus(value, "enable_email", domain)
                          }
                        />
                        {domain.email_provider === "Resend" &&
                          domain.resend_api_key && (
                            <Icons.resend className="mx-0.5 size-4" />
                          )}
                        {domain.email_provider === "Brevo" &&
                          domain.brevo_api_key && (
                            <Icons.brevo className="mx-0.5 size-4" />
                          )}
                      </TableCell>
                      <TableCell className="col-span-1 hidden items-center gap-1 sm:flex">
                        <Switch
                          defaultChecked={domain.enable_dns}
                          onCheckedChange={(value) =>
                            handleChangeStatus(value, "enable_dns", domain)
                          }
                        />
                        {domain.cf_zone_id &&
                          domain.cf_api_key &&
                          domain.cf_email && (
                            <Icons.cloudflare className="mx-0.5 size-4" />
                          )}
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center gap-1">
                        <Switch
                          disabled
                          defaultChecked={domain.active}
                          onCheckedChange={(value) =>
                            handleChangeStatus(value, "active", domain)
                          }
                        />
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center truncate">
                        <TimeAgoIntl date={domain.updatedAt as Date} />
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="size-[25px] p-1.5"
                              size="sm"
                              variant="ghost"
                            >
                              <Icons.moreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Button
                                className="flex w-full items-center gap-2 text-nowrap"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setCurrentEditDomain(domain);
                                  setShowForm(false);
                                  setFormType("edit");
                                  setShowForm(!isShowForm);
                                }}
                              >
                                {/* <PenLine className="mx-0.5 size-4" /> */}
                                {t("Edit")}
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Button
                                className="flex w-full items-center gap-2"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setCurrentEditDomain(domain);
                                  setShowDuplicateForm(false);
                                  setShowDuplicateForm(!isShowDuplicateForm);
                                }}
                              >
                                {t("Duplicate")}
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </div>
                ))
              ) : (
                <EmptyPlaceholder className="shadow-none">
                  <EmptyPlaceholder.Icon name="globeLock" />
                  <EmptyPlaceholder.Title>
                    {t("No Domains")}
                  </EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any domains yet. Start creating one.
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

      {/* form */}
      <Modal
        className="md:max-w-2xl"
        showModal={isShowForm}
        setShowModal={setShowForm}
      >
        <DomainForm
          user={{ id: user.id, name: user.name || "" }}
          isShowForm={isShowForm}
          setShowForm={setShowForm}
          type={formType}
          initData={currentEditDomain}
          action={action}
          onRefresh={handleRefresh}
        />
      </Modal>

      <Modal
        showModal={isShowDuplicateForm}
        setShowModal={setShowDuplicateForm}
      >
        <div className="flex flex-col items-start border-b p-4 pt-8 sm:px-16">
          <h2 className="mb-2 text-lg font-bold">
            {t("Confirm duplicate domain")} ?
          </h2>
          <p>
            {t(
              "This will duplicate all configuration information for the {domain} domain, and create a new domain",
              { domain: currentEditDomain?.domain_name || "" },
            )}
            .
          </p>

          <div className="mt-6 flex w-full items-center justify-between gap-2">
            <Button
              type="reset"
              variant="destructive"
              className="w-[100px] px-0"
              onClick={() => setShowDuplicateForm(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              className="w-full text-nowrap"
              disabled={isPending}
              onClick={() => handleDuplicate()}
            >
              {t("Duplicate")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function DomainInfo({ domain }: { domain: DomainFormData }) {
  return <>{domain.domain_name}</>;
}
