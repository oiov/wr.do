import { checkUserStatus, updateUser } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

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

    const { id, data } = await req.json();

    const res = await updateUser(id, {
      name: data.name,
      email: data.email,
      role: data.role,
      active: data.active,
      team: data.team,
      image: data.image,
      apiKey: data.apiKey,
    });
    if (!res?.id) {
      return Response.json("An error occurred", {
        status: 400,
        statusText: "An error occurred",
      });
    }
    return Response.json("success");
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
