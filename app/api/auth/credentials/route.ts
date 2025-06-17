import { NextRequest } from "next/server";
import { compare, hash } from "bcrypt";

import { prisma } from "@/lib/db";

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
      const newUser = await prisma.user.create({
        data: {
          name: "",
          email,
          password: await hash(password, 10),
          active: 1,
          role: "USER",
          team: "free",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      return Response.json(newUser, { status: 200 });
    } else {
      const passwordCorrect = await compare(password, user.password || "");

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
