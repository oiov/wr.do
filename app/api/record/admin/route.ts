import { getUserRecords } from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");

    const data = await getUserRecords(
      user.id,
      1,
      Number(page || "1"),
      Number(size || "10"),
      "ADMIN",
    );

    return Response.json(data);
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}
