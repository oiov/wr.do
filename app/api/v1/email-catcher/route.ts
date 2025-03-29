import { createEmail, OriginalEmail } from "@/lib/dto/email";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as OriginalEmail;
    console.log("Received email:", data);
    if (!data) {
      return Response.json("No email data received", { status: 400 });
    }
    const res = await createEmail(data);
    console.log("[存储]", res);

    return Response.json({ msg: "success" });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
