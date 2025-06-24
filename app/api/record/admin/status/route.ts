import { getUserRecordStatus } from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
      });
    }

    const status = await getUserRecordStatus(user.id, "ADMIN");

    return Response.json(status);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}
