// import { env } from "@/env.mjs";

export async function GET(req: Request) {
  try {
    return Response.json({
      google: true,
      github: true,
      linuxdo: true,
      resend: true,
    });
  } catch (error) {
    console.log("[Error]", error);
  }
}
