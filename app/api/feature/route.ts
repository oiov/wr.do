import { env } from "@/env.mjs";

console.log(
  "[out-env]",
  env.LinuxDo_CLIENT_ID,
  env.LinuxDo_CLIENT_SECRET,
  !!(env.LinuxDo_CLIENT_ID && env.LinuxDo_CLIENT_SECRET),
);
console.log(
  "[out-process.env]",
  process.env.LinuxDo_CLIENT_ID,
  process.env.LinuxDo_CLIENT_SECRET,
  !!(process.env.LinuxDo_CLIENT_ID && process.env.LinuxDo_CLIENT_SECRET),
);

export async function GET() {
  try {
    console.log(
      "[env]",
      env.LinuxDo_CLIENT_ID,
      env.LinuxDo_CLIENT_SECRET,
      !!(env.LinuxDo_CLIENT_ID && env.LinuxDo_CLIENT_SECRET),
    );
    console.log(
      "[process.env]",
      process.env.LinuxDo_CLIENT_ID,
      process.env.LinuxDo_CLIENT_SECRET,
      !!(process.env.LinuxDo_CLIENT_ID && process.env.LinuxDo_CLIENT_SECRET),
    );

    return Response.json({
      google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
      github: !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
      linuxdo: !!(env.LinuxDo_CLIENT_ID && env.LinuxDo_CLIENT_SECRET),
      resend: !!(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
    });
  } catch (error) {
    console.log("[Error]", error);
  }
}
