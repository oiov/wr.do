import { NextRequest, NextResponse } from "next/server";

import {
  deleteUserEmail,
  getUserEmailById,
  updateUserEmail,
} from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

// 查询单个 UserEmail
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = checkUserStatus(await getCurrentUser());
  if (user instanceof Response) return user;

  const { id } = params;

  try {
    const userEmail = await getUserEmailById(id);
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found or deleted" },
        { status: 404 },
      );
    }
    return NextResponse.json(userEmail, { status: 200 });
  } catch (error) {
    console.error("Error fetching user email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 更新 UserEmail 的 emailAddress
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = checkUserStatus(await getCurrentUser());
  if (user instanceof Response) return user;

  const { id } = params;
  const { emailAddress } = await req.json();

  if (!emailAddress) {
    return NextResponse.json("Missing emailAddress", { status: 400 });
  }

  try {
    const userEmail = await updateUserEmail(id, emailAddress);
    return NextResponse.json(userEmail, { status: 200 });
  } catch (error) {
    console.error("Error updating user email:", error);
    if (error.message === "User email not found or already deleted") {
      return NextResponse.json(error.message, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json("Email address already exists", { status: 409 });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// 删除 UserEmail
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = checkUserStatus(await getCurrentUser());
  if (user instanceof Response) return user;

  const { id } = params;

  try {
    await deleteUserEmail(id);
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user email:", error);
    if (error.message === "User email not found or already deleted") {
      return NextResponse.json(error.message, { status: 404 });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
