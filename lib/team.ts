import { PrismaClient } from "@prisma/client";

import { prisma } from "../lib/db";

type TimeRangeType = "day" | "month";

interface RestrictOptions {
  model: keyof PrismaClient;
  userId: string;
  limit: number;
  rangeType: TimeRangeType;
  referenceDate?: Date;
}

export async function restrictByTimeRange({
  model,
  userId,
  limit,
  rangeType,
  referenceDate,
}: RestrictOptions) {
  const now = referenceDate || new Date();

  let start: Date;
  let end: Date;

  if (rangeType === "day") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
  } else if (rangeType === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else {
    return {
      status: 400,
      statusText: `Invalid range type: ${rangeType}`,
    };
  }

  const modelInstance = prisma[model] as any;

  if (!modelInstance) {
    return {
      status: 400,
      statusText: `Invalid model: ${model.toString()}`,
    };
  }

  const count = await modelInstance.count({
    where: {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  if (count >= limit) {
    return {
      status: 409,
      statusText: `You have exceeded the ${rangeType}ly ${model.toString()} usage limit (${limit}). Please try again later.`,
    };
  }
  return null;
}
