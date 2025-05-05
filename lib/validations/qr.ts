import * as z from "zod";

import {
  DEFAULT_BGCOLOR,
  DEFAULT_FGCOLOR,
  DEFAULT_MARGIN,
  QR_LEVELS,
} from "@/lib/qr/constants";

import { getUrlFromString, isValidUrl } from "../utils";

export const parseUrlSchema = z
  .string()
  .transform((v) => getUrlFromString(v))
  .refine((v) => isValidUrl(v), { message: "Invalid URL" });

// A boolean query schema that coerces the value to a boolean
export const booleanQuerySchema = z
  .enum(["true", "false"])
  .transform((value) => value == "true");
// .openapi({
//   type: "boolean",
// });

export const getQRCodeQuerySchema = z.object({
  key: z.string(),
  url: parseUrlSchema.describe("The URL to generate a QR code for."),
  logo: z
    .string()
    .optional()
    .describe(
      "The logo to include in the QR code. Can only be used with a paid plan on Dub.",
    ),
  size: z.coerce
    .number()
    .optional()
    .default(600)
    .describe(
      "The size of the QR code in pixels. Defaults to `600` if not provided.",
    ),
  level: z
    .enum(QR_LEVELS)
    .optional()
    .default("L")
    .describe(
      "The level of error correction to use for the QR code. Defaults to `L` if not provided.",
    ),
  fgColor: z
    .string()
    .optional()
    .default(DEFAULT_FGCOLOR)
    .describe(
      "The foreground color of the QR code in hex format. Defaults to `#000000` if not provided.",
    ),
  bgColor: z
    .string()
    .optional()
    .default(DEFAULT_BGCOLOR)
    .describe(
      "The background color of the QR code in hex format. Defaults to `#ffffff` if not provided.",
    ),
  hideLogo: booleanQuerySchema
    .optional()
    .default("false")
    .describe(
      "Whether to hide the logo in the QR code. Can only be used with a paid plan on Dub.",
    ),
  margin: z.coerce
    .number()
    .optional()
    .default(DEFAULT_MARGIN)
    .describe(
      `The size of the margin around the QR code. Defaults to ${DEFAULT_MARGIN} if not provided.`,
    ),
  includeMargin: booleanQuerySchema
    .optional()
    .default("true")
    .describe(
      "DEPRECATED: Margin is included by default. Use the `margin` prop to customize the margin size.",
    ),
  // .openapi({ deprecated: true }),
});
