"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRecordFormData } from "@/actions/cloudflare-dns-record";
import { User } from "@prisma/client";
import { ArrowUpRight, DotSquareIcon, RefreshCwIcon } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";

import { TTL_ENUMS } from "@/lib/cloudflare";
import { fetcher } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { FormType, RecordForm } from "@/components/forms/record-form";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export interface RecordListProps {
  user: Pick<User, "id" | "name">;
}

function TableColumnSekleton({ className }: { className?: string }) {
  return (
    <TableRow className="grid grid-cols-6 items-center">
      <TableCell className="col-span-1">
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="col-span-1">
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="col-span-1">
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="col-span-1">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex justify-center">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex justify-center">
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

export default function UserRecordsList({ user }: RecordListProps) {
  const [isShowForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentEditRecord, setCurrentEditRecord] =
    useState<UserRecordFormData | null>(null);

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<UserRecordFormData[]>(
    "/api/record",
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const handleRefresh = () => {
    mutate("/api/record", undefined);
  };

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Records</CardTitle>
            <CardDescription className="text-balance">
              All Dns Records
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center justify-end gap-3">
            <Button
              variant={"outline"}
              onClick={() => handleRefresh()}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCwIcon className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCwIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              className="w-[120px] shrink-0 gap-1"
              variant="default"
              onClick={() => {
                setCurrentEditRecord(null);
                setShowForm(false);
                setFormType("add");
                setShowForm(!isShowForm);
              }}
            >
              Add record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isShowForm && (
            <RecordForm
              user={{ id: user.id, name: user.name || "" }}
              isShowForm={isShowForm}
              setShowForm={setShowForm}
              type={formType}
              initData={currentEditRecord}
              onRefresh={handleRefresh}
            />
          )}
          <Table>
            <TableHeader>
              <TableRow className="grid grid-cols-6 items-center">
                <TableHead className="col-span-1 flex items-center font-bold">
                  Type
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold">
                  Name
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold">
                  Content
                </TableHead>
                <TableHead className="col-span-1 flex items-center font-bold">
                  TTL
                </TableHead>
                <TableHead className="col-span-1 flex items-center justify-center font-bold">
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
                  <TableColumnSekleton className="col-span-1" />
                  <TableColumnSekleton className="col-span-1" />
                </>
              ) : data && data.length > 0 ? (
                data.map((record) => (
                  <TableRow className="grid animate-fade-in grid-cols-6 items-center animate-in">
                    <TableCell className="col-span-1">
                      <Badge className="text-xs" variant="outline">
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="col-span-1">{record.name}</TableCell>
                    <TableCell className="col-span-1">
                      {record.content}
                    </TableCell>
                    <TableCell className="col-span-1">
                      {
                        TTL_ENUMS.find((ttl) => ttl.value === `${record.ttl}`)
                          ?.label
                      }
                    </TableCell>
                    <TableCell className="col-span-1 flex justify-center">
                      <StatusDot status={record.active} />
                    </TableCell>
                    <TableCell className="col-span-1 flex justify-center">
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setCurrentEditRecord(record);
                          setShowForm(false);
                          setFormType("edit");
                          setShowForm(!isShowForm);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="post" />
                  <EmptyPlaceholder.Title>No records</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any record yet. Start creating record.
                  </EmptyPlaceholder.Description>
                  <Button
                    className="w-[120px] shrink-0 gap-1"
                    variant="default"
                    onClick={() => {
                      setCurrentEditRecord(null);
                      setShowForm(false);
                      setFormType("add");
                      setShowForm(!isShowForm);
                    }}
                  >
                    Add record
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
