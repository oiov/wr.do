import { prisma } from "@/lib/db";

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
