import { NextRequest, NextResponse } from "next/server";

import { checkApiKey } from "@/lib/dto/api-key";
import {
  createUserEmail,
  deleteUserEmailByAddress,
  getAllUserEmailsCount,
} from "@/lib/dto/email";
import { reservedAddressSuffix } from "@/lib/enums";
import { restrictByTimeRange, Team_Plan_Quota } from "@/lib/team";

import { siteConfig } from "../../../../config/site";

// 创建新 UserEmail
export async function POST(req: NextRequest) {
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

  // check limit
  const limit = await restrictByTimeRange({
    model: "userEmail",
    userId: user.id,
    limit: Team_Plan_Quota[user.team!].EM_EmailAddresses,
    rangeType: "month",
  });
  if (limit.status !== 200)
    return NextResponse.json(limit.statusText, { status: limit.status });

  const { emailAddress } = await req.json();

  if (!emailAddress) {
    return NextResponse.json("Missing userId or emailAddress", { status: 400 });
  }

  const [prefix, suffix] = emailAddress.split("@");
  if (!prefix || prefix.length < 5) {
    return NextResponse.json("Email address length must be at least 5", {
      status: 400,
    });
  }
  if (!siteConfig.emailDomains.includes(suffix)) {
    return NextResponse.json("Invalid email suffix address", { status: 400 });
  }

  if (reservedAddressSuffix.includes(prefix)) {
    return NextResponse.json("Invalid email address", { status: 400 });
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
      return NextResponse.json("Email address already exists", {
        status: 409,
      });
    }
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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

  const { emailAddress } = await req.json();
  if (!emailAddress) {
    return NextResponse.json("Missing email address parameter", {
      status: 400,
    });
  }

  try {
    await deleteUserEmailByAddress(emailAddress);
    return NextResponse.json("success", { status: 201 });
  } catch (error) {
    console.error("Error deleting user email:", error);
    if (error.message === "User email not found or already deleted") {
      return NextResponse.json(error.message, { status: 404 });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
