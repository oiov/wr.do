import { env } from "@/env.mjs";
import { updateDNSRecord } from "@/lib/cloudflare";
import {
  updateUserRecord,
  updateUserRecordState,
} from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

// update record
export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;
    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL) {
      return Response.json(
        { statusText: "API key andzone id are required." },
        { status: 401 },
      );
    }

    const { record, recordId } = await req.json();

    const data = await updateDNSRecord(
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      recordId,
      record,
    );
    if (!data.success || !data.result?.id) {
      return Response.json(data.errors, {
        status: 501,
        statusText: `An error occurred. ${data.errors}`,
      });
    } else {
      const res = await updateUserRecord(user.id, {
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
        modified_on: data.result.modified_on,
        active: 1,
      });
      if (res.status !== "success") {
        return Response.json(res.status, {
          status: 502,
          statusText: `An error occurred. ${res.status}`,
        });
      }
      return Response.json(res.data);
    }
  } catch (error) {
    console.error(error);
    return Response.json(error?.statusText || error, {
      status: error?.status || 500,
      statusText: error?.statusText || "Server error",
    });
  }
}

// update record state
export async function PUT(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;
    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL) {
      return Response.json(
        { statusText: "API key and zone id are required." },
        { status: 401 },
      );
    }

    const { zone_id, record_id, target, active } = await req.json();

    let isTargetAccessible = false;
    try {
      const target_res = await fetch(`https://${target}`);
      isTargetAccessible = target_res.status === 200;
    } catch (fetchError) {
      isTargetAccessible = false;
      // console.log(`Failed to access target: ${fetchError}`);
    }

    const res = await updateUserRecordState(
      user.id,
      record_id,
      zone_id,
      isTargetAccessible ? 1 : 0,
    );

    if (!res) {
      return Response.json(
        { statusText: "An error occurred." },
        { status: 502 },
      );
    }
    return Response.json(
      isTargetAccessible ? "Target is accessible!" : "Target is unaccessible!",
    );
  } catch (error) {
    console.error(error);
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
