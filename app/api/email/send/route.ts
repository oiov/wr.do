import { NextRequest, NextResponse } from "next/server";

import { resend } from "@/lib/email";
import { isValidEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { from, to, subject, html } = await req.json();

    if (!from || !to || !subject || !html) {
      return NextResponse.json("Missing required fields", { status: 400 });
    }

    if (!isValidEmail(from) || !isValidEmail(to)) {
      return NextResponse.json("Invalid email address", { status: 403 });
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.log("Resend error:", error);
      return NextResponse.json("Failed to send email", { status: 500 });
    }

    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    console.log("Error sending email:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
