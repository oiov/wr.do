"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import {
  Archive,
  Download,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileType2,
  FileVideo,
  Folder,
  ImageOff,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { UserFileData } from "@/lib/dto/files";
import {
  cn,
  downloadFileFromUrl,
  formatDate,
  formatFileSize,
  storageValueToBytes,
  truncateMiddle,
} from "@/lib/utils";
import { ClickableTooltip } from "@/components/ui/tooltip";
import { BucketInfo, DisplayType, FileListData } from "@/components/file";

import { UrlForm } from "../forms/url-form";
import { CopyButton } from "../shared/copy-button";
import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { Icons } from "../shared/icons";
import QRCodeEditor from "../shared/qr";
import { TimeAgoIntl } from "../shared/time-ago";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Modal } from "../ui/modal";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import { TableCell, TableRow } from "../ui/table";

interface Props {
  user: Pick<User, "id" | "name" | "apiKey" | "email" | "role" | "team">;
  files?: FileListData;
  isLoading: boolean;
  bucketInfo: BucketInfo;
  action: string;
  view: DisplayType;
  showMutiCheckBox: boolean;
  selectedFiles: UserFileData[];
  setSelectedFiles: (files: UserFileData[]) => void;
  onRefresh: () => void;
  onSelectAll: () => void;
  onDeleteAll: () => void;
}

