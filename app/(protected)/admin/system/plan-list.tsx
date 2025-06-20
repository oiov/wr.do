"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { PenLine, RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import useSWR, { useSWRConfig } from "swr";

import { PlanQuotaFormData } from "@/lib/dto/plan";
import { fetcher, nFormatter } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { PlanForm } from "@/components/forms/plan-form";
import { FormType } from "@/components/forms/record-form";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";
import { PaginationWrapper } from "@/components/shared/pagination";
import { TimeAgoIntl } from "@/components/shared/time-ago";

export interface PlanListProps {
  user: Pick<User, "id" | "name" | "email" | "apiKey" | "role" | "team">;
  action: string;
}

function TableColumnSekleton() {
  return (
    <TableRow className="grid grid-cols-4 items-center sm:grid-cols-8">
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

export default function PlanList({ user, action }: PlanListProps) {
  const { isMobile } = useMediaQuery();
  const t = useTranslations("List");
  const [isShowForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentEditPlan, setCurrentEditPlan] =
    useState<PlanQuotaFormData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    slug: "",
    target: "",
    userName: "",
  });

  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR<{
    total: number;
    list: PlanQuotaFormData[];
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

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="flex items-center gap-1 text-lg font-bold">
            <span className="text-nowrap">{t("Quota Settings")}</span>
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
              className="flex shrink-0 gap-1"
              variant="default"
              onClick={() => {
                setCurrentEditPlan(null);
                setShowForm(false);
                setFormType("add");
                setShowForm(!isShowForm);
              }}
            >
              <Icons.add className="size-4" />
              <span className="hidden sm:inline">{t("Add Plan")}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-100/50 dark:bg-primary-foreground">
              <TableRow className="grid grid-cols-4 items-center text-xs sm:grid-cols-8">
                <TableHead className="col-span-1 flex items-center font-bold">
                  {t("Plan Name")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center text-nowrap font-bold sm:flex">
                  {t("Short Limit")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center text-nowrap font-bold sm:flex">
                  {t("Email Limit")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center text-nowrap font-bold sm:flex">
                  {t("Send Limit")}
                </TableHead>
                <TableHead className="col-span-1 hidden items-center text-nowrap font-bold sm:flex">
                  {t("Record Limit")}
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
                data.list.map((plan) => (
                  <div className="border-b" key={plan.id}>
                    <TableRow className="grid grid-cols-4 items-center sm:grid-cols-8">
                      <TableCell className="col-span-1 flex items-center gap-1">
                        {plan.name}
                      </TableCell>
                      <TableCell className="col-span-1 hidden items-center gap-1 sm:flex">
                        {nFormatter(plan.slNewLinks)}
                      </TableCell>
                      <TableCell className="col-span-1 hidden items-center gap-1 sm:flex">
                        {nFormatter(plan.emEmailAddresses)}
                      </TableCell>
                      <TableCell className="col-span-1 hidden items-center gap-1 sm:flex">
                        {nFormatter(plan.emSendEmails)}
                      </TableCell>
                      <TableCell className="col-span-1 hidden items-center gap-1 sm:flex">
                        {nFormatter(plan.rcNewRecords)}
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center gap-1">
                        <Switch
                          disabled
                          defaultChecked={plan.isActive}
                          // onCheckedChange={(value) =>
                          // handleChangeStatus(value, "active", domain)
                          // }
                        />
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center truncate">
                        <TimeAgoIntl date={plan.updatedAt as Date} />
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center gap-1">
                        <Button
                          className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground sm:px-1.5"
                          size="sm"
                          variant={"outline"}
                          onClick={() => {
                            setCurrentEditPlan(plan);
                            setShowForm(false);
                            setFormType("edit");
                            setShowForm(!isShowForm);
                          }}
                        >
                          <p className="hidden text-nowrap sm:block">
                            {t("Edit")}
                          </p>
                          <PenLine className="mx-0.5 size-4 sm:ml-1 sm:size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </div>
                ))
              ) : (
                <EmptyPlaceholder className="shadow-none">
                  <EmptyPlaceholder.Icon name="settings" />
                  <EmptyPlaceholder.Title>
                    {t("No Plans")}
                  </EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any plans yet. Start creating one.
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
        <PlanForm
          user={{ id: user.id, name: user.name || "" }}
          isShowForm={isShowForm}
          setShowForm={setShowForm}
          type={formType}
          initData={currentEditPlan}
          action={action}
          onRefresh={handleRefresh}
        />
      </Modal>
    </>
  );
}
