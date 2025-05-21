import { redirect } from "next/navigation";

import {
  checkUserStatus,
  getAllUsersCount,
  setFirstUserAsAdmin,
} from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const count = await getAllUsersCount();

    if (count === 1 && user.role === "USER") {
      const res = await setFirstUserAsAdmin(user.id);
      if (res) {
        return Response.json({ admin: res.role === "ADMIN" }, { status: 201 });
      }
      return Response.json({ admin: false }, { status: 400 });
    }

    return redirect("/admin");
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}
