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

export function getFirstAdminUser() {
  return prisma.user.findFirst({
    where: { role: UserRole.ADMIN },
    select: { email: true },
  });
}
