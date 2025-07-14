import { NextRequest, NextResponse } from "next/server";

import { updateUserFile } from "@/lib/dto/files";
import { getUserShortLinksByIds } from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { ids } = await request.json();
    if (!ids) {
      return NextResponse.json({ error: "Ids are required" }, { status: 400 });
    }

    const data = await getUserShortLinksByIds(ids, user.id);

    const dataMap = new Map(data.map((item) => [item.id, item]));

    const orderedResults = ids.map((id) => {
      const item = dataMap.get(id);
      return item ? `${item.prefix}/s/${item.url}` : "";
    });

    return NextResponse.json({
      urls: orderedResults,
    });
  } catch (error) {
    return NextResponse.json("Error generating download URL", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { urlId, fileId } = await request.json();

    if (!urlId || !fileId) {
      return NextResponse.json(
        { error: "Slug and fileId are required" },
        { status: 400 },
      );
    }

    const res = await updateUserFile(fileId, {
      shortUrlId: urlId,
    });

    if (res.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating download URL" },
      { status: 500 },
    );
  }
}
