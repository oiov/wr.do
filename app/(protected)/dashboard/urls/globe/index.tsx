"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { differenceInMinutes, format } from "date-fns";
import { useTranslations } from "next-intl";

import { DAILY_DIMENSION_ENUMS } from "@/lib/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RealtimeChart } from "./realtime-chart";
import RealtimeLogs from "./realtime-logs";

const RealtimeGlobe = dynamic(() => import("./realtime-globe"), { ssr: false });

export interface Location {
  latitude: number;
  longitude: number;
  count: number;
  city?: string;
  country?: string;
  lastUpdate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  device?: string;
  browser?: string;
  userUrl?: {
    url: string;
    target: string;
    prefix: string;
  };
}

interface DatabaseLocation {
  latitude: number;
  longitude: number;
  count: number;
  city: string;
  country: string;
  lastUpdate: Date;
  updatedAt: Date;
  createdAt: Date;
  device?: string;
  browser?: string;
  userUrl?: {
    url: string;
    target: string;
    prefix: string;
  };
}

interface ChartData {
  time: string;
  count: number;
}

function date2unix(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export default function Realtime({ isAdmin = false }: { isAdmin?: boolean }) {
  const mountedRef = useRef(true);
  const locationDataRef = useRef<Map<string, Location>>(new Map());
  const lastUpdateRef = useRef<string>();
  const realtimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeRange, setTimeRange] = useState<string>("30min");
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      startAt: date2unix(new Date(now.getTime() - 30 * 60 * 1000)),
      endAt: date2unix(now),
    };
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState({
    totalClicks: 0,
    uniqueLocations: 0,
    rawRecords: 0,
    lastFetch: new Date().toISOString(),
  });

  const createLocationKey = (lat: number, lng: number) => {
    return `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`;
  };

  const processChartDataOptimized = (locations: Location[]): ChartData[] => {
    const validLocations = locations.filter((loc) => loc.createdAt);
    if (validLocations.length === 0) return [];

    // 如果数据量很少，直接按原始时间点展示
    if (validLocations.length <= 10) {
      return validLocations.map((loc, index) => ({
        time: format(new Date(loc.createdAt!), "HH:mm:ss"),
        count: loc.count,
      }));
    }

    // 否则使用智能分组
    const dates = validLocations.map((loc) => new Date(loc.createdAt!));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    const totalMinutes = differenceInMinutes(maxDate, minDate);

    // 根据数据量和时间跨度动态调整分组
    const targetGroups = Math.min(validLocations.length, 20); // 目标分组数量
    let groupMinutes: number;

    if (totalMinutes <= 60) {
      groupMinutes = Math.max(1, Math.ceil(totalMinutes / targetGroups));
    } else {
      groupMinutes = Math.max(5, Math.ceil(totalMinutes / targetGroups));
    }

    const groupByFn = (date: Date) => {
      const minutes =
        Math.floor(date.getMinutes() / groupMinutes) * groupMinutes;
      const grouped = new Date(date);
      grouped.setMinutes(minutes, 0, 0);
      return grouped;
    };

    const groupedData = new Map<string, number>();
    validLocations.forEach((loc) => {
      const date = new Date(loc.createdAt!);
      const groupedDate = groupByFn(date);
      const key = groupedDate.getTime().toString();
      groupedData.set(key, (groupedData.get(key) || 0) + loc.count);
    });

    return Array.from(groupedData.entries())
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([key, count]) => ({
        time: format(new Date(parseInt(key)), "MM-dd HH:mm"),
        count: count,
      }));
  };

  const appendLocationData = (
    newData: DatabaseLocation[],
    isInitialLoad = false,
  ) => {
    const locationMap = isInitialLoad
      ? new Map()
      : new Map(locationDataRef.current);
    let totalNewClicks = 0;

    newData.forEach((item) => {
      const lat = Math.round(item.latitude * 100) / 100;
      const lng = Math.round(item.longitude * 100) / 100;
      const key = createLocationKey(lat, lng);
      const clickCount = item.count || 1;

      if (locationMap.has(key)) {
        const existing = locationMap.get(key)!;
        existing.count += clickCount;
        existing.lastUpdate = new Date(item.lastUpdate);
      } else {
        locationMap.set(key, {
          lat,
          lng,
          count: clickCount,
          city: item.city,
          country: item.country,
          lastUpdate: new Date(item.lastUpdate),
          device: item.device,
          browser: item.browser,
          userUrl: item.userUrl,
          updatedAt: item.updatedAt,
          createdAt: item.createdAt,
        });
      }
      totalNewClicks += clickCount;
    });

    locationDataRef.current = locationMap;
    const updatedLocations = Array.from(locationMap.values());
    const totalCount = updatedLocations.reduce(
      (sum, loc) => sum + loc.count,
      0,
    );

    const normalizedLocations = updatedLocations.map((loc) => ({
      ...loc,
      count: Math.max(0.1, loc.count / Math.max(totalCount, 1)),
    }));

    const chartData = processChartDataOptimized(updatedLocations);

    return {
      locations: normalizedLocations,
      chartData,
      totalNewClicks,
      totalCount,
    };
  };

  const getLiveLocations = async (isInitialLoad = true) => {
    try {
      const params = new URLSearchParams({
        startAt: time.startAt.toString(),
        endAt: time.endAt.toString(),
        isAdmin: isAdmin ? "true" : "false",
        ...filters,
      });

      const response = await fetch(`/api/url/admin/locations?${params}`);
      const result = await response.json();

      if (result.error) {
        // console.error("API Error:", result.error);
        return;
      }

      const rawData: DatabaseLocation[] = result.data || [];
      const {
        locations: processedLocations,
        chartData,
        totalNewClicks,
        totalCount,
      } = appendLocationData(rawData, isInitialLoad);

      setStats({
        totalClicks: result.totalClicks || totalCount,
        uniqueLocations: processedLocations.length,
        rawRecords: result.rawRecords || rawData.length,
        lastFetch: result.timestamp,
      });

      if (mountedRef.current) {
        setLocations(processedLocations);
        setChartData(chartData);
        lastUpdateRef.current = result.timestamp;
      }

      if (!isInitialLoad) {
        rawData.forEach((item, index) => {
          setTimeout(() => {
            if (mountedRef.current) {
              createTrafficEvent(
                item.latitude,
                item.longitude,
                item.city || "Unknown",
              );
            }
          }, index * 100);
        });
      }
    } catch (error) {
      console.error("Error fetching live locations:", error);
      if (mountedRef.current) {
        setLocations([]);
        setChartData([]);
      }
    }
  };

  const getRealtimeUpdates = async () => {
    try {
      const response = await fetch("/api/url/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastUpdate: lastUpdateRef.current,
          startAt: time.startAt,
          endAt: time.endAt,
          isAdmin,
          ...filters,
        }),
      });

      const result = await response.json();

      if (result.error || !result.data || result.data.length === 0) {
        return;
      }

      const {
        locations: processedLocations,
        chartData,
        totalNewClicks,
      } = appendLocationData(result.data, false);

      setStats((prev) => ({
        totalClicks: prev.totalClicks + totalNewClicks,
        uniqueLocations: processedLocations.length,
        rawRecords: prev.rawRecords + result.data.length,
        lastFetch: result.timestamp,
      }));

      if (mountedRef.current) {
        setLocations(processedLocations);
        setChartData(chartData);
        lastUpdateRef.current = result.timestamp;

        result.data.forEach((item: DatabaseLocation, index: number) => {
          setTimeout(() => {
            if (mountedRef.current) {
              createTrafficEvent(
                item.latitude,
                item.longitude,
                item.city || "Unknown",
              );
            }
          }, index * 100);
        });
      }
    } catch (error) {
      console.error("Error fetching realtime updates:", error);
    }
  };

  const resetLocationData = () => {
    locationDataRef.current.clear();
    setLocations([]);
    setChartData([]);
    setStats({
      totalClicks: 0,
      uniqueLocations: 0,
      rawRecords: 0,
      lastFetch: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (!mountedRef.current) return;

    realtimeIntervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        getRealtimeUpdates();
      }
    }, 5000);

    return () => {
      if (realtimeIntervalRef.current) {
        clearInterval(realtimeIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mountedRef.current) {
      resetLocationData();
      getLiveLocations(true);
    }
  }, [time, filters]);

  useEffect(() => {
    const restoreTimeRange = () => {
      setTimeRange("30min");
      const now = new Date();
      setTime({
        startAt: date2unix(new Date(now.getTime() - 30 * 60 * 1000)),
        endAt: date2unix(now),
      });
    };

    (window as any).restoreTimeRange = restoreTimeRange;

    const interval = setInterval(
      () => {
        if (mountedRef.current) {
          restoreTimeRange();
        }
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(interval);
      delete (window as any).restoreTimeRange;
    };
  }, []);

  const handleTrafficEventRef = useRef<
    (lat: number, lng: number, city: string) => void
  >(() => {});

  const createTrafficEvent = (lat: number, lng: number, city: string) => {
    if (handleTrafficEventRef.current) {
      handleTrafficEventRef.current(lat, lng, city);
    }
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    const now = new Date();
    const selectedRange = DAILY_DIMENSION_ENUMS.find((e) => e.value === value);
    if (!selectedRange) return;

    const minutes = selectedRange.key;
    const startAt = date2unix(new Date(now.getTime() - minutes * 60 * 1000));
    const endAt = date2unix(now);

    setTime({ startAt, endAt });
  };

  return (
    <div className="relative w-full">
      <div className="sm:relative sm:p-4">
        <RealtimeTimePicker
          timeRange={timeRange}
          setTimeRange={handleTimeRangeChange}
        />
        <RealtimeChart
          className="left-0 top-9 z-10 rounded-t-none text-left sm:absolute"
          chartData={chartData}
          totalClicks={stats.totalClicks}
        />
        <RealtimeGlobe
          time={time}
          filters={filters}
          locations={locations}
          stats={stats}
          setHandleTrafficEvent={(fn) => (handleTrafficEventRef.current = fn)}
        />
        <RealtimeLogs
          className="right-0 top-0 z-10 sm:absolute"
          locations={locations}
        />
      </div>
    </div>
  );
}

export function RealtimeTimePicker({
  timeRange,
  setTimeRange,
}: {
  timeRange: string;
  setTimeRange: (value: string) => void;
}) {
  const t = useTranslations("Components");
  return (
    <Select onValueChange={setTimeRange} name="time range" value={timeRange}>
      <SelectTrigger className="left-0 top-0 z-10 h-9 rounded-b-none border-b-0 bg-transparent text-left backdrop-blur-2xl sm:absolute sm:w-[326px]">
        <SelectValue placeholder="Select a time range" />
      </SelectTrigger>
      <SelectContent>
        {DAILY_DIMENSION_ENUMS.map((e, i) => (
          <div key={e.value}>
            <SelectItem value={e.value}>
              <span className="flex items-center gap-1">{t(e.label)}</span>
            </SelectItem>
            {i % 2 === 0 && i !== DAILY_DIMENSION_ENUMS.length - 1 && (
              <SelectSeparator />
            )}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
