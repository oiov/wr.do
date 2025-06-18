"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import { userPasswordSchema } from "@/lib/validations/user";

export type FormData = {
  password: string;
};

export async function updateUserPassword(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { password } = userPasswordSchema.parse(data);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashPassword(password),
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
