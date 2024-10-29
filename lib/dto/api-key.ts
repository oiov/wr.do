import crypto from "crypto";

import { prisma } from "@/lib/db";

export const getApiKeyByUserId = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { apiKey: true },
  });
};

export const checkApiKey = async (apiKey: string) => {
  return prisma.user.findFirst({
    where: { apiKey },
    select: { id: true },
  });
};

export const generateApiKey = async (userId: string) => {
  const apiKey = crypto.randomUUID();
  return prisma.user.update({
    where: { id: userId },
    data: { apiKey },
    select: { apiKey: true },
  });
};
