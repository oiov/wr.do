import { NextRequest, NextResponse } from "next/server";

import { createUserEmail, getAllUserEmails } from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

// 查询所有 UserEmail 地址
export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const search = searchParams.get("search") || "";

    const userEmails = await getAllUserEmails(user.id, page, size, search);
    return NextResponse.json(userEmails, { status: 200 });
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 创建新 UserEmail
export async function POST(req: NextRequest) {
  const user = checkUserStatus(await getCurrentUser());
  if (user instanceof Response) return user;

  const { emailAddress } = await req.json();

  if (!emailAddress) {
    return NextResponse.json("Missing userId or emailAddress", { status: 400 });
  }

  if (emailAddress.split("@")[0].length < 5) {
    return NextResponse.json("Email address length must be at least 5", {
      status: 400,
    });
  }

  try {
    const userEmail = await createUserEmail(user.id, emailAddress);
    return NextResponse.json(userEmail, { status: 201 });
  } catch (error) {
    // console.log("Error creating user email:", error);
    if (error.message === "Invalid userId") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.code === "P2002") {
      return NextResponse.json("Email address already exists", { status: 409 });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
