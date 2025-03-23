"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";

import { LOGS_LIMITEs_ENUMS } from "@/lib/enums";
import { fetcher } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";
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
}

export default function LiveLog({ admin }: { admin: boolean }) {
  const [isLive, setIsLive] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [limitDiplay, setLimitDisplay] = useState(100);

  const { data: newLogs, error } = useSWR<LogEntry[], Error>(
    isLive ? `/api/url/admin/live-log?admin=${admin}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      dedupingInterval: 2000,
    },
  );

  // 追加和去重逻辑
  useEffect(() => {
    if (newLogs) {
      setLogs((prevLogs) => {
        const logMap = new Map<string, LogEntry>(
          prevLogs.map((log) => [`${log.ip}-${log.slug}`, log]),
        );

        // 添加或更新新日志
        newLogs.forEach((log) => {
          const key = `${log.ip}-${log.slug}`;
          const existing = logMap.get(key);
          if (
            !existing ||
            new Date(log.updatedAt) > new Date(existing.updatedAt)
          ) {
            logMap.set(key, log);
          }
        });

        // 转换为数组，排序并限制总数
        return Array.from(logMap.values())
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, limitDiplay);
      });
    }
  }, [newLogs]);

  const toggleLive = () => setIsLive((prev) => !prev);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-gray-800">Live Log</CardTitle>
            <CardDescription>
              Real-time updates of short URL visits.
            </CardDescription>
          </div>

          <button
            onClick={toggleLive}
            className={`ml-auto flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:border-blue-600 hover:text-blue-600 ${
              isLive ? "border-blue-600 text-blue-500" : ""
            }`}
          >
            <Icons.CirclePlay className="h-4 w-4" /> {isLive ? "Stop" : "Live"}
          </button>
          <button
            onClick={() => setLogs([])}
            className={`ml-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              logs.length > 0
                ? "hover:border-yellow-400 hover:text-yellow-400"
                : ""
            }`}
            disabled={logs.length === 0}
          >
            <Icons.trash className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-red-500">{error.message}</div>
        ) : logs.length === 0 && !newLogs ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          // <></>
          <div className="scrollbar-hidden h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/12">No.</TableHead>
                  <TableHead className="w-1/12">Url</TableHead>
                  <TableHead className="">Target</TableHead>
                  <TableHead className="w-1/12">IP</TableHead>
                  <TableHead className="w-1/6">Location</TableHead>
                  <TableHead className="w-1/12">Clicks</TableHead>
                  <TableHead className="w-1/12">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {logs.map((log, index) => (
                    <motion.tr
                      key={`${log.ip}-${log.slug}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-3 border-b border-dashed border-gray-100 text-xs hover:bg-gray-50 dark:border-gray-800"
                    >
                      <TableCell className="">{logs.length - index}</TableCell>
                      <TableCell className="font-midium">{log.slug}</TableCell>
                      <TableCell className="max-w-10 truncate hover:underline">
                        <a href={log.target} target="_blank" title={log.target}>
                          {log.target}
                        </a>
                      </TableCell>
                      <TableCell className="">{log.ip}</TableCell>
                      <TableCell className="max-w-6 truncate">
                        {decodeURIComponent(
                          log.city ? `${log.city}, ${log.country}` : "-",
                        )}
                      </TableCell>
                      <TableCell className="">{log.click}</TableCell>
                      <TableCell>
                        {new Date(log.updatedAt).toLocaleTimeString()}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
        {isLive && (
          <div className="flex w-full items-center justify-end gap-2 p-2 text-sm text-gray-500">
            <p>{logs.length}</p> of
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
            <p>total logs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
