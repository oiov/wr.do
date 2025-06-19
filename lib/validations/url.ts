import * as z from "zod";

import { isValidUrl } from "../utils";

/*
  support:
    xxx
    xxx-xx
    xxxx123
    xxx-1
  not support:
    -xxx
    xxx-
    xxx--xx
    -xxx-
*/
const urlPattern = /^(?!-)[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(?<!-)$/;

// const targetPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s<>"{}|\\^`\[\]]*)?(\?[^\s<>"{}|\\^`\[\]]*)?(\#[^\s<>"{}|\\^`\[\]]*)?$/;

export const createUrlSchema = z.object({
  id: z.string().optional(),
  target: z.string().min(1),
  url: z.string().min(1).regex(urlPattern, "Invalid URL format"),
  expiration: z.string().default("-1"),
  visible: z.number().default(1),
  active: z.number().default(1),
  prefix: z.string().default("wr.do"),
  password: z.string().max(6).default(""),
});
