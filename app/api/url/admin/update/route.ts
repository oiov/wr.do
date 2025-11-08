import { env } from "@/env.mjs";
import { getUserRecords } from "@/lib/dto/cloudflare-dns-record";
import {
  updateUserShortUrl,
  updateUserShortUrlAdmin,
} from "@/lib/dto/short-urls";
import { checkUserStatus, getUserByEmail } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { createUrlSchema } from "@/lib/validations/url";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { data, userId, email } = await req.json();
    if (!data?.id || !userId) {
      return Response.json(`Url id is required`, {
        status: 400,
        statusText: `Url id is required`,
      });
    }

    const target_user = await getUserByEmail(email);
    if (!target_user) {
      return Response.json("User not found", {
        status: 404,
        statusText: "User not found",
      });
    }

    const { target, url, prefix, visible, active, id, expiration, password } =
      createUrlSchema.parse(data);
    const res = await updateUserShortUrlAdmin(
      {
        id,
        userId: userId,
        userName: "",
        target,
        url,
        prefix,
        visible,
        active,
        expiration,
        password,
      },
      target_user.id,
    );
    if (res.status !== "success") {
      console.log(res);

      return Response.json(res.status, {
        status: 400,
        statusText: `An error occurred. ${res.status}`,
      });
    }
    return Response.json(res.data);
  } catch (error) {
    console.log(error);
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
