import * as z from "zod";

export const createUrlSchema = z.object({
  id: z.string().optional(),
  target: z.string().min(6), // TODO
  url: z.string().min(2), // TODO
  visible: z.number().default(1),
  active: z.number().default(1),
});
