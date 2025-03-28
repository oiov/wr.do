import { env } from "@/env.mjs";
import { updateDNSRecord } from "@/lib/cloudflare";
import {
  updateUserRecord,
  updateUserRecordState,
} from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { reservedDomains } from "@/lib/enums";
import { getCurrentUser } from "@/lib/session";

// update record
export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const {
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_ZONE_NAME,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
    } = env;
    if (
      !CLOUDFLARE_ZONE_ID ||
      !CLOUDFLARE_ZONE_NAME ||
      !CLOUDFLARE_API_KEY ||
      !CLOUDFLARE_EMAIL
    ) {
      return Response.json("API key andzone id are required.", { status: 401 });
    }

    const { record, recordId } = await req.json();

    const record_name = record.name.endsWith(".wr.do")
      ? record.name
      : record.name + ".wr.do";
    if (reservedDomains.includes(record_name)) {
      return Response.json("Domain name is reserved", {
        status: 403,
      });
    }

    const data = await updateDNSRecord(
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      recordId,
      record,
    );
    console.log("updateDNSRecord", data);

    if (!data.success || !data.result?.id) {
      return Response.json(data.errors, {
        status: 501,
      });
    } else {
      const res = await updateUserRecord(user.id, {
        record_id: data.result.id,
        zone_id: CLOUDFLARE_ZONE_ID,
        zone_name: CLOUDFLARE_ZONE_NAME,
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
        });
      }
      return Response.json(res.data);
    }
  } catch (error) {
    console.log(error);
    return Response.json(error?.statusText || error, {
      status: error?.status || 500,
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
      return Response.json("API key and zone id are required.", {
        status: 401,
      });
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
      return Response.json("An error occurred.", { status: 502 });
    }
    return Response.json(
      isTargetAccessible ? "Target is accessible!" : "Target is unaccessible!",
    );
  } catch (error) {
    console.error(error);
    return Response.json(`An error occurred. ${error}`, { status: 500 });
  }
}
