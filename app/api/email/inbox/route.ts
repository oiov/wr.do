import { NextRequest, NextResponse } from "next/server";

import { deleteEmailsByIds, getEmailsByEmailAddress } from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

// 通过 emailAddress 查询所有相关 ForwardEmail
export async function GET(req: NextRequest) {
  const user = checkUserStatus(await getCurrentUser());
  if (user instanceof Response) return user;

  const { searchParams } = new URL(req.url);
  const emailAddress = searchParams.get("emailAddress");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);

  if (!emailAddress) {
    return NextResponse.json(
      { error: "Missing emailAddress parameter" },
      { status: 400 },
    );
  }

  try {
    const emails = await getEmailsByEmailAddress(emailAddress, page, pageSize);
    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    if (error.message === "Email address not found or has been deleted") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { ids } = await req.json();
    if (!ids) {
      return Response.json("ids is required", { status: 400 });
    }

    await deleteEmailsByIds(ids);

    return Response.json("success", { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
