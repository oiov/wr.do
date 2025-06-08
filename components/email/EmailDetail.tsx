"use client";

import { useState } from "react";
import { ForwardEmail } from "@prisma/client";
import {
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { cn, downloadFile, formatDate, formatFileSize } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";

import { BlurImg } from "../shared/blur-image";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import EmailViewer from "./EmailViewer";

interface EmailDetailProps {
  email: ForwardEmail | undefined;
  selectedEmailId: string | null;
  onClose: () => void;
  onMarkAsRead: () => void;
}

interface Attachment {
  filename: string;
  r2Path: string;
  mimeType: string;
  size: number;
}

const fileTypeMap: { [key: string]: string } = {
  "application/pdf": "pdf",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "audio/mpeg": "mp3",
  "video/mp4": "mp4",
  "application/zip": "zip",
  default: "unknown",
};

const fileTypeIcons: { [key: string]: React.ComponentType<any> } = {
  "application/pdf": FileText, // PDF 文件
  "image/jpeg": FileImage, // JPEG 图片
  "image/png": FileImage, // PNG 图片
  "image/gif": FileImage, // GIF 图片
  "application/msword": FileText, // Word 文档 (.doc)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FileText, // Word 文档 (.docx)
  "application/vnd.ms-excel": FileSpreadsheet, // Excel 表格 (.xls)
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    FileSpreadsheet, // Excel 表格 (.xlsx)
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    FileSpreadsheet, // PowerPoint 文档
  "audio/mpeg": FileAudio, // MP3 音频
  "video/mp4": FileVideo, // MP4 视频
  "application/zip": FileArchive, // ZIP 压缩文件
  default: File, // 默认图标
};

export default function EmailDetail({
  email,
  selectedEmailId,
  onClose,
  onMarkAsRead,
}: EmailDetailProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const t = useTranslations("Email");

  function getFileIcon(type: string): React.ComponentType<any> {
    const icon = Object.keys(fileTypeIcons).find((key) =>
      type.toLowerCase().startsWith(key),
    );
    return fileTypeIcons[icon || "default"];
  }

  const handleDownload = async (attachment: Attachment) => {
    downloadFile(
      `${siteConfig.emailR2Domain}/${attachment.r2Path}`,
      attachment.filename,
    );
    // downloadFileFromUrl(
    //   `${siteConfig.emailR2Domain}/${attachment.r2Path}`,
    //   attachment.filename,
    // );
  };

  if (!email) return null;

  let attachments: Attachment[] = [];
  try {
    if (email.attachments) {
      attachments = JSON.parse(email.attachments);
    }
  } catch (error) {
    console.log("Failed to parse attachments:", error);
  }

  // 处理邮件内容中的图片链接
  const processContent = (content: string): string => {
    if (!content || attachments.length === 0) return content;

    let processedContent = content;

    // 如果是 HTML，解析 DOM 并替换 <img> 标签的 src
    if (email.html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const images = Array.from(doc.getElementsByTagName("img")); // 转换为数组

      images.forEach((img) => {
        const alt = img.getAttribute("alt") || "";
        const matchingAttachment = attachments.find(
          (att) => att.filename === alt,
        );
        if (matchingAttachment) {
          img.setAttribute(
            "src",
            `${siteConfig.emailR2Domain}/${matchingAttachment.r2Path}`,
          );
        }
      });
      processedContent = doc.documentElement.outerHTML; // 返回完整的 HTML
    } else if (email.text) {
      // 如果是纯文本，替换文件名
      attachments.forEach((attachment) => {
        const regex = new RegExp(`\\b${attachment.filename}\\b`, "g");
        processedContent = processedContent.replace(
          regex,
          `${siteConfig.emailR2Domain}/${attachment.r2Path}`,
        );
      });
    }

    return processedContent;
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-primary-foreground text-primary shadow-md",
        selectedEmailId ? "animate-fade-in-right" : "animate-fade-in-left",
      )}
    >
      <div className="flex items-start justify-between gap-2 border-b px-2 py-2">
        <div
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-900 text-sm font-bold text-white"
        >
          {email.subject?.[0].toUpperCase() ||
            email.fromName?.[0].toUpperCase() ||
            "U"}
        </div>
        <div className="max-w-[80%] grow text-neutral-600 dark:text-neutral-300">
          <p className="text-sm">
            <strong>{email.subject}</strong>
          </p>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger className="line-clamp-2 text-wrap text-left text-xs">
                <strong>{t("From")}:</strong> {email.fromName} &lt;{email.from}
                &gt;
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-60 text-wrap text-xs">
                {email.fromName} <br />
                {email.from}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-xs">
            <strong>{t("To")}:</strong> {email.to}
          </p>
          {email.replyTo && email.replyTo !== '""' && (
            <p className="text-xs">
              <strong>{t("Reply-To")}:</strong> {email.replyTo}
            </p>
          )}
          <p className="text-xs">
            <strong>{t("Date")}:</strong> {formatDate(email.date as any)}
          </p>
          {attachments.length > 0 && (
            <p className="text-xs">
              <strong>{t("Attachments")}</strong>: {attachments.length}
            </p>
          )}
        </div>
        <Button
          className="ml-auto size-8 grow-0 px-1 py-1"
          size={"sm"}
          onClick={onClose}
          variant={"outline"}
        >
          <Icons.close className="size-4" />
        </Button>
      </div>

      <div className="scrollbar-hidden flex h-full flex-col justify-between overflow-y-auto">
        {/* <div
          className=""
          dangerouslySetInnerHTML={{
            __html: processContent(email.html || email.text || ""),
          }}
        /> */}
        <EmailViewer email={processContent(email.html || email.text || "")} />

        {attachments.length > 0 && (
          <div className="mt-auto border-t border-dashed px-2 py-3">
            <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-400">
              {t("Attachments")} ({attachments.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {attachments.map((attachment, index) => {
                const FileIcon = getFileIcon(attachment.mimeType); // 动态获取图标
                return (
                  <div
                    key={index}
                    className="group relative flex items-center justify-between rounded-md border border-dotted bg-gray-100 p-2 transition-shadow hover:border-dashed dark:bg-neutral-800"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {attachment.mimeType.startsWith("image/") ? (
                        <BlurImg
                          src={`${siteConfig.emailR2Domain}/${attachment.r2Path}`}
                          alt={attachment.filename}
                          className="h-10 w-10 cursor-pointer rounded object-cover"
                          onClick={() =>
                            setPreviewImage(
                              `${siteConfig.emailR2Domain}/${attachment.r2Path}`,
                            )
                          }
                        />
                      ) : (
                        <FileIcon className="size-4 text-neutral-500 dark:text-neutral-400" />
                      )}
                      <div>
                        <p
                          className="max-w-full truncate text-xs text-neutral-800 dark:text-neutral-400"
                          title={attachment.filename}
                        >
                          {attachment.filename}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {fileTypeMap[attachment.mimeType] ||
                            attachment.mimeType}{" "}
                          • {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(attachment)}
                      className="absolute right-1 top-1 hidden h-7 animate-fade-in px-2 group-hover:block"
                      size="sm"
                      variant="default"
                    >
                      <Icons.download className="size-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 图片预览 Modal */}
      {previewImage && (
        <Modal
          showModal={!!previewImage}
          setShowModal={() => setPreviewImage(null)}
        >
          <div className="flex flex-col items-center p-2">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