export default function UserFileList({
  user,
  files,
  isLoading,
  bucketInfo,
  action,
  view,
  showMutiCheckBox,
  selectedFiles,
  setSelectedFiles,
  onRefresh,
  onSelectAll,
}: Props) {
  const t = useTranslations("List");
  const [isShowForm, setShowForm] = useState(false);
  const [shortTarget, setShortTarget] = useState<UserFileData | null>(null);
  const [shortLinks, setShortLinks] = useState<string[]>([]);
  const [isShowQrcode, setShowQrcode] = useState(false);
  const [currentSelectFile, setCurrentSelectFile] =
    useState<UserFileData | null>();

  // const isAdmin = action.includes("/admin");

  const getFileUrl = (key: string) => {
    return `${bucketInfo.custom_domain}/${key}`;
  };

  const handleSelectFile = (file: UserFileData) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleDownload = async (key: string, type: "download" | "raw") => {
    try {
      const response = await fetch(`${action}/s3/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          bucket: bucketInfo.bucket,
          provider: bucketInfo.provider_name,
        }),
      });
      const { signedUrl } = await response.json();
      type === "download"
        ? downloadFileFromUrl(signedUrl, key)
        : window.open(signedUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const handleDeleteSingle = async (file: UserFileData) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      toast.promise(
        fetch(`${action}/s3/files`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keys: [file.path],
            ids: [file.id],
            bucket: bucketInfo.bucket,
            provider: bucketInfo.provider_name,
          }),
        }),
        {
          loading: "Deleting file...",
          success: "File deleted successfully!",
          error: "Error deleting file",
          finally: onRefresh,
        },
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.success("Error deleting file");
    }
  };

  const handleGenerateShortLink = async (urlId: string) => {
    if (!shortTarget) return;
    try {
      const response = await fetch(`${action}/s3/files/short`, {
        method: "PUT",
        body: JSON.stringify({ urlId, fileId: shortTarget?.id }),
      });
      if (!response.ok || response.status !== 200) {
        toast.error("Error generating short link");
      } else {
        onRefresh();
      }
    } catch (error) {
      console.error("Error generating short link:", error);
      toast.error("Error generating short link");
    }
  };

  const handleGetFileShortLinkByIds = async () => {
    if (!files || !files.list) return;
    try {
      const ids = files.list.map((f) => f.shortUrlId || "");
      if (!ids?.some((id) => id !== "")) return;
      const response = await fetch(`${action}/s3/files/short`, {
        method: "POST",
        body: JSON.stringify({ ids }),
      });
      if (!response.ok || response.status !== 200) {
      } else {
        const data = await response.json();
        setShortLinks(data.urls);
      }
    } catch (error) {
      console.error("Error get short link:", error);
    }
  };

  useEffect(() => {
    handleGetFileShortLinkByIds();
  }, [files]);

  if (files && files.total === 0) {
    return (
      <EmptyPlaceholder className="col-span-full shadow-none">
        <EmptyPlaceholder.Icon name="fileText" />
        <EmptyPlaceholder.Title>{t("No Files")}</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          {t("You don't upload any files yet")}
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  const renderFileLinks = (file: UserFileData, index: number) => (
    <>
      <div className="flex items-center gap-2">
        <Icons.fileText className="size-3 flex-shrink-0" />
        <p className="line-clamp-1 truncate rounded-md bg-neutral-100 p-1.5 text-xs dark:bg-neutral-800">
          {file.path}
        </p>
        <CopyButton className="size-6" value={file.path} />
      </div>
      {file.shortUrlId && (
        <div className="flex items-center gap-2">
          <Icons.unLink className="size-3 flex-shrink-0 text-blue-500" />
          <Link
            href={"https://" + shortLinks[index]}
            className="line-clamp-1 truncate rounded-md bg-neutral-100 p-1.5 text-xs hover:text-blue-500 dark:bg-neutral-800"
            target="_blank"
          >
            https://{shortLinks[index]}
          </Link>
          <CopyButton
            className="size-6"
            value={`https://${shortLinks[index]}`}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Icons.link className="size-3 flex-shrink-0" />
        <Link
          href={getFileUrl(file.path)}
          className="line-clamp-1 truncate rounded-md bg-neutral-100 p-1.5 text-xs hover:text-blue-500 dark:bg-neutral-800"
          target="_blank"
        >
          {getFileUrl(file.path)}
        </Link>
        <CopyButton className="size-6" value={getFileUrl(file.path)} />
      </div>
      <div className="flex items-center gap-2">
        <Icons.type className="size-3 flex-shrink-0" />
        <p className="line-clamp-1 truncate rounded-md bg-neutral-100 p-1.5 text-xs hover:text-blue-500 dark:bg-neutral-800">
          {`[${file.name}](${getFileUrl(file.path)})`}
        </p>
        <CopyButton
          className="size-6"
          value={`[${file.name}](${getFileUrl(file.path)})`}
        />
      </div>
      {file.mimeType.startsWith("image/") && (
        <div className="flex items-center gap-2">
          <Icons.code className="size-3 flex-shrink-0" />
          <p className="line-clamp-1 truncate rounded-md bg-neutral-100 p-1.5 text-xs hover:text-blue-500 dark:bg-neutral-800">
            {`<img src="${getFileUrl(file.path)}" alt="${file.name}">${getFileUrl(file.path)}</img>`}
          </p>
          <CopyButton
            className="size-6"
            value={`<img src="${getFileUrl(file.path)}" alt="${file.name}">${getFileUrl(file.path)}</img>`}
          />
        </div>
      )}
    </>
  );

  const renderListView = () => (
    <div className="overflow-hidden rounded-lg border bg-primary-foreground">
      <div className="text-mute-foreground grid grid-cols-5 gap-4 bg-neutral-100 px-6 py-3 text-sm font-medium dark:bg-neutral-800 sm:grid-cols-10">
        {showMutiCheckBox && (
          <div className="col-end-1">
            <Checkbox
              className="mr-3 size-4 border-neutral-300 bg-neutral-100 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:data-[state=checked]:border-neutral-300 dark:data-[state=checked]:bg-neutral-300"
              checked={selectedFiles.length === files?.list.length}
              onCheckedChange={() => onSelectAll()}
            />
          </div>
        )}
        <div className={cn("col-span-3")}>{t("Name")}</div>
        <div className="col-span-2 hidden sm:flex">{t("Type")}</div>
        <div className="col-span-1">{t("Size")}</div>
        <div className="col-span-1 hidden sm:flex">{t("User")}</div>
        <div className="col-span-1 hidden sm:flex">{t("Date")}</div>
        <div className="col-span-1 hidden sm:flex">{t("Active")}</div>
        <div className="col-span-1">{t("Actions")}</div>
      </div>
      {isLoading ? (
        <>
          <TableColumnSekleton />
          <TableColumnSekleton />
          <TableColumnSekleton />
          <TableColumnSekleton />
          <TableColumnSekleton />
        </>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-600">
          {files?.list.map((file, index) => (
            <div
              key={file.id}
              className="text-mute-foreground grid grid-cols-5 gap-4 px-6 py-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-600 sm:grid-cols-10"
            >
              {showMutiCheckBox && (
                <div
                  className="col-end-1 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={
                      selectedFiles.find((f) => f.id === file.id) !== undefined
                    }
                    onCheckedChange={() => handleSelectFile(file)}
                    className="mr-3 size-4 border-neutral-300 bg-neutral-100 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:data-[state=checked]:border-neutral-300 dark:data-[state=checked]:bg-neutral-300"
                  />
                </div>
              )}
              <div className={cn("col-span-3 items-center space-x-3 text-sm")}>
                <ClickableTooltip
                  className={cn(
                    "flex cursor-pointer items-center justify-start gap-1 break-all text-start",
                    file.status !== 1 && "text-muted-foreground",
                  )}
                  content={
                    <div className="w-72 space-y-1 text-wrap p-3 text-start">
                      {file.mimeType.startsWith("image/") &&
                        file.status === 1 && (
                          <img
                            className="mb-2 max-h-[300px] w-fit rounded shadow"
                            width={300}
                            height={300}
                            src={getFileUrl(file.path)}
                            alt={`${file.name}`}
                          />
                        )}
                      {renderFileLinks(file, index)}
                    </div>
                  }
                >
                  {truncateMiddle(file.name, 36)}
                  {file.status === 1 && (
                    <CopyButton
                      className="size-6"
                      value={getFileUrl(file.name)}
                    />
                  )}
                </ClickableTooltip>
              </div>
              <div className="col-span-2 hidden items-center text-xs sm:flex">
                <Badge className="truncate" variant="outline">
                  {file.mimeType || "-"}
                </Badge>
              </div>
              <div className="col-span-1 flex items-center text-nowrap text-xs">
                {formatFileSize(storageValueToBytes(file.size) || 0)}
              </div>
              <div className="col-span-1 hidden items-center text-xs sm:flex">
                <ClickableTooltip
                  className="cursor-pointer truncate"
                  content={
                    <div className="p-2">
                      <p>{file.user.name}</p>
                      <p>{file.user.email}</p>
                    </div>
                  }
                >
                  {file.user.name ?? file.user.email}
                </ClickableTooltip>
              </div>
              <div className="col-span-1 hidden items-center text-nowrap text-xs sm:flex">
                <TimeAgoIntl date={file.updatedAt as Date} />
              </div>
              <div className="col-span-1 hidden items-center text-xs sm:flex">
                <Switch checked={file.status === 1} disabled />
              </div>
              <div className="col-span-1 flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="size-[25px] p-1.5"
                      size="sm"
                      variant="ghost"
                    >
                      <Icons.moreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Button
                        className="flex w-full items-center gap-2"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCurrentSelectFile(file);
                          setShowQrcode(!isShowQrcode);
                        }}
                      >
                        <Icons.qrcode className="size-4" />
                        {t("QR Code")}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button
                        className="flex w-full items-center gap-2"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShortTarget(file);
                          setShowForm(true);
                        }}
                      >
                        <Icons.link className="size-4" />
                        {file.shortUrlId
                          ? t("Update short link")
                          : t("Generate short link")}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button
                        className="flex w-full items-center gap-2"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(file.path, "raw")}
                      >
                        <Icons.eye className="size-4" />
                        {t("Raw Data")}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button
                        className="flex w-full items-center gap-2"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(file.path, "download")}
                      >
                        <Icons.download className="size-4" />
                        {t("Download")}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button
                        className="flex w-full items-center gap-2 text-red-500"
                        size="sm"
                        variant="ghost"
                        onClick={() => file.path && handleDeleteSingle(file)}
                      >
                        <Icons.trash className="size-4" />
                        {t("Delete File")}
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGridView = () => (
    <div
      className="grid justify-center justify-items-center gap-4 sm:justify-start"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 100px))",
      }}
    >
      {isLoading &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
          <Skeleton key={v} className="size-[100px]" />
        ))}
      {files?.list.map((file, index) => (
        <div
          key={file.id}
          className={cn(
            "group relative flex w-full cursor-pointer items-end rounded-md transition-all hover:bg-blue-50",
            selectedFiles.find((f) => f.id === file.id) !== undefined &&
              "bg-blue-50",
          )}
          onClick={() => handleSelectFile(file)}
        >
          <div className="flex w-full flex-col items-center justify-center space-y-1 py-1">
            {showMutiCheckBox && (
              <Checkbox
                checked={
                  selectedFiles.find((f) => f.id === file.id) !== undefined
                }
                // onCheckedChange={() => handleSelectFile(file)}
                className="absolute left-1 top-1 size-4 border-neutral-300 bg-neutral-100 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:data-[state=checked]:border-neutral-300 dark:data-[state=checked]:bg-neutral-300"
              />
            )}
            {React.cloneElement(getFileIcon(file, bucketInfo), { size: 40 })}
            <div className="w-full text-center">
              <ClickableTooltip
                className="mx-auto line-clamp-2 break-all px-2 pb-1 text-center text-xs font-medium text-muted-foreground group-hover:text-blue-500 sm:max-w-[100px]"
                content={
                  <div className="max-w-[300px] space-y-1 p-3 text-start">
                    {file.mimeType.startsWith("image/") &&
                      file.status === 1 && (
                        <img
                          className="mb-2 max-h-[300px] w-fit rounded shadow"
                          width={300}
                          height={300}
                          src={getFileUrl(file.path)}
                          alt={`${file.name}`}
                        />
                      )}
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">
                      {file.path}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <strong>Size:</strong>{" "}
                      {formatFileSize(storageValueToBytes(file.size) || 0)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <strong>Type:</strong> {file.mimeType || "-"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <strong>User:</strong> {file.user.name || file.user.email}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <strong>Modified:</strong>{" "}
                      {formatDate(file.lastModified?.toString() || "")}
                    </p>
                    {renderFileLinks(file, index)}
                    <div className="flex items-center justify-end space-x-1 pt-2">
                      <Button
                        className="flex h-7 w-full items-center gap-2 text-xs"
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(file.path, "raw")}
                        disabled={file.status !== 1}
                      >
                        <Icons.eye className="size-4" />
                        {t("Raw Data")}
                      </Button>
                      <Button
                        className="h-7 px-1.5 text-xs hover:bg-slate-100 dark:hover:text-primary-foreground"
                        size="sm"
                        variant={"outline"}
                        disabled={file.status !== 1}
                        onClick={() => {
                          setCurrentSelectFile(file);
                          setShowQrcode(!isShowQrcode);
                        }}
                      >
                        <Icons.qrcode className="size-4" />
                      </Button>
                      <Button
                        onClick={() => handleDownload(file.path, "download")}
                        className="h-7 px-1.5"
                        title="下载"
                        size="sm"
                        variant={"blue"}
                        disabled={file.status !== 1}
                      >
                        <Download className="size-4" />
                      </Button>
                      {file.status === 1 && (
                        <Button
                          onClick={() => handleDeleteSingle(file)}
                          className="h-7 px-1.5"
                          title="删除"
                          size="sm"
                          variant={"destructive"}
                          disabled={file.status !== 1}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                }
              >
                {truncateMiddle(file.name || "")}
              </ClickableTooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {view === "List" ? renderListView() : renderGridView()}

      <Modal
        className="md:max-w-2xl"
        showModal={isShowForm}
        setShowModal={setShowForm}
      >
        <UrlForm
          user={{ id: "", name: "" }}
          isShowForm={isShowForm}
          setShowForm={setShowForm}
          type="add"
          initData={{
            target: getFileUrl(shortTarget?.path || ""),
            userId: "",
            userName: "",
            url: "",
            prefix: "",
            visible: 1,
            active: 1,
            expiration: "-1",
            password: "",
          }}
          action="/api/url"
          onRefresh={handleGenerateShortLink}
        />
      </Modal>

      <Modal
        className="md:max-w-lg"
        showModal={isShowQrcode}
        setShowModal={setShowQrcode}
      >
        {currentSelectFile && (
          <QRCodeEditor
            user={{
              id: user.id,
              apiKey: user.apiKey || "",
              team: user.team || "free",
            }}
            url={getFileUrl(currentSelectFile.path)}
          />
        )}
      </Modal>
    </>
  );
}

function TableColumnSekleton() {
  return (
    <TableRow className="grid grid-cols-5 items-center sm:grid-cols-10">
      <TableCell className="col-span-3 flex">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="col-span-2 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 hidden sm:flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="col-span-1 flex">
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

const getFileIcon = (file: UserFileData, bucketInfo: BucketInfo) => {
  const filename = file.path;
  const mimeType = file.mimeType;
  const status = file.status;
  const iconProps = { size: 24, className: "text-gray-600" };

  // 如果没有 mimeType，回退到文件夹判断
  if (!mimeType) {
    if (filename.endsWith("/")) {
      return <Folder {...iconProps} className="text-yellow-500" />;
    }
    return <FileText {...iconProps} className="text-gray-500" />;
  }

  if (mimeType.startsWith("image/")) {
    if (mimeType === "image/svg+xml") {
      return <FileCode {...iconProps} className="text-blue-500" />;
    }
    if (status === 1) {
      return (
        <img
          className="max-h-12 w-fit max-w-24 rounded shadow"
          height={60}
          width={60}
          src={
            bucketInfo.custom_domain
              ? `${bucketInfo.custom_domain}/${filename}`
              : filename
          }
          alt={filename}
        />
      );
    } else {
      return <ImageOff {...iconProps} className="text-muted-foreground" />;
    }
  }

  // 压缩文件
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-rar-compressed" ||
    mimeType === "application/x-7z-compressed" ||
    mimeType === "application/x-tar" ||
    mimeType === "application/gzip" ||
    mimeType === "application/x-gzip"
  ) {
    return <Archive {...iconProps} className="text-orange-500" />;
  }

  // Microsoft Office 文档
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return <FileText {...iconProps} className="text-blue-600" />;
  }

  // Microsoft Office 演示文稿
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    mimeType === "application/vnd.ms-powerpoint"
  ) {
    return <FileText {...iconProps} className="text-red-500" />;
  }

  // Microsoft Office 电子表格
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "text/csv"
  ) {
    return <FileSpreadsheet {...iconProps} className="text-green-600" />;
  }

  // JSON 文件
  if (mimeType === "application/json") {
    return <FileCode {...iconProps} className="text-yellow-600" />;
  }

  // Markdown 文件
  if (mimeType === "text/markdown" || mimeType === "text/x-markdown") {
    return <FileType2 {...iconProps} className="text-gray-700" />;
  }

  // 代码文件
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/javascript" ||
    mimeType === "application/typescript" ||
    mimeType === "application/x-javascript" ||
    mimeType === "text/javascript" ||
    mimeType === "text/typescript"
  ) {
    return <FileCode {...iconProps} className="text-blue-400" />;
  }

  // PDF 文件
  if (mimeType === "application/pdf") {
    return <FileText {...iconProps} className="text-red-600" />;
  }

  // 音频文件
  if (mimeType.startsWith("audio/")) {
    return <FileAudio {...iconProps} className="text-purple-500" />;
  }

  // 视频文件
  if (mimeType.startsWith("video/")) {
    return <FileVideo {...iconProps} className="text-pink-500" />;
  }

  // 默认文件图标
  return <FileText {...iconProps} className="text-gray-500" />;
};
