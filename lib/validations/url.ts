import * as z from "zod";

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
const targetPattern =
  /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[a-zA-Z0-9-_.]*)*(\/|\?([a-zA-Z0-9-_.]+=[a-zA-Z0-9-_.]*(&[a-zA-Z0-9-_.]+=[a-zA-Z0-9-_.]*)*)?)?(\.[a-zA-Z]{2,6})?$/;

export const createUrlSchema = z.object({
  id: z.string().optional(),
  target: z.string().min(6).regex(targetPattern, "Invalid target URL format"),
  url: z.string().min(2).regex(urlPattern, "Invalid URL format"),
  title: z.string().max(100).default(""),
  description: z.string().max(200).default(""),
  image: z.string().url().default(""),
  expiration: z.string().default("-1"),
  visible: z.number().default(1),
  active: z.number().default(1),
  prefix: z.string().default("socio.site"),
  password: z.string().max(6).default(""),
});
