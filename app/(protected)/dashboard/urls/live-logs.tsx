"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import useSWR, { useSWRConfig } from "swr";

import { getCountryName } from "@/lib/contries";
import { LOGS_LIMITEs_ENUMS } from "@/lib/enums";
import { fetcher } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/shared/icons";

export interface LogEntry {
  target: string;
  slug: string;
  ip: string;
  click: number;
  city?: string;
  country?: string;
  updatedAt: string;
  createdAt: string;
  isNew?: boolean; // New property to track newly added logs
}

export default function LiveLog({ admin = false }: { admin?: boolean }) {
  const { theme } = useTheme();
  const { mutate } = useSWRConfig();
  const [isLive, setIsLive] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [limitDiplay, setLimitDisplay] = useState(100);
  const newLogsRef = useRef<Set<string>>(new Set()); // Track new log keys

  const t = useTranslations("Components");

  const {
    data: newLogs,
    error,
    isLoading,
  } = useSWR<LogEntry[], Error>(
    isLive ? `/api/url/admin/live-log?admin=${admin}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      dedupingInterval: 2000,
    },
  );

  const handleRefresh = () => {
    mutate(`/api/url/admin/live-log?admin=${admin}`, undefined);
  };

  // 追加和去重逻辑
  useEffect(() => {
    if (newLogs) {
      setLogs((prevLogs) => {
        const logMap = new Map<string, LogEntry>(
          prevLogs.map((log) => [`${log.ip}-${log.slug}`, log]),
        );

        // Store new keys that don't exist or have been updated
        const currentKeys = new Set(logMap.keys());
        const updatedKeys = new Set<string>();

        // 添加或更新新日志
        newLogs.forEach((log) => {
          const key = `${log.ip}-${log.slug}`;
          const existing = logMap.get(key);
          if (
            !existing ||
            new Date(log.updatedAt) > new Date(existing.updatedAt)
          ) {
            // Mark as new if it's a new entry or updated
            updatedKeys.add(key);
            logMap.set(key, {
              ...log,
              isNew: true,
            });
          }
        });

        // Update newLogsRef with the new keys
        newLogsRef.current = updatedKeys;

        // Clear isNew flag for old logs after some time
        setTimeout(() => {
          setLogs((oldLogs) =>
            oldLogs.map((log) => {
              const key = `${log.ip}-${log.slug}`;
              if (newLogsRef.current.has(key)) {
                return { ...log, isNew: false };
              }
              return log;
            }),
          );
          // Clear the set after updating
          newLogsRef.current.clear();
        }, 2000); // Duration of highlight effect (2 seconds)

        // 转换为数组，排序并限制总数
        return Array.from(logMap.values())
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, limitDiplay);
      });
    }
  }, [newLogs, limitDiplay]);

  const toggleLive = () => setIsLive((prev) => !prev);

  const getRowBackground = (index: number, isNew: boolean | undefined) => {
    if (isNew) {
      return "#5facff1d";
    }

    return index % 2 === 0
      ? theme === "dark"
        ? "#1f1f1f"
        : "white"
      : theme === "dark"
        ? "#464646"
        : "#f7f7f7";
  };

  return (
    <Card className="grids mx-auto w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base text-gray-800 dark:text-gray-100">
              {t("Live Logs")}
            </CardTitle>
            <CardDescription>
              {t("Real-time logs of short link visits")}.
            </CardDescription>
          </div>

          <Button
            onClick={toggleLive}
            variant={"outline"}
            size="sm"
            className={`ml-auto gap-2 text-nowrap bg-primary-foreground transition-colors hover:border-blue-600 hover:text-blue-600 ${
              isLive ? "border-dashed border-blue-600 text-blue-500" : ""
            }`}
          >
            <Icons.CirclePlay className="h-4 w-4" />{" "}
            {isLive ? t("Stop") : t("Live")}
          </Button>
          <Button
            className="bg-primary-foreground"
            variant={"outline"}
            size="sm"
            onClick={() => handleRefresh()}
            disabled={!isLive}
          >
            {isLoading ? (
              <Icons.refreshCw className="size-4 animate-spin" />
            ) : (
              <Icons.refreshCw className="size-4" />
            )}
          </Button>
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => setLogs([])}
            className={`gap-2 bg-primary-foreground transition-colors ${
              logs.length > 0
                ? "hover:border-yellow-400 hover:text-yellow-400"
                : ""
            }`}
            disabled={logs.length === 0}
          >
            <Icons.paintbrush className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={"pb-0" + (isLive ? " pb-6" : "")}>
        {error ? (
          <div className="text-center text-red-500">{error.message}</div>
        ) : logs.length === 0 && !newLogs ? (
          <></>
        ) : (
          <div className="scrollbar-hidden h-96 overflow-y-auto bg-primary-foreground">
            <Table>
              <TableHeader>
                <TableRow className="grid grid-cols-5 bg-gray-100/50 text-sm dark:bg-primary-foreground sm:grid-cols-9">
                  <TableHead className="col-span-2 flex h-8 items-center">
                    {t("Time")}
                  </TableHead>
                  <TableHead className="col-span-1 flex h-8 items-center">
                    {t("Slug")}
                  </TableHead>
                  <TableHead className="col-span-3 hidden h-8 items-center sm:flex">
                    {t("Target")}
                  </TableHead>
                  <TableHead className="col-span-1 hidden h-8 items-center sm:flex">
                    IP
                  </TableHead>
                  <TableHead className="col-span-1 flex h-8 items-center">
                    {t("Location")}
                  </TableHead>
                  <TableHead className="col-span-1 flex h-8 items-center">
                    {t("Clicks")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {logs.map((log, index) => (
                    <motion.tr
                      key={`${log.ip}-${log.slug}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        backgroundColor: getRowBackground(index, log.isNew),
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0,
                        backgroundColor: {
                          duration: 0.5,
                          ease: "linear",
                        },
                      }}
                      className="grid grid-cols-5 font-mono text-xs hover:bg-gray-200 dark:border-gray-800 sm:grid-cols-9"
                    >
                      <TableCell className="col-span-2 truncate py-1.5">
                        {new Date(log.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-midium col-span-1 truncate py-1.5 text-green-700">
                        {log.slug}
                      </TableCell>
                      <TableCell className="col-span-3 hidden max-w-full truncate py-1.5 hover:underline sm:flex">
                        <a href={log.target} target="_blank" title={log.target}>
                          {log.target}
                        </a>
                      </TableCell>
                      <TableCell className="col-span-1 hidden truncate py-1.5 sm:flex">
                        {log.ip}
                      </TableCell>
                      <TableCell
                        className="col-span-1 truncate py-1.5"
                        title={getCountryName(log.country || "")}
                      >
                        {decodeURIComponent(
                          log.city
                            ? `${log.city},${getCountryName(log.country || "")}`
                            : "-",
                        )}
                      </TableCell>
                      <TableCell className="col-span-1 py-1.5 text-green-700">
                        {log.click}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
        {isLive && (
          <div className="flex w-full items-center justify-end gap-2 border-t border-dashed pt-4 text-sm text-gray-500">
            <p>{logs.length}</p> {t("of")}
            <Select
              onValueChange={(value: string) => {
                setLimitDisplay(Number(value));
              }}
              name="expiration"
              defaultValue={limitDiplay.toString()}
            >
              <SelectTrigger className="w-20 shadow-inner">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {LOGS_LIMITEs_ENUMS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p>{t("total logs")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
