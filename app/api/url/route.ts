import { getUrlClicksByIds, getUserShortUrls } from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");
    const userName = url.searchParams.get("userName") || "";
    const slug = url.searchParams.get("slug") || "";
    const target = url.searchParams.get("target") || "";
    const data = await getUserShortUrls(
      user.id,
      1,
      Number(page || "1"),
      Number(size || "10"),
      "USER",
      userName,
      slug,
      target,
    );

    return Response.json(data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { ids } = await req.json();
    const data = await getUrlClicksByIds(ids, user.id, "USER");
    return Response.json(data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}
