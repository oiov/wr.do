export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    return Response.json({ email });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
