"use client";

import React, { Dispatch, SetStateAction, useCallback } from "react";
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setSelectedFile((prev) => [...(prev ?? []), ...acceptedFiles]);
    },
    [setSelectedFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`grids flex h-52 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 duration-150 ${
        isDragActive
          ? "border-opacity-90 bg-muted/80 backdrop-blur-[2px]"
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
