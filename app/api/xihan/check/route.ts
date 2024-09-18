import { getEventByName } from "@/lib/dto/han-event";
import { isSameDate } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { name, answer } = await req.json();
    if (!name || !answer) {
      return Response.json("name or answer is required", {
        status: 400,
        statusText: "name or answer is required",
      });
    }

    const res = await getEventByName(name);
    if (!res) {
      return Response.json("event not found", {
        status: 404,
        statusText: "event not found",
      });
    }

    if (isSameDate(res.firstOccurredAt, answer)) {
      return Response.json(202);
    }
    const d1 = res.firstOccurredAt.toLocaleString().slice(0, 9);
    const d2 = answer.replace(/\./g, "/");
    return Response.json({ d1, d2 });
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
