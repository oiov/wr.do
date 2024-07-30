import { UserRole } from "@prisma/client";
import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email(),
});

export const updateUserSchema = z.object({
  email: z.string().email(),
  image: z.string(),
  name: z.string(),
  active: z.number().default(1),
  team: z.string(),
  role: z.nativeEnum(UserRole),
});
