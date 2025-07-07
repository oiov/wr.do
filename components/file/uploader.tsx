"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { formatFileSize } from "@/lib/utils";
import { BucketInfo, StorageUserPlan } from "@/components/file";

import { Icons } from "../shared/icons";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import DragAndDrop from "./drag-and-drop";
import UploadPending from "./upload-pending";

export type UploadPendingItemType = {
  uploadId: string;
  fileName: string;
  size: number;
  status: "uploading" | "completed" | "aborted";
  key: string;
  path?: string;
};

export type UploadProgressType = {
  id: string;
  progress: number;
};

export default function Uploader({
  bucketInfo,
  action,
  plan,
  onRefresh,
}: {
  bucketInfo: BucketInfo;
  action: string;
  plan?: StorageUserPlan;
  onRefresh: () => void;
}) {
  const t = useTranslations("Components");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const [pendingUpload, setPendingUpload] = useState<
    UploadPendingItemType[] | null
  >(null);
  const [progressList, setProgressList] = useState<UploadProgressType[]>();

  // Handles the upload process for selected files
  const handleUpload = useCallback(() => {
    selectedFile?.forEach((file: File) => {
      uploadFile(file);
      setSelectedFile((prev) => (prev ? prev.filter((f) => f !== file) : null));
    });
  }, [selectedFile]);

  // Starts the multipart upload process
  const startUpload = async (
    file: File,
  ): Promise<{ uploadId: string; key: string }> => {
    const formData = new FormData();
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("fileSize", file.size.toString());
    formData.append("bucket", bucketInfo.bucket);
    formData.append("prefix", bucketInfo.prefix || "");
    formData.append("endPoint", "create-multipart-upload");
    const response = await fetch(`${action}/r2/uploads`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data; // { uploadId, key }
  };

  // Uploads file parts in chunks
  const uploadParts = async (
    file: File,
    uploadId: string,
    key: string,
    onProgress: (progress: number) => void,
  ): Promise<{ ETag: string; PartNumber: number }[]> => {
    const chunkSize = 5 * 1024 * 1024; // 5MB for each chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    const parts: { ETag: string; PartNumber: number }[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      const partNumber = i + 1;

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("uploadId", uploadId);
      formData.append("key", key);
      formData.append("bucket", bucketInfo.bucket);
      formData.append("partNumber", partNumber.toString());
      formData.append("endPoint", "upload-part");
      const uploadResponse = await fetch(`${action}/r2/uploads`, {
        method: "POST",
        body: formData,
      });

      const responseData = await uploadResponse.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      if (responseData.etag) {
        parts.push({ ETag: responseData.etag, PartNumber: partNumber });
      }

      const progress = Math.round((partNumber / totalChunks) * 100);
      onProgress(progress);
    }

    return parts;
  };

  // Completes the multipart upload process
  const completeUpload = async (
    uploadId: string,
    key: string,
    parts: { ETag: string; PartNumber: number }[],
    file: File,
  ): Promise<{ Location: string }> => {
    const formData = new FormData();

    formData.append("key", key);
    formData.append("uploadId", uploadId);
    formData.append("bucket", bucketInfo.bucket);
    formData.append("parts", JSON.stringify(parts));
    formData.append("fileSize", file.size.toString());
    formData.append("fileType", file.type);
    formData.append("fileName", file.name);
    formData.append("endPoint", "complete-multipart-upload");
    const response = await fetch(`${action}/r2/uploads`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  };

  const abortUpload = async (uploadId: string, key: string) => {
    const formData = new FormData();
    formData.append("uploadId", uploadId);
    formData.append("key", key);
    formData.append("bucket", bucketInfo.bucket);
    formData.append("endPoint", "abort-multipart-upload");
    const response = await fetch(`${action}/r2/uploads`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    setPendingUpload(
      (prev) =>
        prev?.map((item) =>
          item.uploadId === uploadId
            ? { ...item, status: "aborted", path: "" }
            : item,
        ) ?? [],
    );
    return data;
  };

  const uploadFile = async (file: File): Promise<void> => {
    try {
      if (file.size > Number(plan?.stMaxFileSize || "26214400")) {
        toast.warning("Upload Failed", {
          description: `File '${file.name}' size exceeds the maximum allowed size of ${formatFileSize(Number(plan?.stMaxFileSize || "0"))} bytes.`,
        });
        return;
      }

      const { uploadId, key } = await startUpload(file);

      setProgressList((prev) => [
        ...(prev ?? []),
        { id: uploadId, progress: 0 },
      ]);

      setPendingUpload((prev) => [
        ...(prev ?? []),
        {
          uploadId,
          fileName: file.name,
          size: file.size,
          path: "",
          status: "uploading",
          key,
        },
      ]);
      const parts = await uploadParts(file, uploadId, key, (progress) => {
        // console.log(`Upload Progress: ${progress}%`);
        setProgressList(
          (prev) =>
            prev?.map((item) =>
              item.id === uploadId ? { ...item, progress } : item,
            ) ?? [],
        );
      });

      const result = await completeUpload(uploadId, key, parts, file);

      setProgressList(
        (prev) =>
          prev?.map((item) =>
            item.id === uploadId ? { ...item, progress: 100 } : item,
          ) ?? [],
      );

      setPendingUpload(
        (prev) =>
          prev?.map((item) =>
            item.uploadId === uploadId
              ? { ...item, status: "completed", path: result.Location }
              : item,
          ) ?? [],
      );

      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  // Triggers the upload process when files are selected
  useEffect(() => {
    if (selectedFile?.length) {
      handleUpload();
    }
  }, [selectedFile]);

  return (
    <>
      {!isOpen && (
        <Button
          className="flex h-9 items-center gap-1 text-nowrap"
          onClick={() => setIsOpen(true)}
        >
          <Icons.cloudUpload className="size-5" />
          {t("Upload Files")}
        </Button>
      )}
      {isOpen && (
        <Drawer open={isOpen} direction="right" onOpenChange={setIsOpen}>
          <DrawerContent className="h-screen w-full overflow-y-auto sm:max-w-xl">
            <DrawerHeader className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-1">
                {t("Upload Files")}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" className="">
                  <Icons.close className="size-4" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <DrawerDescription className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <div className="truncate">{bucketInfo.provider_name}</div>
                <Icons.arrowRight className="size-3" />
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  {bucketInfo.bucket}
                </div>
              </div>
              <p>
                Max:{" "}
                {formatFileSize(Number(plan?.stMaxFileSize || "0"), {
                  precision: 0,
                })}
              </p>
            </DrawerDescription>

            <div className="space-y-4 p-4">
              <DragAndDrop
                setSelectedFile={setSelectedFile}
                bucketInfo={bucketInfo}
              />
              <UploadPending
                pendingUpload={pendingUpload}
                progressList={progressList}
                bucketInfo={bucketInfo}
                onAbort={abortUpload}
              />
            </div>

            <DrawerFooter className="flex flex-row items-center justify-between gap-2">
              <DrawerClose asChild>
                <Button variant="outline">{t("Cancel")}</Button>
              </DrawerClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedFile([]);
                  setPendingUpload([]);
                  setProgressList([]);
                }}
              >
                {t("Clear")}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
