import { ScrapeMeta } from "@prisma/client";

import { prisma } from "@/lib/db";

import { getStartDate } from "../utils";

export async function createScrapeMeta(
  data: Omit<ScrapeMeta, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const meta = await findOrCreateScrapeMeta(data);
    return { status: "success", data: meta };
  } catch (error) {
    console.error("create meta error", error);
    return { status: "error", message: error.message };
  }
}

async function findOrCreateScrapeMeta(data) {
  const meta = await prisma.scrapeMeta.findFirst({
    where: {
      ip: data.ip,
      type: data.type,
      link: data.link,
    },
  });

  if (meta) {
    return await incrementClick(meta.id);
  } else {
    return await prisma.scrapeMeta.create({ data });
  }
}

async function incrementClick(id: string) {
  return await prisma.scrapeMeta.update({
    where: { id },
    data: {
      click: { increment: 1 },
      updatedAt: new Date(), // Prisma will handle the ISO string conversion
    },
  });
}

export async function getApiKeyCallCount() {
  try {
    return await prisma.scrapeMeta
      .aggregate({ _sum: { click: true } })
      .then((result) => result._sum.click || 0);
  } catch (error) {
    return -1;
  }
}

export async function getScrapeStatsByType(
  type: string,
  dateRange: string = "",
) {
  const startDate = getStartDate(dateRange);
  return await prisma.scrapeMeta.findMany({
    where: {
      type,
      ...(startDate && {
        createdAt: { gte: startDate },
      }),
    },
  });
}

export async function getScrapeStatsByTypeAndUserId(type: string, id: string) {
  return await prisma.scrapeMeta.findMany({
    where: {
      type,
      userId: id,
    },
  });
}

export async function getScrapeStatsByUserId({
  userId,
  page = 1,
  limit = 20,
  type,
  ip,
}: {
  userId: string;
  page?: number;
  limit?: number;
  type?: string;
  ip?: string;
}) {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(type && { type }),
    ...(ip && { ip }),
  };

  const [total, logs] = await Promise.all([
    prisma.scrapeMeta.count({ where }),
    prisma.scrapeMeta.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        ip: true,
        link: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    logs,
    total,
    hasMore: total > skip + logs.length,
  };
}

export async function getScrapeStatsByUserId1(userId: string) {
  return await prisma.scrapeMeta.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });
}

export async function getScrapeStats({
  page = 1,
  limit = 20,
  type,
  ip,
  name,
  email,
}: {
  page?: number;
  limit?: number;
  type?: string;
  ip?: string;
  name?: string;
  email?: string;
}) {
  const skip = (page - 1) * limit;

  const where = {
    ...(type && { type }),
    ...(ip && { ip }),
    // ...(name && { name }),
    // ...(email && { email }),
    user: {
      ...(name && { name }),
      ...(email && { email }),
    },
  };

  const [total, logs] = await Promise.all([
    prisma.scrapeMeta.count({ where }),
    prisma.scrapeMeta.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        ip: true,
        link: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    logs,
    total,
    hasMore: total > skip + logs.length,
  };
}
