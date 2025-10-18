import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { checkDomainIsConfiguratedEmailProvider } from "@/lib/dto/domains";
import { getUserSendEmailCount, saveUserSendEmail } from "@/lib/dto/email";
import { getPlanQuota } from "@/lib/dto/plan";
import { checkUserStatus } from "@/lib/dto/user";
import { brevoSendEmail } from "@/lib/email/brevo";
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

    const { email_key, provider } =
      await checkDomainIsConfiguratedEmailProvider(from.split("@")[1]);

    if (!email_key) {
      return NextResponse.json(
        "This domain is not configured for sending emails",
        { status: 400 },
      );
    }

    switch (provider) {
      case "Resend":
        const resend = new Resend(email_key);
        await resend.emails.send({ from, to, subject, html });
        break;
      case "Brevo":
        await brevoSendEmail({
          from,
          fromName: from.split("@")[0],
          to,
          subject,
          html,
        });
        break;
      default:
        break;
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
