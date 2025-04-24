import { NextRequest, NextResponse } from "next/server";

import { getUserSendEmailCount, saveUserSendEmail } from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { resend } from "@/lib/email";
import { getCurrentUser } from "@/lib/session";
import { restrictByTimeRange, Team_Plan_Quota } from "@/lib/team";
import { isValidEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    // check limit
    const limit = await restrictByTimeRange({
      model: "userSendEmail",
      userId: user.id,
      limit: Team_Plan_Quota[user.team].EM_SendEmails,
      rangeType: "month",
    });
    if (limit)
      return NextResponse.json(limit.statusText, { status: limit.status });

    const { from, to, subject, html } = await req.json();

    if (!from || !to || !subject || !html) {
      return NextResponse.json("Missing required fields", { status: 400 });
    }

    if (!isValidEmail(from) || !isValidEmail(to)) {
      return NextResponse.json("Invalid email address", { status: 403 });
    }

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.log("Resend error:", error);
      return NextResponse.json("Failed to send email", { status: 500 });
    }

    await saveUserSendEmail(user.id, from, to, subject, html);

    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    console.log("Error sending email:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") || "false";

    const count = await getUserSendEmailCount(
      user.id,
      user.role === "ADMIN" && all === "true",
    );
    return NextResponse.json(count);
  } catch (error) {
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
