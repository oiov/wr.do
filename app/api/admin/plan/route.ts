import { NextRequest } from "next/server";

import {
  createPlan,
  deletePlan,
  getAllPlans,
  updatePlanQuota,
} from "@/lib/dto/plan";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    // const url = new URL(req.url);
    // const page = url.searchParams.get("page");
    // const size = url.searchParams.get("size");
    // const target = url.searchParams.get("target") || "";

    const data = await getAllPlans();

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const { plan } = await req.json();

    const data = await createPlan({
      name: plan.name,
      slTrackedClicks: plan.slTrackedClicks,
      slNewLinks: plan.slNewLinks,
      slAnalyticsRetention: plan.slAnalyticsRetention,
      slDomains: plan.slDomains,
      slAdvancedAnalytics: plan.slAdvancedAnalytics,
      slCustomQrCodeLogo: plan.slCustomQrCodeLogo,
      rcNewRecords: plan.rcNewRecords,
      emEmailAddresses: plan.emEmailAddresses,
      emDomains: plan.emDomains,
      emSendEmails: plan.emSendEmails,
      appSupport: plan.appSupport.toUpperCase() as any,
      appApiAccess: plan.appApiAccess,
      isActive: true,
    });

    if (data) {
      return Response.json(data, { status: 200 });
    }

    return Response.json(null, { status: 400 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan) {
      return Response.json("Invalid request body", { status: 400 });
    }

    const res = await updatePlanQuota({
      id: plan.id,
      name: plan.name,
      slTrackedClicks: plan.slTrackedClicks,
      slNewLinks: plan.slNewLinks,
      slAnalyticsRetention: plan.slAnalyticsRetention,
      slDomains: plan.slDomains,
      slAdvancedAnalytics: plan.slAdvancedAnalytics,
      slCustomQrCodeLogo: plan.slCustomQrCodeLogo,
      rcNewRecords: plan.rcNewRecords,
      emEmailAddresses: plan.emEmailAddresses,
      emDomains: plan.emDomains,
      emSendEmails: plan.emSendEmails,
      appSupport: plan.appSupport.toUpperCase() as any,
      appApiAccess: plan.appApiAccess,
      isActive: plan.isActive,
    });

    if (res) {
      return Response.json(res, { status: 200 });
    }

    return Response.json(null, { status: 400 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return Response.json("id is required", { status: 400 });
    }

    const data = await deletePlan(id);

    if (data) {
      return Response.json(data, { status: 200 });
    }

    return Response.json(null, { status: 400 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
