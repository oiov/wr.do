import { auth } from "@/auth";
import { HanEvent } from "@prisma/client";

import { prisma } from "@/lib/db";

export interface HanEventFormData
  extends Omit<HanEvent, "id" | "createdAt" | "updatedAt"> {}

export async function getRecordEvents(page: number, size: number) {
  const [total, list] = await prisma.$transaction([
    prisma.hanEvent.count({
      where: {
        type: "record",
      },
    }),
    prisma.hanEvent.findMany({
      where: { type: "record" },
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);
  return { total, list };
}

export async function getCheckEventNames() {
  return await prisma.hanEvent.findMany({
    where: {
      type: "check",
    },
    select: {
      name: true,
      notes: true,
    },
  });
}

export async function getEventByName(name: string) {
  return await prisma.hanEvent.findFirst({
    where: {
      name,
    },
    select: {
      firstOccurredAt: true,
    },
  });
}

export async function createEvent(data: HanEventFormData) {
  try {
    const event = await prisma.hanEvent.create({
      data: {
        name: data.name,
        code: data.code,
        type: data.type,
        notes: data.notes,
        firstOccurredAt: data.firstOccurredAt
          ? new Date(String(data.firstOccurredAt))
          : "",
        lastOccurredAt: data.lastOccurredAt
          ? new Date(String(data.lastOccurredAt))
          : new Date(String(data.firstOccurredAt)),
        location: data.location,
        participants: data.participants,
        photos: data.photos,
        status: data.status,
        importance: data.importance,
        reminder: data.reminder,
        reminderTime: data.reminderTime
          ? new Date(String(data.reminderTime))
          : null,
        recurrent: data.recurrent,
        frequency: data.frequency,
        count: data.count,
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return { status: "success", data: event };
  } catch (error) {
    return { status: error };
  }
}

export async function updateEvent(data: HanEvent) {
  try {
    const event = await prisma.hanEvent.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        code: data.code,
        type: data.type,
        notes: data.notes,
        firstOccurredAt: data.firstOccurredAt
          ? new Date(String(data.firstOccurredAt))
          : "",
        lastOccurredAt: data.lastOccurredAt
          ? new Date(String(data.lastOccurredAt))
          : new Date(String(data.firstOccurredAt)),
        location: data.location,
        participants: data.participants,
        photos: data.photos,
        status: data.status,
        importance: data.importance,
        reminder: data.reminder,
        reminderTime: data.reminderTime
          ? new Date(String(data.reminderTime))
          : null,
        recurrent: data.recurrent,
        frequency: data.frequency,
        tags: data.tags,
        updatedAt: new Date().toISOString(),
      },
    });
    return { status: "success", data: event };
  } catch (error) {
    return { status: error };
  }
}

export async function updateEventCount(id: string) {
  return await prisma.hanEvent.update({
    where: {
      id,
    },
    data: {
      count: {
        increment: 1,
      },
      updatedAt: new Date().toISOString(),
    },
  });
}
