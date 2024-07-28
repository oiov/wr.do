"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { createUserRecordSchema } from "@/lib/validations/record";

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
  created_on: string;
  modified_on: string;
  active: number;
};

export async function createUserRecord(
  userId: string,
  data: UserRecordFormData,
) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

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
        userId: session?.user.id,
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
    // console.log(error)
    return { status: error };
  }
}

export async function getUserRecords(userId: string, active: number = 1) {
  return await prisma.userRecord.findMany({
    where: {
      userId: userId,
      active,
    },
  });
}

export async function getUserRecordCount(userId: string, active: number = 1) {
  return await prisma.userRecord.count({
    where: {
      userId: userId,
      active,
    },
  });
}

export async function getUserRecordByTypeNameContent(
  userId: string,
  type: string,
  name: string,
  content: string,
  active: number = 1,
) {
  return await prisma.userRecord.findMany({
    where: {
      userId,
      type,
      content,
      // name,
      active,
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
      active,
    },
  });
}

export async function updateUserRecord(
  userId: string,
  data: UserRecordFormData,
) {
  return await prisma.userRecord.update({
    where: {
      userId,
      record_id: data.record_id,
      zone_id: data.zone_id,
      active: data.active,
    },
    data: {
      type: data.type,
      name: data.name,
      content: data.content,
      ttl: data.ttl,
      comment: data.comment,
      proxied: data.proxied,
      modified_on: new Date().toISOString(),
    },
  });
}
export async function updateUserRecordState(
  userId: string,
  record_id: string,
  zone_id: string,
  active: number,
) {
  return await prisma.userRecord.update({
    where: {
      userId,
      record_id,
      zone_id,
    },
    data: {
      active,
    },
  });
}
