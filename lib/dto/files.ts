import { Prisma, UserFile } from "@prisma/client";

import { prisma } from "../db";
import { bytesToStorageValue, storageValueToBytes } from "../utils";

export interface UserFileData extends UserFile {
  user: {
    name: string;
    email: string;
  };
}

export interface CreateUserFileInput {
  userId: string;
  name: string;
  originalName?: string;
  mimeType: string;
  size: number;
  path: string;
  etag?: string;
  storageClass?: string;
  channel: string;
  platform: string;
  providerName: string;
  bucket: string;
  shortUrlId?: string;
  lastModified: Date;
}

export interface UpdateUserFileInput {
  name?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  path?: string;
  etag?: string;
  storageClass?: string;
  channel?: string;
  platform?: string;
  providerName?: string;
  bucket?: string;
  shortUrlId?: string;
  status?: number;
  lastModified?: Date;
}

export interface QueryUserFileOptions {
  bucket?: string;
  userId?: string;
  providerName?: string;
  status?: number;
  channel?: string;
  platform?: string;
  shortUrlId?: string;
  name?: string;
  size?: number;
  mimeType?: string;
  page?: number;
  limit?: number;
  orderBy?: "createdAt" | "lastModified" | "size";
  order?: "asc" | "desc";
}

// 创建文件记录
export async function createUserFile(data: CreateUserFileInput) {
  try {
    const userFile = await prisma.userFile.create({
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return { success: true, data: userFile };
  } catch (error) {
    console.error("Failed to create file record:", error);
    return { success: false, error: "Failed to create file record" };
  }
}

// 根据ID查询文件记录
export async function getUserFileById(id: string) {
  try {
    const userFile = await prisma.userFile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return { success: true, data: userFile };
  } catch (error) {
    console.error("Failed to query file record:", error);
    return { success: false, error: "Failed to query file record" };
  }
}

// 条件查询文件记录
export async function getUserFiles(options: QueryUserFileOptions = {}) {
  try {
    const {
      bucket,
      userId,
      providerName,
      status,
      channel,
      platform,
      shortUrlId,
      name,
      size,
      mimeType,
      page = 1,
      limit = 20,
      orderBy = "createdAt",
      order = "desc",
    } = options;

    const where: Prisma.UserFileWhereInput = {
      bucket,
      ...(status !== undefined && { status }),
      ...(userId && { userId }),
      ...(providerName && { providerName }),
      ...(channel && { channel }),
      ...(platform && { platform }),
      ...(shortUrlId && { shortUrlId }),
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(size && { size: { gte: bytesToStorageValue(size) } }),
      ...(mimeType && {
        mimeType: { contains: mimeType, mode: "insensitive" },
      }),
    };

    const [files, total, totalSize] = await Promise.all([
      prisma.userFile.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [orderBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.userFile.count({ where }),
      prisma.userFile.aggregate({
        where: {
          bucket,
          providerName,
          status: 1,
          ...(userId && { userId }),
        },
        _sum: { size: true },
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      total,
      totalSize: storageValueToBytes(totalSize._sum.size || 0),
      totalFiles: totalSize._count.id || 0,
      list: files,
    };
  } catch (error) {
    console.error("[GetUserFiles Error]", error);
    return { success: false, error: "[GetUserFiles Error]" };
  }
}

// 更新文件记录
export async function updateUserFile(id: string, data: UpdateUserFileInput) {
  try {
    const userFile = await prisma.userFile.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return { success: true, data: userFile };
  } catch (error) {
    console.error("Failed to update file record:", error);
    return { success: false, error: "Failed to update file record" };
  }
}

// 软删除文件记录
export async function softDeleteUserFile(id: string) {
  try {
    const userFile = await prisma.userFile.update({
      where: { id },
      data: {
        status: 0,
        updatedAt: new Date(),
      },
    });
    return { success: true, data: userFile };
  } catch (error) {
    console.error("Delete file record failed:", error);
    return { success: false, error: "Delete file record failed" };
  }
}

// 批量软删除
export async function softDeleteUserFiles(ids: string[]) {
  try {
    const result = await prisma.userFile.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status: 0,
        updatedAt: new Date(),
      },
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Delete file records failed:", error);
    return { success: false, error: "Delete file records failed" };
  }
}

// 物理删除文件记录
export async function deleteUserFile(id: string) {
  try {
    const userFile = await prisma.userFile.delete({
      where: { id },
    });
    return { success: true, data: userFile };
  } catch (error) {
    console.error("Delete file record failed:", error);
    return { success: false, error: "Delete file record failed" };
  }
}

// 获取用户文件统计
export async function getUserFileStats(userId: string) {
  try {
    const [totalFiles, totalSize, filesByProvider] = await Promise.all([
      prisma.userFile.count({
        where: { userId, status: 1 },
      }),
      prisma.userFile.aggregate({
        where: { userId, status: 1 },
        _sum: { size: true },
      }),
      prisma.userFile.groupBy({
        by: ["providerName"],
        where: { userId, status: 1 },
        _count: { id: true },
        _sum: { size: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalFiles,
        totalSize: storageValueToBytes(totalSize._sum.size || 0),
        filesByProvider,
      },
    };
  } catch (error) {
    console.error("Failed to get file statistics:", error);
    return { success: false, error: "Failed to get file statistics" };
  }
}

// 根据路径查找文件
export async function getUserFileByPath(path: string, providerName?: string) {
  try {
    const where: Prisma.UserFileWhereInput = {
      path,
      status: 1,
      ...(providerName && { providerName }),
    };

    const userFile = await prisma.userFile.findFirst({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: userFile };
  } catch (error) {
    console.error("Failed to query file record:", error);
    return { success: false, error: "Failed to query file record" };
  }
}

// 根据短链接ID查询文件
export async function getUserFileByShortUrlId(shortUrlId: string) {
  try {
    const userFile = await prisma.userFile.findFirst({
      where: {
        shortUrlId,
        status: 1,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return { success: true, data: userFile };
  } catch (error) {
    console.error("Failed to query file record:", error);
    return { success: false, error: "Failed to query file record" };
  }
}

// 清理过期文件记录
export async function cleanupExpiredFiles(days: number = 30) {
  try {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - days);

    const result = await prisma.userFile.deleteMany({
      where: {
        status: 0,
        updatedAt: {
          lt: expiredDate,
        },
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to clean up expired files:", error);
    return { success: false, error: "Failed to clean up expired files" };
  }
}

// 获取特定存储桶的使用量统计
export async function getBucketStorageUsage(
  bucket: string,
  providerName: string,
  userId?: string,
): Promise<
  | { success: true; data: { totalSize: number; totalFiles: number } }
  | { success: false; error: string }
> {
  try {
    const result = await prisma.userFile.aggregate({
      where: {
        ...(userId && { userId }),
        bucket,
        providerName,
        status: 1,
      },
      _sum: {
        size: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      success: true,
      data: {
        totalSize: storageValueToBytes(result._sum.size || 0),
        totalFiles: result._count.id || 0,
      },
    };
  } catch (error) {
    console.error("Failed to get bucket storage usage:", error);
    return { success: false, error: "Failed to get bucket storage usage" };
  }
}
