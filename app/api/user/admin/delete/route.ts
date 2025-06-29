import { checkUserStatus, deleteUserById } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
      });
    }

    const { id } = await req.json();
    if (!id) {
      return Response.json("Id is required", {
        status: 400,
      });
    }

    const res = await deleteUserById(id);
    if (!res?.id) {
      return Response.json("An error occurred", {
        status: 400,
      });
    }
    return Response.json("success");
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
