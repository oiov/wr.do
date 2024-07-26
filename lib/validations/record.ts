import * as z from "zod";

export const createRecordSchema = z.object({
  type: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, "Invalid characters")
    .min(1)
    .max(32)
    .default("CNAME"),
  name: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, "Invalid characters")
    .min(1)
    .max(32),
  content: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, "Invalid characters")
    .min(1)
    .max(32),
  ttl: z.number().min(1).max(36000).default(1),
  proxied: z.boolean().default(false),
  comment: z.string().optional(),
});
