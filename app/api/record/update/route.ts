import { env } from "@/env.mjs";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
  } catch (error) {
    console.error(error);
    return Response.json(error, {
      status: 500,
      statusText: "Server error",
    });
  }
}
