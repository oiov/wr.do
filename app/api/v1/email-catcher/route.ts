export async function POST(req: Request) {
  try {
    const data = await req.json();
    return Response.json({ data, msg: "success" });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
