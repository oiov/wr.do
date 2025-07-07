import { prisma } from "../db";

export interface PlanQuota {
  name: string;
  slTrackedClicks: number;
  slNewLinks: number;
  slAnalyticsRetention: number;
  slDomains: number;
  slAdvancedAnalytics: boolean;
  slCustomQrCodeLogo: boolean;
  rcNewRecords: number;
  emEmailAddresses: number;
  emDomains: number;
  emSendEmails: number;
  stMaxFileSize: string;
  stMaxTotalSize: string;
  stMaxFileCount: number;
  appSupport: string;
  appApiAccess: boolean;
  isActive: boolean;
}

export interface PlanQuotaFormData extends PlanQuota {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 获取计划配额
export async function getPlanQuota(planName: string) {
  const plan = await prisma.plan.findUnique({
    where: { name: planName },
  });

  if (!plan) {
    return {
      name: planName,
      slTrackedClicks: 0,
      slNewLinks: 0,
      slAnalyticsRetention: 0,
      slDomains: 0,
      slAdvancedAnalytics: false,
      slCustomQrCodeLogo: false,
      rcNewRecords: 0,
      emEmailAddresses: 0,
      emDomains: 0,
      emSendEmails: 0,
      stMaxFileSize: "26214400",
      stMaxTotalSize: "524288000",
      stMaxFileCount: 1000,
      appSupport: "BASIC",
      appApiAccess: true,
      isActive: true,
    };
  }

  return {
    name: planName,
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
    stMaxFileSize: plan.stMaxFileSize,
    stMaxTotalSize: plan.stMaxTotalSize,
    stMaxFileCount: plan.stMaxFileCount,
    appSupport: plan.appSupport.toLowerCase(),
    appApiAccess: plan.appApiAccess,
    isActive: plan.isActive,
  };
}

// 获取所有计划
export async function getAllPlans(page = 1, size = 10, target: string = "") {
  let option: any;

  if (target) {
    option = {
      name: {
        contains: target,
      },
    };
  }

  const [total, list] = await prisma.$transaction([
    prisma.plan.count({
      where: option,
    }),
    prisma.plan.findMany({
      where: option,
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        slTrackedClicks: "asc",
      },
    }),
  ]);
  return { list, total };
}

// 获取计划所有名称
export async function getPlanNames() {
  const data = await prisma.plan.findMany({
    where: { isActive: true },
    select: { name: true },
    orderBy: { name: "asc" },
  });

  return data.map((item) => item.name);
}

// 更新计划配额
export async function updatePlanQuota(plan: PlanQuotaFormData) {
  return await prisma.plan.update({
    where: { id: plan.id },
    data: {
      // name: plan.name,
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
      stMaxFileSize: plan.stMaxFileSize,
      stMaxTotalSize: plan.stMaxTotalSize,
      stMaxFileCount: plan.stMaxFileCount,
      appSupport: plan.appSupport.toUpperCase() as any,
      appApiAccess: plan.appApiAccess,
      isActive: plan.isActive,
      updatedAt: new Date(),
    },
  });
}

// 创建新计划
export async function createPlan(plan: PlanQuota) {
  return await prisma.plan.create({
    data: {
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
      stMaxFileSize: plan.stMaxFileSize,
      stMaxTotalSize: plan.stMaxTotalSize,
      stMaxFileCount: plan.stMaxFileCount,
      appSupport: plan.appSupport.toUpperCase() as any,
      appApiAccess: plan.appApiAccess,
      isActive: true,
    },
  });
}

// 删除计划（软删除）
export async function deletePlan(id: string) {
  return await prisma.plan.delete({
    where: { id },
  });
}
