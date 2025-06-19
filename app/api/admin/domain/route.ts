import { NextRequest } from "next/server";

import {
  createDomain,
  deleteDomain,
  getAllDomains,
  updateDomain,
} from "@/lib/dto/domains";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

// Get domains list
export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");
    const target = url.searchParams.get("target") || "";

    const data = await getAllDomains(
      Number(page || "1"),
      Number(size || "10"),
      target,
    );

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}

// Create domain
export async function POST(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const { data } = await req.json();
    if (!data || !data.domain_name) {
      return Response.json("domain_name is required", { status: 400 });
    }

    const newDomain = await createDomain({
      domain_name: data.domain_name,
      enable_short_link: !!data.enable_short_link,
      enable_email: !!data.enable_email,
      enable_dns: !!data.enable_dns,
      cf_zone_id: data.cf_zone_id,
      cf_api_key: data.cf_api_key,
      cf_email: data.cf_email,
      cf_record_types: data.cf_record_types,
      cf_api_key_encrypted: false,
      resend_api_key: data.resend_api_key,
      max_short_links: data.max_short_links,
      max_email_forwards: data.max_email_forwards,
      max_dns_records: data.max_dns_records,
      min_url_length: data.min_url_length,
      min_email_length: data.min_email_length,
      min_record_length: data.min_record_length,
      active: true,
    });

    return Response.json(newDomain, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}

// Update domain
export async function PUT(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const {
      domain_name,
      enable_short_link,
      enable_email,
      enable_dns,
      cf_zone_id,
      cf_api_key,
      cf_email,
      cf_record_types,
      resend_api_key,
      min_url_length,
      min_email_length,
      min_record_length,
      max_short_links,
      max_email_forwards,
      max_dns_records,
      active,
      id,
    } = await req.json();
    if (!id) {
      return Response.json("domain id is required", { status: 400 });
    }

    const updatedDomain = await updateDomain(id, {
      domain_name,
      enable_short_link: !!enable_short_link,
      enable_email: !!enable_email,
      enable_dns: !!enable_dns,
      active: !!active,
      cf_zone_id,
      cf_api_key,
      cf_email,
      cf_record_types,
      cf_api_key_encrypted: false,
      resend_api_key,
      min_url_length,
      min_email_length,
      min_record_length,
      max_short_links,
      max_email_forwards,
      max_dns_records,
    });

    return Response.json(updatedDomain, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}

// Delete domain
export async function DELETE(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const { domain_name } = await req.json();
    if (!domain_name) {
      return Response.json("domain_name is required", { status: 400 });
    }

    const deletedDomain = await deleteDomain(domain_name);

    return Response.json(deletedDomain, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
