import * as z from "zod";

export const createDomainSchema = z.object({
  id: z.string().optional(),
  domain_name: z.string().min(2),
  enable_short_link: z.boolean(),
  enable_email: z.boolean(),
  enable_dns: z.boolean(),
  cf_zone_id: z.string().optional(),
  cf_api_key: z.string().optional(),
  cf_email: z.string().optional(),
  cf_api_key_encrypted: z.boolean().default(false),
  max_short_links: z.number().optional(),
  max_email_forwards: z.number().optional(),
  max_dns_records: z.number().optional(),
  active: z.boolean().default(true),
});
