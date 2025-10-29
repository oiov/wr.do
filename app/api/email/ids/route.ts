import { NextRequest, NextResponse } from "next/server";

import { getUserEmailIds } from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = checkUserStatus(await getCurrentUser());
  if (user instanceof Response) return user;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const all = searchParams.get("all") === "true";
  const unread = searchParams.get("unread") === "true";

  try {
    const ids = await getUserEmailIds(
      user.id,
      search,
      user.role === "ADMIN" && all,
      unread,
    );

    return NextResponse.json({ ids }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user email ids:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
