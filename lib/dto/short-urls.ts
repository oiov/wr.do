import { auth } from "@/auth";
import { UrlMeta } from "@prisma/client";

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

export async function getUserShortUrls(userId: string, active: number = 1) {
  return await prisma.userUrl.findMany({
    where: {
      userId,
      active,
    },
  });
}

export async function getUserShortUrlCount(userId: string, active: number = 1) {
  try {
    return await prisma.userUrl.count({
      where: {
        userId,
        active,
      },
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

export async function createUserShortUrlMeta(
  data: Omit<UrlMeta, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const meta = await prisma.urlMeta.count({
      where: {
        ip: data.ip,
        urlId: data.urlId,
      },
    });

    if (meta > 0) {
      await prisma.urlMeta.update({
        where: {
          ip: data.ip,
          urlId: data.urlId,
        },
        data: {
          click: {
            increment: 1,
          },
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      const res = await prisma.urlMeta.create({
        data,
      });
      return { status: "success", data: res };
    }
  } catch (error) {
    return { status: error };
  }
}
