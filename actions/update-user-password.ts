"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { hash } from "bcrypt";

import { prisma } from "@/lib/db";
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
        password: await hash(password, 10),
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
