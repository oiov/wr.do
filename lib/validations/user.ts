import { UserRole } from "@prisma/client";
import * as z from "zod";

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
});

export const userEmailSchema = z.object({
  email: z.string().min(3).email(),
});

export const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const userPasswordSchema = z.object({
  password: z.string().min(6).max(32),
});

export const userApiKeySchema = z.object({});
