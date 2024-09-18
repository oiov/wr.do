import { auth } from "@/auth";

import { prisma } from "@/lib/db";

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
