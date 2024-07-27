import {
  createUserRecord,
  getUserRecordCount,
} from "@/actions/cloudflare-dns-record";

import { env } from "@/env.mjs";
import { createDNSRecord } from "@/lib/cloudflare";
import { getCurrentUser } from "@/lib/session";
import { generateSecret } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const { records } = await req.json();
    const {
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      NEXT_PUBLIC_FREE_RECORD_QUOTA,
    } = env;

    if (!user?.id) {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL) {
      return Response.json("API key、zone iD and email are required", {
        status: 400,
        statusText: "API key、zone iD and email are required",
      });
    }

    const record = {
      ...records[0],
      id: generateSecret(16),
      type: "CNAME",
      proxied: false,
    };

    // return Response.json(record);
    const user_records_count = await getUserRecordCount(user.id);
    if (user_records_count >= NEXT_PUBLIC_FREE_RECORD_QUOTA) {
      return Response.json("Your records have reached the free limit.", {
        status: 409,
        statusText: "Your records have reached the free limit.",
      });
    }

    const data = await createDNSRecord(
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      record,
    );
    if (!data.success || !data.result) {
      return Response.json(data.errors, {
        status: 501,
        statusText: `Error occurred. ${data.errors}`,
      });
    } else {
      const res = await createUserRecord(user.id, {
        record_id: data.result.id,
        zone_id: data.result.zone_id,
        zone_name: data.result.zone_name,
        name: data.result.name,
        type: data.result.type,
        content: data.result.content,
        proxied: data.result.proxied,
        proxiable: data.result.proxiable,
        ttl: data.result.ttl,
        comment: data.result.comment ?? "",
        tags: data.result.tags?.join("") ?? "",
        created_on: data.result.created_on,
        modified_on: data.result.modified_on,
        active: 1,
      });
      if (res.status !== "success") {
        return Response.json(res.status, {
          status: 502,
          statusText: `Error occurred. ${res.status}`,
        });
      }
      return Response.json(res.data);
    }
  } catch (error) {
    return Response.json(error, {
      status: 500,
      statusText: "Server error",
    });
  }
}
