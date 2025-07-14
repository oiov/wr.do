// app/api/user-files/route.ts
import { NextRequest, NextResponse } from "next/server";

import { createUserFile } from "@/lib/dto/files";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { bytesToStorageValue } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const body = await request.json();

    const requiredFields = [
      "userId",
      "name",
      "originalName",
      "mimeType",
      "path",
      "size",
      "bucket",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `缺少必需字段: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    console.log(body);

    const userFile = await createUserFile({
      userId: body.userId,
      name: body.name,
      originalName: body.originalName,
      mimeType: body.mimeType,
      path: body.path,
      etag: body.etag || "",
      storageClass: body.storageClass || "",
      channel: body.channel || "",
      platform: body.platform || "",
      providerName: body.providerName || "",
      size: bytesToStorageValue(body.size),
      bucket: body.bucket,
      lastModified: body.lastModified
        ? new Date(body.lastModified)
        : new Date(),
    });

    return NextResponse.json({
      success: true,
      data: userFile,
      message: "success",
    });
  } catch (error: any) {
    console.error("Error creating user file:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error creating user file",
      },
      { status: 500 },
    );
  }
}

// 批量创建用户文件数据
export async function PUT(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { files } = await request.json();

    if (!Array.isArray(files)) {
      return NextResponse.json(
        {
          success: false,
          error: "File list must be an array",
        },
        { status: 400 },
      );
    }

    const results = await Promise.allSettled(
      files.map((file) => createUserFile(file)),
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      data: {
        total: files.length,
        successful,
        failed,
        results: results.map((result, index) => ({
          index,
          status: result.status,
          data: result.status === "fulfilled" ? result.value : null,
          error: result.status === "rejected" ? result.reason.message : null,
        })),
      },
      message: `Complete: ${successful} success, ${failed} failed`,
    });
  } catch (error: any) {
    console.error("Create user files failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Create user files failed",
      },
      { status: 500 },
    );
  }
}
