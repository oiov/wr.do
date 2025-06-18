import { UserRole } from "@prisma/client";
import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email(),
});

export const userPasswordAuthSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  email: z.string().email(),
  image: z.string(),
  name: z.string(),
  active: z.number().default(1),
  team: z.string(),
  role: z.nativeEnum(UserRole),
  password: z.string().optional(),
});
