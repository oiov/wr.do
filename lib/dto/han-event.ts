import { auth } from "@/auth";
import { UrlMeta, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function getCheckEventNames() {
  return await prisma.hanEvent.findMany({
    where: {
      type: "check",
    },
    select: {
      name: true,
    },
  });
}

export async function getEventByName(name: string) {
  return await prisma.hanEvent.findFirst({
    where: {
      name,
    },
  });
}
