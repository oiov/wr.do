"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";
import { PenLine, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { ShortUrlFormData } from "@/lib/dto/short-urls";
import {
  cn,
  expirationTime,
  extractHostname,
  fetcher,
  removeUrlSuffix,
  timeAgo,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormType } from "@/components/forms/record-form";
import { UrlForm } from "@/components/forms/url-form";
import ApiReference from "@/components/shared/api-reference";
import BlurImage from "@/components/shared/blur-image";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";
import { LinkInfoPreviewer } from "@/components/shared/link-previewer";
import { PaginationWrapper } from "@/components/shared/pagination";
import QRCodeEditor from "@/components/shared/qr";

import Globe from "./globe";
import LiveLog from "./live-logs";
import UserUrlMetaInfo from "./meta";

export interface UrlListProps {
  user: Pick<User, "id" | "name" | "apiKey" | "role" | "team">;
  action: string;
}

function TableColumnSekleton() {
  return (
    <TableRow className="grid grid-cols-3 items-center sm:grid-cols-11">
      <TableCell className="col-span-1 sm:col-span-2">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="col-span-1 sm:col-span-2">
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
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

export default function UserUrlsList({ user, action }: UrlListProps) {
  const pathname = usePathname();
  const [isShowForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentEditUrl, setCurrentEditUrl] = useState<ShortUrlFormData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isShowStats, setShowStats] = useState(false);
  const [isShowQrcode, setShowQrcode] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<ShortUrlFormData | null>(null);
  const [searchParams, setSearchParams] = useState({
    slug: "",
    target: "",
    userName: "",
  });

  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR<{
    total: number;
    list: ShortUrlFormData[];
  }>(
    `${action}?page=${currentPage}&size=${pageSize}&slug=${searchParams.slug}&userName=${searchParams.userName}&target=${searchParams.target}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const handleRefresh = () => {
    mutate(
      `${action}?page=${currentPage}&size=${pageSize}&slug=${searchParams.slug}&userName=${searchParams.userName}&target=${searchParams.target}`,
      undefined,
    );
  };

  const handleChangeStatu = async (checked: boolean, id: string) => {
    const res = await fetch(`/api/url/update/active`, {
      method: "POST",
      body: JSON.stringify({
        id,
        active: checked ? 1 : 0,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        toast.success("Successed!");
      }
    } else {
      toast.error("Activation failed!");
    }
  };

  const rendeEmpty = () => (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="link" />
      <EmptyPlaceholder.Title>No urls</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You don&apos;t have any url yet. Start creating url.
      </EmptyPlaceholder.Description>
    </EmptyPlaceholder>
  );

  const rendeHeader = () => (
    <>
      {pathname === "/dashboard" && (
        <h2 className="mb-4 text-lg font-bold">Short URLs</h2>
      )}

      <div className="mb-2 flex-row items-center gap-2 space-y-2 sm:flex sm:space-y-0">
        <div className="relative w-full">
          <Input
            className="h-8 text-xs md:text-xs"
            placeholder="Search by slug..."
            value={searchParams.slug}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                slug: e.target.value,
              });
            }}
          />
          {searchParams.slug && (
            <Button
              className="absolute right-2 top-1/2 h-6 -translate-y-1/2 rounded-full px-1 text-gray-500 hover:text-gray-700"
              onClick={() => setSearchParams({ ...searchParams, slug: "" })}
              variant={"ghost"}
            >
              <Icons.close className="size-3" />
            </Button>
          )}
        </div>

        <div className="relative w-full">
          <Input
            className="h-8 text-xs md:text-xs"
            placeholder="Search by target..."
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
              onClick={() => setSearchParams({ ...searchParams, target: "" })}
              variant={"ghost"}
            >
              <Icons.close className="size-3" />
            </Button>
          )}
        </div>

        {user.role === "ADMIN" && (
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
        )}
      </div>
    </>
  );

  const rendeList = () => (
    <div className="rounded-lg border p-4">
      {rendeHeader()}

      <Table>
        <TableHeader className="bg-gray-100/50 dark:bg-primary-foreground">
          <TableRow className="grid grid-cols-3 items-center sm:grid-cols-11">
            <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
              Slug
            </TableHead>
            <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
              Target
            </TableHead>
            <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
              User
            </TableHead>
            <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
              Enabled
            </TableHead>
            <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
              Expiration
            </TableHead>
            <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
              Updated
            </TableHead>
            <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
              Created
            </TableHead>
            <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
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
              <TableColumnSekleton />
              <TableColumnSekleton />
            </>
          ) : data && data.list && data.list.length ? (
            data.list.map((short) => (
              <div className="border-b" key={short.id}>
                <TableRow className="grid grid-cols-3 items-center sm:grid-cols-11">
                  <TableCell className="col-span-1 flex items-center gap-1 sm:col-span-2">
                    <Link
                      className="overflow-hidden text-ellipsis whitespace-normal text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-400"
                      href={`https://${short.prefix}/s/${short.url}${short.password ? `?password=${short.password}` : ""}`}
                      target="_blank"
                      prefetch={false}
                      title={short.url}
                    >
                      {short.url}
                    </Link>
                    <CopyButton
                      value={`${short.prefix}/s/${short.url}${short.password ? `?password=${short.password}` : ""}`}
                      className={cn(
                        "size-[25px]",
                        "duration-250 transition-all group-hover:opacity-100",
                      )}
                    />
                    {short.password && (
                      <Icons.lock className="size-3 text-neutral-600 dark:text-neutral-400" />
                    )}
                  </TableCell>
                  <TableCell className="col-span-1 flex items-center justify-start sm:col-span-2">
                    <LinkInfoPreviewer
                      apiKey={user.apiKey ?? ""}
                      url={short.target}
                      formatUrl={removeUrlSuffix(short.target)}
                    />
                  </TableCell>
                  <TableCell className="col-span-1 hidden truncate sm:flex">
                    <TooltipProvider>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger className="truncate">
                          {short.userName ?? "Anonymous"}
                        </TooltipTrigger>
                        <TooltipContent>
                          {short.userName ?? "Anonymous"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="col-span-1 hidden sm:flex">
                    <Switch
                      defaultChecked={short.active === 1}
                      onCheckedChange={(value) =>
                        handleChangeStatu(value, short.id || "")
                      }
                    />
                  </TableCell>
                  <TableCell className="col-span-1 hidden sm:flex">
                    {expirationTime(short.expiration, short.updatedAt)}
                  </TableCell>
                  <TableCell className="col-span-1 hidden truncate sm:flex">
                    {timeAgo(short.updatedAt as Date)}
                  </TableCell>
                  <TableCell className="col-span-1 hidden truncate sm:flex">
                    {timeAgo(short.createdAt as Date)}
                  </TableCell>
                  <TableCell className="col-span-1 flex items-center gap-1 sm:col-span-2">
                    <Button
                      className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground"
                      size="sm"
                      variant={"outline"}
                      onClick={() => {
                        setCurrentEditUrl(short);
                        setShowForm(false);
                        setFormType("edit");
                        setShowForm(!isShowForm);
                      }}
                    >
                      <p className="hidden sm:block">Edit</p>
                      <PenLine className="mx-0.5 size-4 sm:ml-1 sm:size-3" />
                    </Button>
                    <Button
                      className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground"
                      size="sm"
                      variant={"outline"}
                      onClick={() => {
                        setSelectedUrl(short);
                        setShowQrcode(!isShowQrcode);
                      }}
                    >
                      <Icons.qrcode className="mx-0.5 size-4" />
                    </Button>
                    <Button
                      className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUrl(short);
                        if (isShowStats && selectedUrl?.id !== short.id) {
                        } else {
                          setShowStats(!isShowStats);
                        }
                      }}
                    >
                      <Icons.lineChart className="mx-0.5 size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {isShowStats && selectedUrl?.id === short.id && (
                  <UserUrlMetaInfo
                    user={{
                      id: user.id,
                      name: user.name || "",
                      team: user.team,
                    }}
                    action="/api/url/meta"
                    urlId={short.id!}
                  />
                )}
              </div>
            ))
          ) : (
            rendeEmpty()
          )}
        </TableBody>
        {data && Math.ceil(data.total / pageSize) > 1 && (
          <PaginationWrapper
            total={data.total}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        )}
      </Table>
    </div>
  );

  const rendeGrid = () => (
    <>
      <div className="rounded-lg border p-4">
        {rendeHeader()}

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((v) => (
                <Skeleton key={v} className="h-24 w-full" />
              ))}
            </>
          ) : data && data.list && data.list.length ? (
            data.list.map((short) => (
              <div className="h-24 rounded-md border p-3" key={short.id}>
                <div className="flex h-full items-start justify-start gap-3">
                  <BlurImage
                    src={`https://unavatar.io/${extractHostname(short.target)}?fallback=https://wr.do/logo.png`}
                    alt="logo"
                    width={30}
                    height={30}
                  />
                  <div className="flex size-full flex-col justify-between truncate">
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex items-center">
                        <Link
                          className="overflow-hidden text-ellipsis whitespace-normal text-sm font-semibold text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-400"
                          href={`https://${short.prefix}/s/${short.url}${short.password ? `?password=${short.password}` : ""}`}
                          target="_blank"
                          prefetch={false}
                          title={short.url}
                        >
                          {short.prefix}/s/{short.url}
                        </Link>
                        <CopyButton
                          value={`${short.prefix}/s/${short.url}${short.password ? `?password=${short.password}` : ""}`}
                          className={cn(
                            "size-[25px]",
                            "duration-250 transition-all group-hover:opacity-100",
                          )}
                        />
                        {short.password && (
                          <Icons.lock className="size-3 text-neutral-600 dark:text-neutral-400" />
                        )}
                      </div>
                      <div className="ml-auto flex items-center">
                        <Button
                          className="size-[25px] p-1.5"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCurrentEditUrl(short);
                            setShowForm(false);
                            setFormType("edit");
                            setShowForm(!isShowForm);
                          }}
                        >
                          <PenLine className="size-4" />
                        </Button>
                        <Button
                          className="size-[25px] p-1.5"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUrl(short);
                            setShowQrcode(!isShowQrcode);
                          }}
                        >
                          <Icons.qrcode className="size-4" />
                        </Button>
                        <Button
                          className="size-[25px] p-1.5"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUrl(short);
                            if (isShowStats && selectedUrl?.id !== short.id) {
                            } else {
                              setShowStats(!isShowStats);
                            }
                          }}
                        >
                          <Icons.lineChart className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 overflow-hidden truncate text-sm text-muted-foreground">
                      <Icons.forwardArrow className="size-4 shrink-0 text-gray-400" />
                      <LinkInfoPreviewer
                        apiKey={user.apiKey ?? ""}
                        url={short.target}
                        formatUrl={removeUrlSuffix(short.target)}
                      />
                    </div>
                    <div className="mt-auto flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                      Expiration:{" "}
                      {expirationTime(short.expiration, short.updatedAt)}
                      <span>|</span>
                      Updated at {timeAgo(short.updatedAt as Date)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            rendeEmpty()
          )}
        </section>

        {data && Math.ceil(data.total / pageSize) > 1 && (
          <PaginationWrapper
            total={data.total}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        )}
      </div>
    </>
  );

  const rendLogs = () => (
    <>
      {action.indexOf("admin") > -1 ? <LiveLog admin={true} /> : <LiveLog />}
      <ApiReference
        badge="POST /api/v1/short"
        target="creating short urls"
        link="/docs/short-urls#api-reference"
      />
    </>
  );

  return (
    <>
      <Tabs defaultValue="List">
        {pathname !== "/dashboard" && (
          <div className="mb-4 flex items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger className="flex items-center gap-1" value="List">
                <Icons.list className="size-4" />
                List
              </TabsTrigger>
              <TabsTrigger className="flex items-center gap-1" value="Grid">
                <Icons.layoutGrid className="size-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger className="flex items-center gap-1" value="Realtime">
                <Icons.globe className="size-4" />
                Realtime
              </TabsTrigger>
            </TabsList>
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
                  setCurrentEditUrl(null);
                  setShowForm(false);
                  setFormType("add");
                  setShowForm(!isShowForm);
                }}
              >
                <Icons.add className="size-4" />
                <span className="hidden sm:inline">Add URL</span>
              </Button>
            </div>
          </div>
        )}

        <TabsContent className="space-y-3" value="List">
          {rendeList()}
          {rendLogs()}
        </TabsContent>
        <TabsContent className="space-y-3" value="Grid">
          {rendeGrid()}
          {rendLogs()}
        </TabsContent>
        <TabsContent value="Realtime">
          {action.indexOf("admin") > -1 ? <Globe isAdmin={true} /> : <Globe />}
        </TabsContent>
      </Tabs>

      {/* QR code editor */}
      <Modal
        className="md:max-w-lg"
        showModal={isShowQrcode}
        setShowModal={setShowQrcode}
      >
        {selectedUrl && (
          <QRCodeEditor
            user={{ id: user.id, apiKey: user.apiKey || "", team: user.team! }}
            url={`https://${selectedUrl.prefix}/s/${selectedUrl.url}`}
          />
        )}
      </Modal>

      {/* Url form */}
      <Modal
        className="md:max-w-2xl"
        showModal={isShowForm}
        setShowModal={setShowForm}
      >
        <UrlForm
          user={{ id: user.id, name: user.name || "" }}
          isShowForm={isShowForm}
          setShowForm={setShowForm}
          type={formType}
          initData={currentEditUrl}
          action={action}
          onRefresh={handleRefresh}
        />
      </Modal>
    </>
  );
}
