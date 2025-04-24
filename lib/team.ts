import { PrismaClient } from "@prisma/client";

import { prisma } from "./db";

export const Team_Plan_Quota = {
  free: {
    SL_TrackedClicks: 100000,
    SL_NewLinks: 1000,
    SL_AnalyticsRetention: 180,
    SL_Domains: 2,
    SL_AdvancedAnalytics: true,
    RC_NewRecords: 0,
    EM_EmailAddresses: 1000,
    EM_Domains: 2,
    EM_SendEmails: 200,
    APP_Support: "basic",
    APP_ApiAccess: true,
  },
  premium: {
    SL_TrackedClicks: 1000000,
    SL_NewLinks: 5000,
    SL_AnalyticsRetention: 360,
    SL_Domains: 2,
    SL_AdvancedAnalytics: true,
    RC_NewRecords: 2,
    EM_EmailAddresses: 5000,
    EM_Domains: 2,
    EM_SendEmails: 1000,
    APP_Support: "live",
    APP_ApiAccess: true,
  },
  business: {
    SL_TrackedClicks: 10000000,
    SL_NewLinks: 10000,
    SL_AnalyticsRetention: 360,
    SL_Domains: 2,
    SL_AdvancedAnalytics: true,
    RC_NewRecords: 2,
    EM_EmailAddresses: 10000,
    EM_Domains: 2,
    EM_SendEmails: 2000,
    APP_Support: "live",
    APP_ApiAccess: true,
  },
};

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
      statusText: `You have exceeded the ${rangeType}ly ${model.toString()} creation limit (${limit}). Please try again later.`,
    };
  }
  return null;
}
