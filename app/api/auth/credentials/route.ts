import { NextRequest } from "next/server";

import { prisma } from "@/lib/db";
import { getMultipleConfigs } from "@/lib/dto/system-config";
import { hashPassword, verifyPassword } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return Response.json("email and password is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      const configs = await getMultipleConfigs(["enable_user_registration"]);
      if (!configs.enable_user_registration) {
        return Response.json("User registration is disabled", { status: 403 });
      }
      const newUser = await prisma.user.create({
        data: {
          name: "",
          email,
          password: hashPassword(password),
          active: 1,
          role: "USER",
          team: "free",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      return Response.json(newUser, { status: 200 });
    } else {
      if (user.active === 0) {
        return Response.json(null, { status: 403 });
      }
      const passwordCorrect = verifyPassword(password, user.password || "");
      if (passwordCorrect) {
        return Response.json(user, { status: 200 });
      }
    }

    return Response.json(null, { status: 400 });
  } catch (error) {
    console.error("[Auth Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
