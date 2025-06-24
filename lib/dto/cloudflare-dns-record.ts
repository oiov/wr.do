"use server";

import { User, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  createUserRecordSchema,
  updateUserRecordSchema,
} from "@/lib/validations/record";

export type UserRecordFormData = {
  id?: string; // null on created
  userId?: string; // null on created
  record_id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: string;
  content: string;
  ttl: number;
  proxied: boolean;
  proxiable: boolean;
  comment: string;
  tags: string;
  created_on?: string;
  modified_on?: string;
  active: number; // 0: inactive, 1: active, 2: pending, 3: rejected
  user: Pick<User, "name" | "email">;
};

export async function createUserRecord(
  userId: string,
  data: Omit<UserRecordFormData, "user">,
) {
  try {
    const {
      record_id,
      zone_id,
      zone_name,
      name,
      type,
      content,
      ttl,
      proxied,
      proxiable,
      comment,
      tags,
      created_on,
      modified_on,
      active,
    } = createUserRecordSchema.parse(data);

    const res = await prisma.userRecord.create({
      data: {
        userId,
        record_id,
        zone_id,
        zone_name,
        name,
        type,
        content,
        ttl,
        proxied,
        proxiable,
        comment,
        tags,
        created_on,
        modified_on,
        active,
      },
    });

    // revalidatePath('/dashboard/settings');
    return { status: "success", data: res };
  } catch (error) {
    // console.log(error);
    return { status: error };
  }
}

export async function updateUserRecordReview(
  userId: string,
  id: string,
  data: Omit<UserRecordFormData, "user">,
) {
  try {
    const {
      record_id,
      zone_id,
      zone_name,
      name,
      type,
      content,
      ttl,
      proxied,
      proxiable,
      comment,
      tags,
      created_on,
      modified_on,
      active,
    } = createUserRecordSchema.parse(data);

    const res = await prisma.userRecord.update({
      where: {
        id,
      },
      data: {
        userId,
        record_id,
        zone_id,
        zone_name,
        name,
        type,
        content,
        ttl,
        proxied,
        proxiable,
        comment,
        tags,
        created_on,
        modified_on,
        active,
      },
    });
    return { status: "success", data: res };
  } catch (error) {
    console.log(error);
    return { status: error };
  }
}

export async function getUserRecords(
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
          // active: {
          //   not: 2,
          // },
        }
      : {
          // active: {
          //   not: 2,
          // },
        };
  const [total, list] = await prisma.$transaction([
    prisma.userRecord.count({
      where: option,
    }),
    prisma.userRecord.findMany({
      where: option,
      skip: (page - 1) * size,
      take: size,
      select: {
        id: true,
        record_id: true,
        zone_id: true,
        zone_name: true,
        name: true,
        type: true,
        content: true,
        ttl: true,
        proxied: true,
        proxiable: true,
        comment: true,
        tags: true,
        created_on: true,
        modified_on: true,
        active: true,
        userId: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        modified_on: "desc",
      },
    }),
  ]);
  return {
    total,
    list,
  };
}

export async function getUserRecordCount(
  userId: string,
  active: number = 1,
  role: UserRole = "USER",
) {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const [total, month_total] = await prisma.$transaction([
      prisma.userRecord.count({
        where: role === "USER" ? { userId } : {},
      }),
      prisma.userRecord.count({
        where:
          role === "USER"
            ? { userId, created_on: { gte: start, lte: end } }
            : { created_on: { gte: start, lte: end } },
      }),
    ]);

    return { total, month_total };
  } catch (error) {
    return { total: -1, month_total: -1 };
  }
}

export async function getUserRecordStatus(
  userId: string,
  role: UserRole = "USER",
) {
  const whereCondition = role === "USER" ? { userId } : {};

  const statusCounts = await prisma.userRecord.groupBy({
    by: ["active"],
    where: whereCondition,
    _count: {
      _all: true,
    },
  });

  const total = await prisma.userRecord.count({
    where: whereCondition,
  });

  const counts = statusCounts.reduce(
    (acc, item) => {
      // if (!item.active) {
      //   acc[0] = item._count._all;
      //   return acc;
      // }
      acc[item.active ?? 0] = item._count._all;
      return acc;
    },
    {} as Record<number, number>,
  );

  return {
    total,
    inactive: counts[0] || 0,
    active: counts[1] || 0,
    pending: counts[2] || 0,
    rejected: counts[3] || 0,
  };
}

export async function getUserRecordByTypeNameContent(
  userId: string,
  type: string,
  name: string,
  content: string,
  zone_name: string,
  active: number = 1,
) {
  return await prisma.userRecord.findMany({
    where: {
      // userId,
      type,
      // content,
      name,
      zone_name,
      active: {
        not: 3,
      },
    },
  });
}

export async function deleteUserRecord(
  userId: string,
  record_id: string,
  zone_id: string,
  active: number = 1,
) {
  return await prisma.userRecord.delete({
    where: {
      userId,
      record_id,
      zone_id,
      // active,
    },
  });
}

export async function updateUserRecord(
  userId: string,
  data: Omit<UserRecordFormData, "user">,
) {
  try {
    const {
      record_id,
      zone_id,
      zone_name,
      name,
      type,
      content,
      ttl,
      proxied,
      comment,
      tags,
      active,
    } = updateUserRecordSchema.parse(data);

    const res = await prisma.userRecord.update({
      where: {
        userId,
        record_id,
        zone_id,
        zone_name,
        // active: active,
      },
      data: {
        type,
        name,
        content,
        ttl,
        comment,
        tags,
        proxied,
        modified_on: data.modified_on,
      },
    });

    return { status: "success", data: res };
  } catch (error) {
    return { status: error };
  }
}
export async function updateUserRecordState(
  userId: string,
  record_id: string,
  zone_id: string,
  active: number,
) {
  return await prisma.userRecord.update({
    where: {
      // userId,
      record_id,
      zone_id,
    },
    data: {
      active,
    },
  });
}
