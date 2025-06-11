import * as z from "zod";

export const createPlanSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(32),
  slTrackedClicks: z.number().optional().default(0),
  slNewLinks: z.number().optional().default(0),
  slAnalyticsRetention: z.number().optional().default(0),
  slDomains: z.number().optional().default(0),
  slAdvancedAnalytics: z.boolean().optional().default(true),
  slCustomQrCodeLogo: z.boolean().optional().default(false),
  rcNewRecords: z.number().optional().default(0),
  emEmailAddresses: z.number().optional().default(0),
  emDomains: z.number().optional().default(0),
  emSendEmails: z.number().optional().default(0),
  appSupport: z.string().optional().default("BASIC"),
  appApiAccess: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
});
