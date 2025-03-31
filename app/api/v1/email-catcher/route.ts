import { OriginalEmail, saveForwardEmail } from "@/lib/dto/email";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as OriginalEmail;
    // console.log("Received email:", data);
    if (!data) {
      return Response.json("No email data received", { status: 400 });
    }
    await saveForwardEmail(data);

    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 500 });
  }
}
