import { NextRequest, NextResponse } from "next/server";

import { getUserSendEmailList } from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const search = searchParams.get("search") || "";
    const all = searchParams.get("all") || "false";

    const data = await getUserSendEmailList(
      user.id,
      user.role === "ADMIN" && all === "true",
      page,
      size,
      search,
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
