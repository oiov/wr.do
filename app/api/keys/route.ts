import { generateApiKey } from "@/lib/dto/api-key";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const res = await generateApiKey(user.id);
    if (res) {
      return Response.json(res.apiKey);
    }
    return Response.json({ statusText: "Server error" }, { status: 501 });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
