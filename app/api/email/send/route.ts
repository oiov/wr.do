import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { checkDomainIsConfiguratedResend } from "@/lib/dto/domains";
import { getUserSendEmailCount, saveUserSendEmail } from "@/lib/dto/email";
import { getPlanQuota } from "@/lib/dto/plan";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { restrictByTimeRange } from "@/lib/team";
import { isValidEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const plan = await getPlanQuota(user.team);

    // check limit
    const limit = await restrictByTimeRange({
      model: "userSendEmail",
      userId: user.id,
      limit: plan.emSendEmails,
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

    const resend_key = await checkDomainIsConfiguratedResend(
      from.split("@")[1],
    );

    if (!resend_key) {
      return NextResponse.json(
        "This domain is not configured for sending emails",
        { status: 400 },
      );
    }

    const resend = new Resend(resend_key);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.log("Resend error:", error); // ？？？如果删掉这句log，下面一行读取error的message会返回undefined
      return NextResponse.json(`${error.message}`, {
        status: 400,
      });
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
