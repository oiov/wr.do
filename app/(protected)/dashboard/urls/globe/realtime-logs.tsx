"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";

import { formatTime } from "@/lib/utils";

import { Location } from "./index";

const RealtimeLogs = ({
  className,
  locations,
}: {
  className?: string;
  locations: Location[];
}) => {
  const [displayedLocations, setDisplayedLocations] = useState<Location[]>([]);
  const [pendingLocations, setPendingLocations] = useState<Location[]>([]);

  // 生成唯一标识用于去重
  const generateUniqueKey = (loc: Location): string => {
    return `${loc.userUrl?.url || ""}-${loc.userUrl?.target || ""}-${loc.userUrl?.prefix || ""}-${loc.country || ""}-${loc.city || ""}-${loc.browser || ""}-${loc.device || ""}-${loc.updatedAt?.toString() || ""}`;
  };

  // 当外部 locations 更新时，更新预备列表
  useEffect(() => {
    const sortedLocations = [...locations].sort((a, b) => {
      const timeA = new Date(a.updatedAt?.toString() || "").getTime() || 0;
      const timeB = new Date(b.updatedAt?.toString() || "").getTime() || 0;
      return timeA - timeB;
    });

    setPendingLocations((prev) => {
      // 去重：基于多个字段判断
      const newLocations = sortedLocations.filter(
        (loc) =>
          !prev.some((p) => generateUniqueKey(p) === generateUniqueKey(loc)) &&
          !displayedLocations.some(
            (d) => generateUniqueKey(d) === generateUniqueKey(loc),
          ),
      );
      return [...prev, ...newLocations];
    });
  }, [locations]);

  // 每 2 秒从预备列表插入一条数据到显示列表
  useEffect(() => {
    if (pendingLocations.length === 0) return;

    const interval = setInterval(() => {
      setDisplayedLocations((prev) => {
        if (pendingLocations.length > 0) {
          const newLocation = pendingLocations[0];
          // 插入新数据到顶部，限制显示列表最多 8 条
          const newDisplayed = [newLocation, ...prev].slice(0, 8);
          // 从预备列表移除已插入的数据
          setPendingLocations((pending) => pending.slice(1));
          return newDisplayed;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [pendingLocations]);

  // 动画配置
  const itemVariants = {
    initial: { opacity: 0, scale: 0.1, x: "25%", y: "25%" }, // 从中心缩放
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    // exit: { opacity: 0, transition: { duration: 0.3 } }, // 渐出
  };

  return (
    <div
      className={`flex-1 overflow-y-auto ${className}`}
      style={{ minHeight: "200px", maxHeight: "80vh" }}
    >
      <AnimatePresence initial={false}>
        {displayedLocations.length > 0 &&
          displayedLocations.map((loc) => (
            <motion.div
              key={generateUniqueKey(loc)}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="mb-2 flex w-full items-center justify-start gap-3 rounded-lg border p-3 text-xs shadow-inner backdrop-blur-xl sm:w-60"
            >
              <ReactCountryFlag
                style={{ fontSize: "16px" }}
                countryCode={loc.country || "US"}
              />
              <div>
                <div className="flex items-center gap-1">
                  <Link
                    className="text-sm font-semibold"
                    href={`https://${loc.userUrl?.prefix}/${loc.userUrl?.url}`}
                    target="_blank"
                  >
                    {loc.userUrl?.url}
                  </Link>
                  <span className="font-semibold">·</span>
                  <span className="text-muted-foreground">
                    {formatTime(loc.updatedAt?.toString() || "")}
                  </span>
                </div>
                {loc.browser && loc.browser !== "Unknown" && (
                  <div className="mt-1 line-clamp-1 break-words font-medium text-muted-foreground">
                    {loc.browser}
                    {loc.device &&
                      loc.device !== "Unknown" &&
                      `${", "}${loc.device}`}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default RealtimeLogs;
