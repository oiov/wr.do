import { UrlMeta, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

import { EXPIRATION_ENUMS } from "../enums";
import { getStartDate } from "../utils";

export interface ShortUrlFormData {
  id?: string;
  userId: string;
  userName: string;
  target: string;
  url: string;
  prefix: string;
  visible: number;
  active: number;
  expiration: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    name: string;
    email: string;
  };
}

export interface UserShortUrlInfo extends ShortUrlFormData {
  // meta: Omit<UrlMeta, "id">;
  meta?: UrlMeta;
}

export async function getUserShortUrls(
  userId: string,
  active: number = 1,
  page: number,
  size: number,
  role: UserRole = "USER",
  userName: string = "",
  url: string = "",
  target: string = "",
) {
  let option: any =
    role === "USER"
      ? {
          userId,
        }
      : {};

  if (userName) {
    option.userName = {
      contains: userName,
    };
  }
  if (url) {
    option.url = {
      contains: url,
    };
  }
  if (target) {
    option.target = {
      contains: target,
    };
  }

  const [total, list] = await prisma.$transaction([
    prisma.userUrl.count({
      where: option,
    }),
    prisma.userUrl.findMany({
      where: option,
      skip: (page - 1) * size,
      take: size,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);
  return {
    total,
    list,
  };
}

export async function getUserShortUrlCount(
  userId: string,
  active: number = 1,
  role: UserRole = "USER",
) {
  try {
    // Start of last month from now
    // const end = new Date();
    // const start = new Date(
    //   end.getFullYear(),
    //   end.getMonth() - 1,
    //   end.getDate(),
    //   end.getHours(),
    //   end.getMinutes(),
    //   end.getSeconds(),
    // );

    // Start of current month
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const [total, month_total] = await prisma.$transaction([
      prisma.userUrl.count({
        where: role === "USER" ? { userId } : {},
      }),
      prisma.userUrl.count({
        where:
          role === "USER"
            ? { userId, createdAt: { gte: start, lte: end } }
            : { createdAt: { gte: start, lte: end } },
      }),
    ]);
    return { total, month_total };
  } catch (error) {
    return { total: -1, month_total: -1 };
  }
}

export async function getUserShortLinksByIds(ids: string[], userId?: string) {
  try {
    return await prisma.userUrl.findMany({
      where: {
        id: { in: ids },
        ...(userId && { userId }),
      },
    });
  } catch (error) {
    return [];
  }
}

export async function getUrlClicksByIds(
  ids: string[],
  userId: string,
  role: UserRole,
): Promise<Record<string, number>> {
  if (ids.length === 0) return {};

  try {
    const clicksData = await prisma.urlMeta.groupBy({
      by: ["urlId"],
      where: {
        urlId: { in: ids },
        userUrl: role === "USER" ? { userId } : undefined,
      },
      _sum: { click: true },
    });

    const clicksMap: Record<string, number> = {};
    ids.forEach((id) => (clicksMap[id] = 0)); // 初始化
    clicksData.forEach((item) => {
      clicksMap[item.urlId] = item._sum.click || 0;
    });

    return clicksMap;
  } catch (error) {
    console.error("Error fetching clicks:", error);
    return Object.fromEntries(ids.map((id) => [id, 0]));
  }
}

export async function getUrlStatus(userId: string, role: UserRole = "USER") {
  try {
  } catch (error) {
    return { status: error };
  }
}

export interface UrlStatusStats {
  total: number;
  actived: number; // 正常可用
  disabled: number; // 已禁用
  expired: number; // 已过期
  passwordprotected: number; // 密码保护
}

function isValidExpirationValue(expiration: string): boolean {
  return EXPIRATION_ENUMS.some((item) => item.value === expiration);
}

export async function getUrlStatusOptimized(
  userId: string,
  role: UserRole = "USER",
): Promise<UrlStatusStats | { status: any }> {
  try {
    const whereCondition = role === "USER" ? { userId } : {};

    const urlRecords = await prisma.userUrl.findMany({
      where: whereCondition,
      select: {
        id: true,
        userId: true,
        active: true,
        expiration: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const now = Date.now();
    const stats: UrlStatusStats = {
      total: urlRecords.length,
      actived: 0,
      disabled: 0,
      expired: 0,
      passwordprotected: 0,
    };

    // 遍历记录并分类
    urlRecords.forEach((record) => {
      const updatedAt = new Date(
        record.updatedAt || record.createdAt!,
      ).getTime();

      // 判断是否过期
      let isExpired = false;
      if (
        record.expiration !== "-1" &&
        isValidExpirationValue(record.expiration)
      ) {
        const expirationSeconds = Number(record.expiration);
        const expirationMilliseconds = expirationSeconds * 1000;
        const expirationTime = updatedAt + expirationMilliseconds;
        isExpired = now > expirationTime;
      }

      const isDisabled = record.active === 0;
      const hasPassword = Boolean(record.password && record.password.trim());

      if (isExpired) {
        stats.expired++;
      } else if (isDisabled) {
        stats.disabled++;
      } else if (hasPassword) {
        stats.passwordprotected++;
      } else {
        stats.actived++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting URL status (optimized):", error);
    return { status: error };
  }
}

export async function createUserShortUrl(data: ShortUrlFormData) {
  try {
    const res = await prisma.userUrl.create({
      data: {
        userId: data.userId,
        userName: data.userName || "Anonymous",
        target: data.target,
        url: data.url,
        prefix: data.prefix,
        visible: data.visible,
        active: data.active,
        expiration: data.expiration,
        password: data.password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return { status: "success", data: res };
  } catch (error) {
    return { status: error };
  }
}

export async function updateUserShortUrl(data: ShortUrlFormData) {
  try {
    const res = await prisma.userUrl.update({
      where: {
        id: data.id,
        userId: data.userId,
      },
      data: {
        target: data.target,
        url: data.url,
        visible: data.visible,
        prefix: data.prefix,
        // active: data.active,
        expiration: data.expiration,
        password: data.password,
        updatedAt: new Date().toISOString(),
      },
    });
    return { status: "success", data: res };
  } catch (error) {
    return { status: error };
  }
}

export async function updateUserShortUrlAdmin(
  data: ShortUrlFormData,
  newUserId,
) {
  try {
    const res = await prisma.userUrl.update({
      where: {
        id: data.id,
        userId: data.userId,
      },
      data: {
        userId: newUserId,
        target: data.target,
        url: data.url,
        visible: data.visible,
        prefix: data.prefix,
        // active: data.active,
        expiration: data.expiration,
        password: data.password,
        updatedAt: new Date().toISOString(),
      },
    });
    return { status: "success", data: res };
  } catch (error) {
    return { status: error };
  }
}

export async function updateUserShortUrlActive(
  userId: string,
  id: string,
  active: number = 1,
  role: UserRole = "USER",
) {
  try {
    const option = role === "USER" ? { userId, id } : { id };
    const res = await prisma.userUrl.update({
      where: option,
      data: {
        active,
        updatedAt: new Date().toISOString(),
      },
    });
    return { status: "success", data: res };
  } catch (error) {
    return { status: error };
  }
}

export async function updateUserShortUrlVisibility(
  id: string,
  visible: number,
) {
  try {
    const res = await prisma.userUrl.update({
      where: {
        id,
      },
      data: {
        visible,
        updatedAt: new Date().toISOString(),
      },
    });
    return { status: "success", data: res };
  } catch (error) {
    return { status: error };
  }
}

export async function deleteUserShortUrl(userId: string, urlId: string) {
  return await prisma.userUrl.delete({
    where: {
      id: urlId,
      userId,
    },
  });
}

export async function getUserUrlMetaInfo(
  urlId: string,
  dateRange: string = "",
) {
  const startDate = getStartDate(dateRange);
  return await prisma.urlMeta.findMany({
    where: {
      urlId,
      ...(startDate && {
        createdAt: { gte: startDate },
      }),
    },
    orderBy: { updatedAt: "asc" },
  });
}

export async function getUrlBySuffix(suffix: string) {
  return await prisma.userUrl.findFirst({
    where: {
      url: suffix,
    },
    select: {
      id: true,
      target: true,
      active: true,
      prefix: true,
      expiration: true,
      password: true,
      updatedAt: true,
    },
  });
}

// meta
export async function createUserShortUrlMeta(
  data: Omit<UrlMeta, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const meta = await findOrCreateUrlMeta(data);
    return { status: "success", data: meta };
  } catch (error) {
    console.error("create meta error", error);
    return { status: "error", message: error.message };
  }
}

async function findOrCreateUrlMeta(data) {
  const meta = await prisma.urlMeta.findFirst({
    where: {
      ip: data.ip,
      urlId: data.urlId,
    },
  });

  if (meta) {
    return await incrementClick(meta.id);
  } else {
    return await prisma.urlMeta.create({ data });
  }
}

async function incrementClick(id) {
  return await prisma.urlMeta.update({
    where: { id },
    data: {
      click: { increment: 1 },
      updatedAt: new Date(), // Prisma will handle the ISO string conversion
    },
  });
}

export async function getUrlMetaLiveLog(userId?: string) {
  const whereClause = userId ? { userUrl: { userId } } : {};

  const logs = await prisma.urlMeta.findMany({
    take: 10,
    where: whereClause,
    orderBy: { updatedAt: "desc" },
    select: {
      ip: true,
      click: true,
      updatedAt: true,
      createdAt: true,
      city: true,
      country: true,
      os: true,
      cpu: true,
      engine: true,
      userUrl: {
        select: {
          url: true,
          target: true,
        },
      },
    },
  });

  const formattedLogs = logs.map((log) => ({
    ...log,
    slug: log.userUrl.url,
    target: log.userUrl.target,
  }));

  return formattedLogs;
}
