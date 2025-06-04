import { env } from "@/env.mjs";

export async function GET(req: Request) {
  try {
    if (process.env.VERCEL) {
      return Response.json({
        google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
        github: !!(env.GITHUB_ID && env.GITHUB_SECRET),
        linuxdo: !!(env.LinuxDo_CLIENT_ID && env.LinuxDo_CLIENT_SECRET),
        resend: !!(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
      });
    } else {
      // TODO: (docker) cannot get env on docker environment
      return Response.json({
        google: true,
        github: true,
        linuxdo: true,
        resend: true,
      });
    }
  } catch (error) {
    console.log("[Error]", error);
  }
}
