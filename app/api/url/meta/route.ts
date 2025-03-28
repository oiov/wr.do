import { getUserUrlMetaInfo } from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const urlId = url.searchParams.get("id");
    const range = url.searchParams.get("range") || "24h";

    if (!urlId) {
      return Response.json("url id is required", {
        status: 400,
      });
    }

    const data = await getUserUrlMetaInfo(urlId, range);

    return Response.json(data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}
