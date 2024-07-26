import { env } from "@/env.mjs";
import { createDNSRecord } from "@/lib/cloudflare";
import { getCurrentUser } from "@/lib/session";
import { generateSecret } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const { records } = await req.json();
    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;

    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_KEY) {
      return new Response(`API key and Zone ID are required`, {
        status: 400,
      });
    }

    const record = {
      ...records[0],
      id: generateSecret(16),
      type: "CNAME",
      proxied: false,
    };

    // return Response.json(record);

    const data = await createDNSRecord(
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      record,
    );
    return Response.json(data);
  } catch (error) {
    return new Response(`${error}`, {
      status: 500,
    });
  }
}
