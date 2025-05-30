import { env } from "@/env.mjs";

export async function GET() {
  return new Response(
    JSON.stringify({
      google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
      github: !!(env.GITHUB_ID && env.GITHUB_SECRET),
      linuxdo: !!(env.LinuxDo_CLIENT_ID && env.LinuxDo_CLIENT_SECRET),
      resend: !!(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
    }),
  );
}
