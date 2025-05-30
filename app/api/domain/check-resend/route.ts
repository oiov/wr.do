import { NextRequest } from "next/server";
import { Resend } from "resend";

import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const api_key = url.searchParams.get("api_key") || "";
    const domain = url.searchParams.get("domain") || "";

    if (!api_key || !domain) {
      return Response.json(400, { status: 400 });
    }

    const resend = new Resend(api_key);
    const { error } = await resend.emails.send({
      from: `test@${domain}`,
      to: user.email,
      subject: "Test Resend API Key",
      html: "This is a test email sent using Resend API Key.",
    });

    if (error) {
      console.error(error);
      return Response.json(400, { status: 400 });
    }

    return Response.json(200, { status: 200 });
  } catch (error) {
    return Response.json(500, { status: 500 });
  }
}
