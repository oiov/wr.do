import { env } from "@/env.mjs";
import { createDNSRecord } from "@/lib/cloudflare";
import {
  createUserRecord,
  getUserRecordByTypeNameContent,
  getUserRecordCount,
} from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { reservedDomains } from "@/lib/enums";
import { getCurrentUser } from "@/lib/session";
import { Team_Plan_Quota } from "@/lib/team";
import { generateSecret } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const {
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_ZONE_NAME,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      NEXT_PUBLIC_FREE_RECORD_QUOTA,
    } = env;

    if (
      !CLOUDFLARE_ZONE_ID ||
      !CLOUDFLARE_ZONE_NAME ||
      !CLOUDFLARE_API_KEY ||
      !CLOUDFLARE_EMAIL
    ) {
      return Response.json("API key、zone iD and email are required", {
        status: 400,
        statusText: "API key、zone iD and email are required",
      });
    }

    // Check quota: 若是管理员则不检查，否则检查
    const user_records_count = await getUserRecordCount(user.id);

    if (
      user.role !== "ADMIN" &&
      user_records_count >= Team_Plan_Quota[user.team].RC_NewRecords
    ) {
      return Response.json("Your records have reached the free limit.", {
        status: 409,
      });
    }

    const { records } = await req.json();
    const record = {
      ...records[0],
      id: generateSecret(16),
      // type: "CNAME",
      proxied: false,
    };

    const record_name = record.name.endsWith(".wr.do")
      ? record.name
      : record.name + ".wr.do";

    if (reservedDomains.includes(record_name)) {
      return Response.json("Domain name is reserved", {
        status: 403,
      });
    }

    const user_record = await getUserRecordByTypeNameContent(
      user.id,
      record.type,
      record_name,
      record.content,
      1,
    );
    if (user_record && user_record.length > 0) {
      return Response.json("Record already exists", {
        status: 403,
      });
    }

    const data = await createDNSRecord(
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      record,
    );

    if (!data.success || !data.result?.id) {
      console.log("[data]", data);
      return Response.json(data.messages, {
        status: 501,
      });
    } else {
      const res = await createUserRecord(user.id, {
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
        created_on: data.result.created_on,
        modified_on: data.result.modified_on,
        active: 0,
      });

      if (res.status !== "success") {
        return Response.json(res.status, {
          status: 502,
        });
      }
      return Response.json(res.data);
    }
  } catch (error) {
    console.error("[错误]", error);
    return Response.json(error, {
      status: error?.status || 500,
    });
  }
}
