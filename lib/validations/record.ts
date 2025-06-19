import * as z from "zod";

export const createRecordSchema = z.object({
  zone_name: z.string().min(1).max(32),
  type: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, "Invalid characters")
    .min(1)
    .max(32)
    .default("CNAME"),
  name: z
    .string()
    .regex(/^[a-zA-Z0-9-_]+$/, "Invalid characters")
    .min(1)
    .max(32),
  content: z.string().min(1).max(32),
  ttl: z.number().min(1).max(36000).default(1),
  proxied: z.boolean().default(false),
  comment: z.string().optional(),
});

export const createUserRecordSchema = z.object({
  record_id: z.string(),
  zone_id: z.string(),
  zone_name: z.string(),
  type: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, "Invalid characters")
    .min(1)
    .max(32)
    .default("CNAME"),
  name: z
    .string()
    .regex(/^[a-zA-Z0-9-_.]+$/, "Invalid characters")
    .min(1)
    .max(32),
  content: z
    .string()
    // .regex(/^[a-zA-Z0-9-.]+$/, "Invalid characters")
    .min(1)
    .max(32),
  ttl: z.number().min(1).max(36000).default(1),
  proxied: z.boolean().default(false),
  proxiable: z.boolean().default(true),
  comment: z.string().optional(),
  tags: z.string(),
  created_on: z.string(),
  modified_on: z.string(),
  active: z.number().default(1),
});

export const updateUserRecordSchema = z.object({
  record_id: z.string(),
  zone_id: z.string(),
  zone_name: z.string(),
  type: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, "Invalid characters")
    .min(1)
    .max(32)
    .default("CNAME"),
  name: z
    .string()
    .regex(/^[a-zA-Z0-9-_.]+$/, "Invalid characters")
    .min(1)
    .max(32),
  content: z
    .string()
    // .regex(/^[a-zA-Z0-9-.]+$/, "Invalid characters")
    .min(1)
    .max(32),
  ttl: z.number().min(1).max(36000).default(1),
  proxied: z.boolean().default(false),
  proxiable: z.boolean().default(true),
  comment: z.string().optional(),
  tags: z.string(),
  active: z.number().default(1),
});
