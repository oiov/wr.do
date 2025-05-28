import { NextRequest, NextResponse } from "next/server";
import { create } from "lodash";

import { prisma } from "@/lib/db";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = searchParams.get("isAdmin");
    if (isAdmin === "true") {
      if (user.role !== "ADMIN") {
        return Response.json("Unauthorized", {
          status: 401,
          statusText: "Unauthorized",
        });
      }
    }

    const startAtParam = searchParams.get("startAt");
    const endAtParam = searchParams.get("endAt");
    const country = searchParams.get("country");

    let startDate: Date;
    let endDate: Date;

    if (startAtParam && endAtParam) {
      startDate = new Date(parseInt(startAtParam) * 1000);
      endDate = new Date(parseInt(endAtParam) * 1000);
    } else {
      endDate = new Date();
      startDate = new Date(Date.now() - 30 * 60 * 1000); // 30分钟前
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid startAt or endAt parameters");
    }

    const whereClause: any = {
      ...(isAdmin === "true" ? {} : { userUrl: { userId: user.id } }),
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
    };

    if (country && country !== "") {
      whereClause.country = country;
    }

    const rawData = await prisma.urlMeta.findMany({
      where: whereClause,
      select: {
        latitude: true,
        longitude: true,
        click: true,
        city: true,
        country: true,
        device: true,
        browser: true,
        createdAt: true,
        updatedAt: true,
        userUrl: {
          select: {
            url: true,
            target: true,
            prefix: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 2000,
    });

    // console.log("Raw data fetched:", rawData.length, "records");

    const locationMap = new Map<
      string,
      {
        latitude: number;
        longitude: number;
        count: number;
        city: string;
        country: string;
        lastUpdate: Date;
        updatedAt: Date;
        createdAt: Date;
        device: string;
        browser: string;
        userUrl: {
          url: string;
          target: string;
          prefix: string;
        };
      }
    >();

    rawData.forEach((item) => {
      if (item.latitude && item.longitude) {
        const lat = Math.round(Number(item.latitude) * 100) / 100;
        const lng = Math.round(Number(item.longitude) * 100) / 100;
        const key = `${lat},${lng},${item.createdAt},${item.userUrl.url},${item.userUrl.prefix}`;

        if (locationMap.has(key)) {
          const existing = locationMap.get(key)!;
          existing.count += item.click || 1;
          if (item.updatedAt > existing.lastUpdate) {
            existing.lastUpdate = item.updatedAt;
            existing.city = item.city || existing.city;
            existing.country = item.country || existing.country;
          }
        } else {
          locationMap.set(key, {
            latitude: lat,
            longitude: lng,
            count: item.click || 1,
            city: item.city || "",
            country: item.country || "",
            lastUpdate: item.updatedAt,
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
            device: item.device || "",
            browser: item.browser || "",
            userUrl: item.userUrl,
          });
        }
      }
    });

    const aggregatedData = Array.from(locationMap.values()).sort(
      (a, b) => b.count - a.count,
    );
    // .slice(0, 500);

    const totalClicks = aggregatedData.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const uniqueLocations = aggregatedData.length;

    return NextResponse.json({
      data: aggregatedData,
      total: uniqueLocations,
      totalClicks,
      rawRecords: rawData.length,
      timeRange: {
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching location data:", error);
    return NextResponse.json(
      {
        data: [],
        total: 0,
        totalClicks: 0,
        rawRecords: 0,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch location data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// POST endpoint remains the same
export async function POST(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const body = await request.json();
    const { lastUpdate, isAdmin } = body;

    if (isAdmin) {
      if (user.role !== "ADMIN") {
        return Response.json("Unauthorized", {
          status: 401,
          statusText: "Unauthorized",
        });
      }
    }

    const sinceDate = lastUpdate
      ? new Date(lastUpdate)
      : new Date(Date.now() - 5000);

    // console.log("lastUpdate", lastUpdate, sinceDate);

    if (isNaN(sinceDate.getTime())) {
      throw new Error("Invalid lastUpdate parameter");
    }

    const whereClause: any = {
      ...(isAdmin ? {} : { userUrl: { userId: user.id } }),
      createdAt: {
        gt: sinceDate,
      },
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
    };

    const newData = await prisma.urlMeta.findMany({
      where: whereClause,
      select: {
        latitude: true,
        longitude: true,
        click: true,
        city: true,
        country: true,
        device: true,
        browser: true,
        createdAt: true,
        updatedAt: true,
        userUrl: {
          select: {
            url: true,
            target: true,
            prefix: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });

    // console.log("Realtime updates fetched:", newData.length, "records");

    return NextResponse.json({
      data: newData,
      count: newData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching realtime updates:", error);
    return NextResponse.json(
      {
        data: [],
        count: 0,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch realtime updates",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
