export async function POST(req: Request) {
  try {
    // const user = checkUserStatus(await getCurrentUser());
    // if (user instanceof Response) return user;
    // if (user.role !== "ADMIN") {
    //   return Response.json("Unauthorized", {
    //     status: 401,
    //     statusText: "Unauthorized",
    //   });
    // }
    // const body = await req.json();
    // const { id, ...data } = body;
    // const result = await updateUserById(id, data);
    return Response.json("success");
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
