import { User, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

import { hashPassword, verifyPassword } from "../utils";

export interface UpdateUserForm
  extends Omit<User, "id" | "createdAt" | "updatedAt" | "emailVerified"> {}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        emailVerified: true,
        active: true,
        team: true,
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

export const getAllUsers = async (
  page: number,
  size: number,
  email?: string,
  userName?: string,
) => {
  try {
    let options;
    if (email) {
      options = { where: { email: { contains: email } } };
    }
    if (userName) {
      options = { where: { name: { contains: userName } } };
    }
    if (email && userName) {
      options = {
        where: { email: { contains: email }, name: { contains: userName } },
      };
    }

    const [total, list] = await prisma.$transaction([
      prisma.user.count(options),
      prisma.user.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          createdAt: "desc",
        },
        ...options,
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

export async function setFirstUserAsAdmin(userId: string) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.ADMIN },
    });
  } catch (error) {
    return null;
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
    // 1. 验证用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!existingUser) {
      throw new Error("用户不存在");
    }

    // 2. 准备更新数据
    const updateData: Partial<UpdateUserForm> = {};

    // 3. 处理基础字段
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) {
      // 检查邮箱是否已被其他用户使用
      if (data.email !== existingUser.email) {
        const emailExists = await prisma.user.findFirst({
          where: {
            email: data.email,
            id: { not: userId },
          },
        });
        if (emailExists) {
          throw new Error("邮箱已被使用");
        }
      }
      updateData.email = data.email;
    }
    if (data.role !== undefined) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.team !== undefined) updateData.team = data.team;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.apiKey !== undefined) updateData.apiKey = data.apiKey;

    // 4. 处理密码更新
    if (data.password) {
      const trimmedPassword = data.password.trim();

      // 检查新密码是否与当前密码相同
      const isSamePassword = verifyPassword(
        trimmedPassword,
        existingUser.password || "",
      );

      if (!isSamePassword) {
        updateData.password = hashPassword(trimmedPassword);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return existingUser;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        team: true,
        image: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("更新用户失败:", error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("更新用户时发生未知错误");
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

export function getFirstAdminUser() {
  return prisma.user.findFirst({
    where: { role: UserRole.ADMIN, email: { not: "admin@admin.com" } },
    select: { email: true },
  });
}
