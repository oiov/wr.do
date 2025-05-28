import { getUrlClicksByIds, getUserShortUrls } from "@/lib/dto/short-urls";
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
        statusText: "Unauthorized",
      });
    }

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
      "ADMIN",
      userName,
      slug,
      target,
    );

    return Response.json(data);
  } catch (error) {
    // console.log(error);
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}

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

    const { ids } = await req.json();
    const data = await getUrlClicksByIds(ids, user.id, "ADMIN");
    return Response.json(data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}
