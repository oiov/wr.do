import { auth } from "@/auth";

import { deleteUserById } from "@/lib/dto/user";

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser || !currentUser?.id) {
    return new Response("Invalid user", { status: 401 });
  }

  try {
    await deleteUserById(currentUser.id);
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("User deleted successfully!", { status: 200 });
});
