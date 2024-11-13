import { ScrapeMeta } from "@prisma/client";

import { prisma } from "@/lib/db";

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

export async function getScrapeStatsByType(type: string) {
  return await prisma.scrapeMeta.findMany({
    where: {
      type,
    },
  });
}
