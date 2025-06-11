import { env } from "@/env.mjs";
import { getConfigValue } from "@/lib/dto/system-config";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const registration = await getConfigValue<boolean>(
      "enable_user_registration",
    );
    if (process.env.VERCEL) {
      return Response.json({
        google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
        github: !!(env.GITHUB_ID && env.GITHUB_SECRET),
        linuxdo: !!(env.LinuxDo_CLIENT_ID && env.LinuxDo_CLIENT_SECRET),
        resend: !!(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
        registration,
      });
    } else {
      // TODO: (docker) cannot get env on docker environment
      return Response.json({
        google: true,
        github: true,
        linuxdo: true,
        resend: true,
        registration,
      });
    }
  } catch (error) {
    console.log("[Error]", error);
  }
}
