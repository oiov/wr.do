import { env } from "@/env.mjs";
import { updateDNSRecord } from "@/lib/cloudflare";
import { updateUserRecord } from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
      });
    }

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
      return Response.json("API key、zone iD and email are required", {
        status: 400,
      });
    }

    const { record, recordId, userId } = await req.json();
    if (!recordId || !userId) {
      return Response.json("RecordId and userId are required", {
        status: 400,
      });
    }

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
      });
    } else {
      const res = await updateUserRecord(userId, {
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
    return Response.json(error?.statusText || error, {
      status: error?.status || 500,
    });
  }
}
