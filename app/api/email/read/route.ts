import { NextRequest, NextResponse } from "next/server";

import {
  markAllEmailsAsRead,
  markEmailAsRead,
  markEmailsAsRead,
} from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

// 处理单封邮件标记为已读 (POST)
export async function POST(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const body = await request.json();
    const { emailId } = body;

    if (!emailId) {
      return NextResponse.json(
        { error: "缺少必要的参数: emailId" },
        { status: 400 },
      );
    }

    await markEmailAsRead(emailId, user.id);
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "服务器错误",
      },
      { status: 500 },
    );
  }
}

// 处理批量标记为已读 (PUT)
export async function PUT(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const body = await request.json();
    const { emailIds } = body;

    if (!emailIds || !Array.isArray(emailIds)) {
      return NextResponse.json(
        { error: "缺少必要的参数: emailIds 必须是数组" },
        { status: 400 },
      );
    }

    await markEmailsAsRead(emailIds, user.id);
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "服务器错误",
      },
      { status: 500 },
    );
  }
}

// 处理将所有邮件标记为已读 (PATCH)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmailId, userId } = body;

    if (!userEmailId || !userId) {
      return NextResponse.json(
        { error: "缺少必要的参数: userEmailId 和 userId" },
        { status: 400 },
      );
    }

    await markAllEmailsAsRead(userEmailId, userId);
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "服务器错误",
      },
      { status: 500 },
    );
  }
}
