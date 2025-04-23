import { NextRequest, NextResponse } from "next/server";

import { checkApiKey } from "@/lib/dto/api-key";
import { getEmailsByEmailAddress } from "@/lib/dto/email";

// 通过 emailAddress 查询所有相关 ForwardEmail
export async function GET(req: NextRequest) {
  const custom_api_key = req.headers.get("wrdo-api-key");
  if (!custom_api_key) {
    return Response.json("Unauthorized", {
      status: 401,
    });
  }

  // Check if the API key is valid
  const user = await checkApiKey(custom_api_key);
  if (!user?.id) {
    return Response.json(
      "Invalid API key. You can get your API key from https://wr.do/dashboard/settings.",
      { status: 401 },
    );
  }
  if (user.active === 0) {
    return Response.json("Forbidden", {
      status: 403,
      statusText: "Forbidden",
    });
  }

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
    if (error.message === "Email address not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
