import { getMultipleConfigs } from "@/lib/dto/system-config";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const configs = await getMultipleConfigs([
      "enable_user_registration",
      "enable_subdomain_apply",
      "system_notification",
      "enable_github_oauth",
      "enable_google_oauth",
      "enable_liunxdo_oauth",
      "enable_resend_email_login",
    ]);
    return Response.json({
      google: configs.enable_google_oauth,
      github: configs.enable_github_oauth,
      linuxdo: configs.enable_liunxdo_oauth,
      resend: configs.enable_resend_email_login,
      registration: configs.enable_user_registration,
    });
  } catch (error) {
    console.log("[Error]", error);
  }
}
