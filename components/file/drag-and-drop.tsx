"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";

import { BucketInfo } from "@/components/file";

import { Icons } from "../shared/icons";
import { Button } from "../ui/button";

const DragAndDrop = ({
  setSelectedFile,
  bucketInfo,
}: {
  setSelectedFile: Dispatch<SetStateAction<File[] | null>>;
  bucketInfo: BucketInfo;
}) => {
  const t = useTranslations("Components");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPasteActive, setIsPasteActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setSelectedFile((prev) => [...acceptedFiles]);
    },
    [setSelectedFile],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) {
        return;
      }

      const items = clipboardData.items;
      const files: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // 检查是否是文件类型
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        event.preventDefault();
        setSelectedFile(files);
        setIsPasteActive(true);
        setTimeout(() => setIsPasteActive(false), 2000);
      }
    },
    [setSelectedFile],
  );

  useEffect(() => {
    const handleGlobalPaste = (event: ClipboardEvent) => {
      handlePaste(event);
    };

    document.addEventListener("paste", handleGlobalPaste);

    return () => {
      document.removeEventListener("paste", handleGlobalPaste);
    };
  }, [handlePaste]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      ref={containerRef}
      {...getRootProps()}
      tabIndex={0}
      className={`grids flex h-52 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        isDragActive
          ? "border-opacity-90 bg-muted/80 backdrop-blur-[2px]"
          : isPasteActive
            ? "border-green-500 bg-green-50 backdrop-blur-[2px]"
            : "border-opacity-50 bg-muted/10 backdrop-blur-[1px]"
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="mx-auto w-fit transition-all duration-300">
          <Icons.cloudUpload className="size-20" />
        </div>
        {isDragActive ? (
          <div className="animate-fade-in text-primary">
            {t("Drop files to upload them to")} {bucketInfo.bucket}
          </div>
        ) : isPasteActive ? (
          <div className="animate-fade-in text-green-600">
            {t("Files pasted successfully")}
          </div>
        ) : (
          <div className="animate-fade-out">
            <p>{t("Drag and drop file(s) here")}</p>
            <p className="my-2 text-sm text-muted-foreground">{t("or")}</p>
            <Button size="sm">{t("Browse file(s)")}</Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DragAndDrop;
