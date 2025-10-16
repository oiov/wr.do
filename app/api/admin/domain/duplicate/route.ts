import { NextRequest } from "next/server";

import { createDomain, getDomainByName } from "@/lib/dto/domains";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const { domain } = await req.json();
    if (!domain) {
      return Response.json("Domain name is required", { status: 400 });
    }

    const target_domain = await getDomainByName(domain);
    if (!target_domain) {
      return Response.json("Domain not found", { status: 404 });
    }

    const newDomain = await createDomain({
      domain_name: target_domain.domain_name + "-copy",
      enable_short_link: !!target_domain.enable_short_link,
      enable_email: !!target_domain.enable_email,
      enable_dns: !!target_domain.enable_dns,
      cf_zone_id: target_domain.cf_zone_id,
      cf_api_key: target_domain.cf_api_key,
      cf_email: target_domain.cf_email,
      cf_record_types: target_domain.cf_record_types,
      cf_api_key_encrypted: false,
      email_provider: target_domain.email_provider,
      resend_api_key: target_domain.resend_api_key,
      brevo_api_key: target_domain.brevo_api_key,
      max_short_links: target_domain.max_short_links,
      max_email_forwards: target_domain.max_email_forwards,
      max_dns_records: target_domain.max_dns_records,
      min_url_length: target_domain.min_url_length,
      min_email_length: target_domain.min_email_length,
      min_record_length: target_domain.min_record_length,
      active: true,
    });

    if (!newDomain) {
      return Response.json("Failed to create domain", { status: 400 });
    }

    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
