import { User, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

export interface UpdateUserForm
  extends Omit<User, "id" | "createdAt" | "updatedAt" | "emailVerified"> {}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        emailVerified: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

export const getAllUsers = async (page: number, size: number) => {
  try {
    const [total, list] = await prisma.$transaction([
      prisma.user.count(), // 获取所有用户的总数
      prisma.user.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);
    return {
      total,
      list,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function getAllUsersCount() {
  try {
    return await prisma.user.count();
  } catch (error) {
    return -1;
  }
}

export async function getAllUsersActiveApiKeyCount() {
  try {
    return await prisma.user.count({ where: { apiKey: { not: null } } });
  } catch (error) {
    return -1;
  }
}

export const updateUser = async (userId: string, data: UpdateUserForm) => {
  try {
    const session = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
    return session;
  } catch (error) {
    return null;
  }
};

export const deleteUserById = async (userId: string) => {
  try {
    const session = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return session;
  } catch (error) {
    return null;
  }
};

export function checkUserStatus(user: any) {
  if (!user?.id) {
    throw new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }
  if (user.active === 0) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "Forbidden",
    });
  }
  return user;
}
