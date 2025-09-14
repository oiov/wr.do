"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";
import { PenLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { ShortUrlFormData } from "@/lib/dto/short-urls";
import {
  addUrlPrefix,
  cn,
  expirationTime,
  extractHostname,
  fetcher,
  nFormatter,
  removeUrlPrefix,
} from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
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
import { UrlStatus } from "@/components/dashboard/status-card";
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
import { TimeAgoIntl } from "@/components/shared/time-ago";

import { UrlExporter } from "./export";
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
  const { isMobile } = useMediaQuery();
  const t = useTranslations("List");
  const [currentView, setCurrentView] = useState<string>("List");
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
  const [isPending, startTransition] = useTransition();
  const [currentListClickData, setCurrentListClickData] = useState<
    Record<string, number>
  >({});

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

  const currentListIds = useMemo(() => {
    return data?.list?.map((item) => item.id ?? "") ?? [];
  }, [data?.list]);

  useEffect(() => {
    handleGetUrlClicks();
  }, [currentListIds]);

  const handleGetUrlClicks = async () => {
    startTransition(async () => {
      if (currentListIds.length > 0 && currentView !== "Realtime") {
        const res = await fetch(action, {
          method: "POST",
          body: JSON.stringify({ ids: currentListIds }),
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentListClickData(data);
        }
      }
    });
  };

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
    <EmptyPlaceholder className="col-span-full shadow-none">
      <EmptyPlaceholder.Icon name="link" />
      <EmptyPlaceholder.Title>{t("No urls")}</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You don&apos;t have any url yet. Start creating url.
      </EmptyPlaceholder.Description>
    </EmptyPlaceholder>
  );

  const rendeSeachInputs = () => (
    <div className="mb-2 flex-row items-center gap-2 space-y-2 sm:flex sm:space-y-0">
      <div className="relative w-full">
        <Input
          className="h-8 text-xs md:text-xs"
          placeholder={t("Search by slug") + "..."}
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
          placeholder={t("Search by target") + "..."}
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
            placeholder={t("Search by username") + "..."}
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
              onClick={() => setSearchParams({ ...searchParams, userName: "" })}
              variant={"ghost"}
            >
              <Icons.close className="size-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const rendeClicks = (short: ShortUrlFormData) => (
    <>
      <Icons.mousePointerClick className="size-[14px]" />
      {isPending ? (
        <Skeleton className="h-4 w-6 rounded" />
      ) : (
        <p className="text-xs font-medium text-gray-700 dark:text-gray-50">
          {(short.id && nFormatter(currentListClickData[short.id], 2)) || "-"}
        </p>
      )}
    </>
  );

  const rendeStats = (short: ShortUrlFormData) =>
    isShowStats &&
    selectedUrl?.id === short.id && (
      <UserUrlMetaInfo
        user={{
          id: user.id,
          name: user.name || "",
          team: user.team,
        }}
        action="/api/url/meta"
        urlId={short.id!}
      />
    );

  const rendeList = () => (
    <Table>
      <TableHeader className="bg-gray-100/50 dark:bg-primary-foreground">
        <TableRow className="grid grid-cols-3 items-center sm:grid-cols-11">
          <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
            {t("Slug")}
          </TableHead>
          <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
            {t("Target")}
          </TableHead>
          <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
            {t("User")}
          </TableHead>
          <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
            {t("Enabled")}
          </TableHead>
          <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
            {t("Expiration")}
          </TableHead>
          <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
            {t("Clicks")}
          </TableHead>
          <TableHead className="col-span-1 hidden items-center font-bold sm:flex">
            {t("Updated")}
          </TableHead>
          <TableHead className="col-span-1 flex items-center font-bold sm:col-span-2">
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
          data.list.map((short) => (
            <div className="border-b" key={short.id}>
              <TableRow className="grid grid-cols-3 items-center sm:grid-cols-11">
                <TableCell className="col-span-1 flex items-center gap-1 sm:col-span-2">
                  <Link
                    className="overflow-hidden text-ellipsis whitespace-normal text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-400"
                    href={`https://${short.prefix}/${short.url}${short.password ? `?password=${short.password}` : ""}`}
                    target="_blank"
                    prefetch={false}
                    title={short.url}
                  >
                    {short.url}
                  </Link>
                  <CopyButton
                    value={`${short.prefix}/${short.url}${short.password ? `?password=${short.password}` : ""}`}
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
                    url={addUrlPrefix(short.target)}
                    formatUrl={removeUrlPrefix(short.target)}
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
                  <div className="flex items-center gap-1 rounded-lg border bg-gray-50 px-2 py-1 dark:bg-gray-600/50">
                    {rendeClicks(short)}
                  </div>
                </TableCell>
                <TableCell className="col-span-1 hidden truncate sm:flex">
                  <TimeAgoIntl date={short.updatedAt as Date} />
                </TableCell>
                <TableCell className="col-span-1 flex items-center gap-1 sm:col-span-2">
                  <Button
                    className="h-7 px-1 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground sm:px-1.5"
                    size="sm"
                    variant={"outline"}
                    onClick={() => {
                      setCurrentEditUrl(short);
                      setShowForm(false);
                      setFormType("edit");
                      setShowForm(!isShowForm);
                    }}
                  >
                    <p className="hidden text-nowrap sm:block">{t("Edit")}</p>
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
                      setCurrentView(short.id!);
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
              {/* {rendeStats(short)} */}
            </div>
          ))
        ) : (
          rendeEmpty()
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
  );

  const rendeGrid = () => (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <Skeleton key={v} className="h-24 w-full" />
            ))}
          </>
        ) : data && data.list && data.list.length ? (
          data.list.map((short) => (
            <div
              className={cn(
                "h-24 rounded-lg border p-1 shadow-inner dark:bg-neutral-800",
              )}
              key={short.id}
            >
              <div className="flex h-full flex-col rounded-lg border border-dotted bg-white px-3 py-1.5 backdrop-blur-lg dark:bg-black">
                <div className="flex items-center justify-between gap-1">
                  <BlurImage
                    src={`https://unavatar.io/${extractHostname(short.target)}?fallback=https://wr.do/logo.png`}
                    alt="logo"
                    width={30}
                    height={30}
                    className="rounded-md"
                  />
                  <div className="ml-2 mr-auto flex flex-col justify-between truncate">
                    {/* url */}
                    <div className="flex items-center">
                      <Link
                        className="overflow-hidden text-ellipsis whitespace-normal text-sm font-semibold text-slate-600 hover:text-blue-400 hover:underline dark:text-slate-300"
                        href={`https://${short.prefix}/${short.url}${short.password ? `?password=${short.password}` : ""}`}
                        target="_blank"
                        prefetch={false}
                        title={short.url}
                      >
                        {short.url}
                      </Link>
                      <CopyButton
                        value={`https://${short.prefix}/${short.url}${short.password ? `?password=${short.password}` : ""}`}
                        className={cn(
                          "size-[25px]",
                          "duration-250 transition-all group-hover:opacity-100",
                        )}
                      />
                      <Button
                        className="duration-250 size-[26px] p-1.5 text-foreground transition-all hover:border hover:text-foreground dark:text-foreground"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedUrl(short);
                          setShowQrcode(!isShowQrcode);
                        }}
                      >
                        <Icons.qrcode className="size-4" />
                      </Button>
                      {short.password && (
                        <Icons.lock className="size-3 text-neutral-600 dark:text-neutral-400" />
                      )}
                    </div>

                    {/* target */}
                    <div className="flex items-center gap-1 overflow-hidden truncate text-sm text-muted-foreground">
                      <Icons.forwardArrow className="size-4 shrink-0 text-gray-400" />
                      <LinkInfoPreviewer
                        apiKey={user.apiKey ?? ""}
                        url={short.target}
                        formatUrl={removeUrlPrefix(short.target)}
                      />
                    </div>
                  </div>

                  <div className="ml-2 flex items-center gap-1 rounded-md border bg-gray-50 px-2 py-1 dark:bg-gray-600/50">
                    {rendeClicks(short)}
                  </div>

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
                          className="flex w-full items-center gap-2"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUrl(short);
                            setCurrentView(short.id!);
                            if (isShowStats && selectedUrl?.id !== short.id) {
                            } else {
                              setShowStats(!isShowStats);
                            }
                          }}
                        >
                          <Icons.lineChart className="size-4" />
                          {t("Analytics")}
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Button
                          className="flex w-full items-center gap-2"
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
                          {t("Edit URL")}
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-auto flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
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
                  <Separator
                    className="h-4/5"
                    orientation="vertical"
                  ></Separator>
                  {short.expiration !== "-1" && (
                    <>
                      <span>
                        Expiration:{" "}
                        {expirationTime(short.expiration, short.updatedAt)}
                      </span>
                      <Separator
                        className="h-4/5"
                        orientation="vertical"
                      ></Separator>
                    </>
                  )}
                  <TimeAgoIntl date={short.updatedAt as Date} />
                  <Switch
                    className="scale-[0.6]"
                    defaultChecked={short.active === 1}
                    onCheckedChange={(value) =>
                      handleChangeStatu(value, short.id || "")
                    }
                  />
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
          layout={isMobile ? "right" : "split"}
          total={data.total}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </>
  );

  const rendLogs = () => (
    <div className="mt-6 space-y-3">
      {action.indexOf("admin") > -1 ? <LiveLog admin={true} /> : <LiveLog />}
      <ApiReference
        badge="POST /api/v1/short"
        target="creating short urls"
        link="/docs/short-urls#api-reference"
      />
    </div>
  );

  return (
    <>
      <Tabs
        className={cn("rounded-lg", pathname === "/dashboard" && "border p-6")}
        value={currentView}
      >
        {/* Tabs */}
        <div className="mb-4 flex items-center justify-between gap-2">
          {pathname === "/dashboard" && (
            <h2 className="mr-3 text-lg font-semibold">{t("Short URLs")}</h2>
          )}
          <TabsList>
            <TabsTrigger onClick={() => setCurrentView("List")} value="List">
              <Icons.list className="size-4" />
              {/* List */}
            </TabsTrigger>
            <TabsTrigger onClick={() => setCurrentView("Grid")} value="Grid">
              <Icons.layoutGrid className="size-4" />
              {/* Grid */}
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setCurrentView("Realtime")}
              value="Realtime"
            >
              <Icons.globe className="size-4 text-blue-500" />
              {/* Realtime */}
            </TabsTrigger>
            {selectedUrl?.id && (
              <TabsTrigger
                className="flex items-center gap-1 text-muted-foreground"
                value={selectedUrl.id}
                onClick={() => setCurrentView(selectedUrl.id!)}
              >
                <Icons.lineChart className="size-4" />
                {selectedUrl.url}
              </TabsTrigger>
            )}
          </TabsList>
          {/* <p>Total: {data?.total || 0}</p> */}
          <div className="ml-auto flex items-center justify-end gap-3">
            <UrlExporter data={data?.list || []} />
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
            {action.indexOf("admin") === -1 && (
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
                <span className="hidden sm:inline">{t("Add URL")}</span>
              </Button>
            )}
          </div>
        </div>

        <TabsContent className="space-y-3" value="List">
          {pathname !== "/dashboard" && <UrlStatus action={action} />}
          {rendeSeachInputs()}
          {rendeList()}
          {rendLogs()}
        </TabsContent>
        <TabsContent className="space-y-3" value="Grid">
          {pathname !== "/dashboard" && <UrlStatus action={action} />}
          {rendeSeachInputs()}
          {rendeGrid()}
          {rendLogs()}
        </TabsContent>
        <TabsContent value="Realtime">
          {action.indexOf("admin") > -1 ? <Globe isAdmin={true} /> : <Globe />}
        </TabsContent>
        {selectedUrl?.id && (
          <TabsContent value={selectedUrl.id}>
            {rendeStats(selectedUrl)}
          </TabsContent>
        )}
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
            url={`https://${selectedUrl.prefix}/${selectedUrl.url}`}
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
