import { User } from "@prisma/client";

import { prisma } from "@/lib/db";

export interface UpdateUserForm extends Omit<User, "id" | "createdAt"> {}

export const ROLE_ENUM = [
  {
    label: "User",
    value: "USER",
  },
  {
    label: "Admin",
    value: "ADMIN",
  },
];

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

export const getAllUsers = async () => {
  try {
    // TODO: paginate
    const users = await prisma.user.findMany();
    return users;
  } catch {
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
