// app/api/logs/route.ts
import { NextRequest } from "next/server";

import { getScrapeStatsByUserId } from "@/lib/dto/scrape";

export interface LogsResponse {
  logs: {
    id: string;
    type: string;
    ip: string;
    link: string;
    createdAt: Date;
  }[];
  total: number;
  hasMore: boolean;
}

export interface LogsQueryParams {
  userId: string;
  page?: number;
  type?: string;
  ip?: string;
  limit?: number;
}

const rateLimit = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1分钟窗口
  const maxRequests = 60; // 每分钟最大请求数

  const current = rateLimit.get(ip) || { count: 0, timestamp: now };

  // 重置过期的窗口
  if (now - current.timestamp > windowMs) {
    current.count = 0;
    current.timestamp = now;
  }

  // 增加计数
  current.count++;
  rateLimit.set(ip, current);

  return current.count <= maxRequests;
}

export async function GET(request: NextRequest) {
  try {
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "Content-Type": "application/json",
          },
        },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const queryParams: LogsQueryParams = {
      userId: searchParams.get("userId") || "",
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      type: searchParams.get("type") || undefined,
      ip: searchParams.get("ip") || undefined,
    };

    // 参数验证
    if (!queryParams.userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    if (queryParams.page && (isNaN(queryParams.page) || queryParams.page < 1)) {
      return Response.json({ error: "Invalid page number" }, { status: 400 });
    }

    const data = await getScrapeStatsByUserId(queryParams);

    // 构造响应
    const response: LogsResponse = {
      logs: data.logs,
      total: data.total,
      hasMore: data.hasMore,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        // CORS 头部
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);

    return Response.json(
      {
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
