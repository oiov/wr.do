"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { set } from "date-fns";
import { LineChart, PenLine, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { siteConfig } from "@/config/site";
import { ShortUrlFormData } from "@/lib/dto/short-urls";
import {
  cn,
  expirationTime,
  fetcher,
  removeUrlSuffix,
  timeAgo,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
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
import StatusDot from "@/components/dashboard/status-dot";
import { FormType } from "@/components/forms/record-form";
import { UrlForm } from "@/components/forms/url-form";
import { BlurImg } from "@/components/shared/blur-image";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";
import { LinkPreviewer } from "@/components/shared/link-previewer";
import { PaginationWrapper } from "@/components/shared/pagination";

import UserUrlMetaInfo from "./meta";

export interface UrlListProps {
  user: Pick<User, "id" | "name" | "apiKey" | "role">;
  action: string;
}

function TableColumnSekleton() {
  return (
    <TableRow className="grid grid-cols-3 items-center sm:grid-cols-9">
      <TableCell className="col-span-1">
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
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

export default function UserUrlsList({ user, action }: UrlListProps) {
  const [isShowForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentEditUrl, setCurrentEditUrl] = useState<ShortUrlFormData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isShowStats, setShowStats] = useState(false);
  const [isShowQrcode, setShowQrcode] = useState(false);
  const [qrcodeInfo, setQrcodeInfo] = useState({
    tmp_url: "",
    payload: "",
  });
  const [selectedUrlId, setSelectedUrlId] = useState("");
  const [searchParams, setSearchParams] = useState({
    slug: "",
    target: "",
    userName: "",
  });

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<{
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

  const handleQrcode = async (link: string) => {
    if (link && user.apiKey) {
      // setIsShoting(true);
      const payload = `/api/v1/scraping/qrcode?url=${link}&key=${user.apiKey}`;
      const res = await fetch(payload);
      if (!res.ok || res.status !== 200) {
        toast.error(res.statusText);
      } else {
        // const blob = await res.blob();
        // const imageUrl = URL.createObjectURL(blob);
        setQrcodeInfo({
          tmp_url: await res.text(),
          payload: `${window.location.origin}${payload}`,
        });
        // toast.success("Success!");
      }
      // setIsShoting(false);
    }
  };
  const handleDownloadQrCode = (url: string) => {
    const link = document.createElement("a");
    link.download = `wrdo-${url}.png`;
    link.href = qrcodeInfo.tmp_url;
    link.click();
  };
  const handleCopyQrCode = (url: string) => {
    navigator.clipboard.writeText(qrcodeInfo.payload);
    toast.success("Copied to clipboard");
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

  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          {action.includes("/admin") ? (
            <CardDescription className="text-balance text-lg font-bold">
              <span>Total URLs:</span>{" "}
              <span className="font-bold">{data && data.total}</span>
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
          <div className="mb-2 flex-row items-center gap-2 space-y-2 sm:flex sm:space-y-0">
            <div className="relative w-full">
              <Input
                className=""
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
                  onClick={() =>
                    setSearchParams({ ...searchParams, target: "" })
                  }
                  variant={"ghost"}
                >
                  <Icons.close className="size-3" />
                </Button>
              )}
            </div>

            {user.role === "ADMIN" && (
              <div className="relative w-full">
                <Input
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
              <TableRow className="grid grid-cols-3 items-center sm:grid-cols-9">
                <TableHead className="col-span-1 flex items-center font-bold">
                  Url
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
                <TableHead className="col-span-1 flex items-center font-bold">
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
                  <>
                    <TableRow
                      key={short.id}
                      className="grid animate-fade-in grid-cols-3 items-center animate-in sm:grid-cols-9"
                    >
                      <TableCell className="col-span-1 flex items-center gap-1">
                        <Link
                          className="overflow-hidden overflow-ellipsis whitespace-normal text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-400"
                          href={`https://${short.prefix}/s/${short.url}`}
                          target="_blank"
                          prefetch={false}
                          title={short.url}
                        >
                          {short.url}
                        </Link>
                        <CopyButton
                          value={`${short.prefix}/s/${short.url}`}
                          className={cn(
                            "size-[25px]",
                            "duration-250 transition-all group-hover:opacity-100",
                          )}
                        />
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center justify-start sm:col-span-2">
                        <LinkPreviewer
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
                          className="data-[state=checked]:bg-blue-500"
                          defaultChecked={short.active === 1}
                          onCheckedChange={(value) =>
                            handleChangeStatu(value, short.id || "")
                          }
                        />
                      </TableCell>
                      <TableCell className="col-span-1 hidden sm:flex">
                        {expirationTime(short.expiration, short.updatedAt)}
                      </TableCell>
                      <TableCell className="col-span-1 hidden sm:flex">
                        {timeAgo(short.updatedAt as Date)}
                      </TableCell>
                      <TableCell className="col-span-1 flex items-center gap-1">
                        <Button
                          className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground"
                          size="sm"
                          variant={"outline"}
                          onClick={() => {
                            setCurrentEditUrl(short);
                            setShowForm(false);
                            setFormType("edit");
                            setShowForm(!isShowForm);
                            if (!isShowForm) {
                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
                            }
                          }}
                        >
                          <p className="hidden sm:block">Edit</p>
                          <PenLine className="mx-0.5 size-4 sm:ml-1 sm:size-3" />
                        </Button>
                        <HoverCard
                          open={isShowQrcode && selectedUrlId === short.id}
                        >
                          <HoverCardTrigger>
                            <Button
                              className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground"
                              size="sm"
                              variant={"outline"}
                              onClick={() => {
                                setSelectedUrlId(short.id!);
                                setShowQrcode(!isShowQrcode);
                                handleQrcode(
                                  `https://${short.prefix}/s/${short.url}`,
                                );
                              }}
                            >
                              <Icons.qrcode className="mx-0.5 size-4" />
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent
                            className="flex w-64 flex-col items-center justify-center gap-2"
                            onMouseLeave={() => setShowQrcode(false)}
                          >
                            {!user.apiKey && (
                              <div className="flex flex-col items-center gap-2">
                                <p className="text-center text-sm">
                                  Please generate api key before use this
                                  feature. Learn more about{" "}
                                  <Link
                                    className="py-1 text-blue-600 hover:text-blue-400 hover:underline dark:hover:text-primary-foreground"
                                    href={"/docs/open-api#api-key"}
                                  >
                                    api key
                                  </Link>
                                  .
                                </p>

                                <Link
                                  className="flex h-8 items-center justify-center rounded-md bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-400 dark:hover:text-primary-foreground"
                                  href={"/dashboard/settings"}
                                >
                                  Generate Api Key
                                </Link>
                              </div>
                            )}
                            {user.apiKey && (
                              <BlurImg
                                src={qrcodeInfo.tmp_url}
                                alt="ligth preview landing"
                                className="rounded-md border"
                                width={200}
                                height={200}
                                priority
                                placeholder="blur"
                              />
                            )}
                            {user.apiKey && (
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  onClick={() => {
                                    handleDownloadQrCode(short.url);
                                  }}
                                  className="h-8 py-1 text-xs hover:bg-blue-400 dark:hover:text-primary-foreground"
                                  size="sm"
                                  variant={"blue"}
                                >
                                  Download
                                  <Icons.download className="ml-1 size-4" />
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleCopyQrCode(short.url);
                                  }}
                                  className="h-8 py-1 text-xs hover:bg-gray-400 dark:hover:text-primary-foreground"
                                  size="sm"
                                  variant={"default"}
                                >
                                  Copy Link
                                  <Icons.copy className="ml-1 size-4" />
                                </Button>
                              </div>
                            )}
                          </HoverCardContent>
                        </HoverCard>
                        <Button
                          className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUrlId(short.id!);
                            if (isShowStats && selectedUrlId !== short.id) {
                            } else {
                              setShowStats(!isShowStats);
                            }
                          }}
                        >
                          <Icons.lineChart className="mx-0.5 size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isShowStats && selectedUrlId === short.id && (
                      <UserUrlMetaInfo
                        user={{ id: user.id, name: user.name || "" }}
                        action="/api/url/meta"
                        urlId={short.id!}
                      />
                    )}
                  </>
                ))
              ) : (
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="link" />
                  <EmptyPlaceholder.Title>No urls</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any url yet. Start creating url.
                  </EmptyPlaceholder.Description>
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
