import { createEvent, getRecordEvents } from "@/lib/dto/han-event";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    if (!data || !data.name || !data.type) {
      return Response.json("请填写事件名称", {
        status: 400,
        statusText: "请填写事件名称",
      });
    }

    const res = await createEvent(data);

    if (res.status !== "success") {
      console.log(res.status);

      return Response.json(res.status, {
        status: 502,
        statusText: `An error occurred. ${res.status}`,
      });
    }
    return Response.json(res.data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");

    const data = await getRecordEvents(
      Number(page || "1"),
      Number(size || "10"),
    );

    return Response.json(data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
