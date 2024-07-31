import { auth } from "@/auth";
import { UrlMeta, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

export interface ShortUrlFormData {
  id?: string;
  userId: string;
  userName: string;
  target: string;
  url: string;
  visible: number;
  active: number;
  created_at?: string;
  updated_at?: string;
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
) {
  const option =
    role === "USER"
      ? {
          userId,
          active,
        }
      : {};
  const [total, list] = await prisma.$transaction([
    prisma.userUrl.count({
      where: option,
    }),
    prisma.userUrl.findMany({
      where: option,
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        updatedAt: "asc",
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
    return await prisma.userUrl.count({
      where:
        role === "USER"
          ? {
              userId,
              active,
            }
          : {},
    });
  } catch (error) {
    return -1;
  }
}

export async function createUserShortUrl(data: ShortUrlFormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const res = await prisma.userUrl.create({
      data: {
        userId: session.user?.id!,
        userName: session.user?.name || "Anonymous",
        target: data.target,
        url: data.url,
        visible: data.visible,
        active: data.active,
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
        active: data.active,
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

export async function getUserUrlMetaInfo(urlId: string) {
  return await prisma.urlMeta.findMany({
    where: {
      urlId,
    },
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
