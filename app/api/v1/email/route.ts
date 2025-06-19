import { NextRequest, NextResponse } from "next/server";

import { checkApiKey } from "@/lib/dto/api-key";
import { getDomainsByFeature } from "@/lib/dto/domains";
import { createUserEmail, deleteUserEmailByAddress } from "@/lib/dto/email";
import { getPlanQuota } from "@/lib/dto/plan";
import { reservedAddressSuffix } from "@/lib/enums";
import { restrictByTimeRange } from "@/lib/team";

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

  const plan = await getPlanQuota(user.team!);

  // check limit
  const limit = await restrictByTimeRange({
    model: "userEmail",
    userId: user.id,
    limit: plan.emEmailAddresses,
    rangeType: "month",
  });
  if (limit)
    return NextResponse.json(limit.statusText, { status: limit.status });

  const { emailAddress } = await req.json();

  if (!emailAddress) {
    return NextResponse.json("Missing userId or emailAddress", { status: 400 });
  }

  const [prefix, suffix] = emailAddress.split("@");
  const zones = await getDomainsByFeature("enable_email", true);
  if (
    !zones.length ||
    !zones.map((zone) => zone.domain_name).includes(suffix)
  ) {
    return NextResponse.json("Invalid email suffix address", { status: 400 });
  }

  const limit_len =
    zones.find((zone) => zone.domain_name === suffix)?.min_email_length ?? 3;
  if (!prefix || prefix.length < limit_len) {
    return NextResponse.json(
      `Email address length must be at least ${limit_len}`,
      {
        status: 400,
      },
    );
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
