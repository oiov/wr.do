import { useCallback, useState } from "react";

import { extractFileNameAndExtension } from "@/lib/utils";
import { BucketInfo } from "@/components/file";

export interface FileUploadItem {
  id: string;
  file: File;
  fileName: string;
  originalName: string;
  url?: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error" | "cancelled";
  error?: string;
  abortController?: AbortController;
  etag?: string;
  userFileId?: string;
}

interface Props {
  bucketInfo: BucketInfo;
  userId?: string;
  api: string;
}

export function useFileUpload({ bucketInfo, userId, api }: Props) {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const uploadItems: FileUploadItem[] = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      fileName: "",
      originalName: file.name,
      progress: 0,
      status: "pending" as const,
      abortController: new AbortController(),
    }));

    setFiles((prev) => [...prev, ...uploadItems]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.abortController) {
        file.abortController.abort();
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const cancelUpload = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === id && file.abortController) {
          file.abortController.abort();
          return { ...file, status: "cancelled" as const };
        }
        return file;
      }),
    );
  }, []);

  const retryUpload = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === id) {
          return {
            ...file,
            status: "pending" as const,
            progress: 0,
            error: undefined,
            abortController: new AbortController(),
          };
        }
        return file;
      }),
    );
  }, []);

  const createUserFileData = async (item: FileUploadItem, etag: string) => {
    if (!userId) {
      return null;
    }

    try {
      const extractKey = extractFileNameAndExtension(item.fileName);
      const response = await fetch(`${api}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: extractKey.fileName,
          originalName: extractKey.nameWithoutExtension,
          mimeType: item.file.type || "-",
          path: item.fileName,
          etag,
          storageClass: "",
          channel: bucketInfo?.channel || "",
          platform: bucketInfo?.platform || "",
          providerName: bucketInfo?.provider_name || "",
          size: item.file.size,
          bucket: bucketInfo?.bucket || "",
          lastModified: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error creating user file data: ${response.statusText}`,
        );
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating user file data:", error);
      throw error;
    }
  };

  // 获取预签名 URL
  const getPresignedUrls = async (uploadFiles: FileUploadItem[]) => {
    const filesData = uploadFiles.map((item) => ({
      name: item.originalName,
      type: item.file.type,
      size: item.file.size,
    }));

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: filesData,
        prefix: bucketInfo.prefix,
        bucket: bucketInfo.bucket,
        provider: bucketInfo.provider_name,
      }),
    });

    if (!response.ok) {
      // 尝试获取后端返回的具体错误信息
      let errorMessage = "获取预签名 URL 失败";
      try {
        const errorText = await response.text();
        if (errorText) {
          // 如果返回的是JSON格式的错误信息，尝试解析
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorText;
          } catch {
            // 如果不是JSON，直接使用文本内容
            errorMessage = errorText;
          }
        }
      } catch {
        // 如果无法读取响应内容，使用默认错误信息
        errorMessage = `上传失败 (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.urls;
  };

  const uploadSingleFile = async (item: FileUploadItem) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles((prev) =>
            prev.map((file) =>
              file.id === item.id ? { ...file, progress } : file,
            ),
          );
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          try {
            // 从响应头获取 ETag
            const etag = xhr.getResponseHeader("ETag")?.replace(/"/g, "") || "";

            // 更新文件状态为已完成
            setFiles((prev) =>
              prev.map((file) =>
                file.id === item.id
                  ? { ...file, status: "completed", etag }
                  : file,
              ),
            );

            // 创建用户文件数据
            if (userId) {
              try {
                const userFileData = await createUserFileData(item, etag);
                setFiles((prev) =>
                  prev.map((file) =>
                    file.id === item.id
                      ? { ...file, userFileId: userFileData?.id }
                      : file,
                  ),
                );
              } catch (userFileError) {
                console.error("创建用户文件数据失败:", userFileError);
                setFiles((prev) =>
                  prev.map((file) =>
                    file.id === item.id
                      ? {
                          ...file,
                          error: `文件上传成功，但创建记录失败: ${userFileError}`,
                        }
                      : file,
                  ),
                );
              }
            }

            resolve();
          } catch (error) {
            console.error("上传后处理失败:", error);
            setFiles((prev) =>
              prev.map((file) =>
                file.id === item.id
                  ? {
                      ...file,
                      status: "error",
                      error: `上传后处理失败: ${error}`,
                    }
                  : file,
              ),
            );
            reject(error);
          }
        } else {
          setFiles((prev) =>
            prev.map((file) =>
              file.id === item.id
                ? {
                    ...file,
                    status: "error",
                    error: `上传失败: ${xhr.statusText}`,
                  }
                : file,
            ),
          );
          reject(new Error(`上传失败: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        let errorMessage = "网络错误";
        if (xhr.status === 0) {
          errorMessage = "CORS 错误或网络连接问题";
        } else if (xhr.status >= 400) {
          errorMessage = `上传失败 (${xhr.status})`;
        }

        setFiles((prev) =>
          prev.map((file) =>
            file.id === item.id
              ? {
                  ...file,
                  status: "error",
                  error: errorMessage,
                }
              : file,
          ),
        );
        reject(new Error(errorMessage));
      };

      xhr.onabort = () => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === item.id ? { ...file, status: "cancelled" } : file,
          ),
        );
        reject(new Error("上传已取消"));
      };

      // 监听取消信号
      if (item.abortController) {
        item.abortController.signal.addEventListener("abort", () => {
          xhr.abort();
        });
      }

      xhr.open("PUT", item.url!);
      xhr.setRequestHeader("Content-Type", item.file.type);
      xhr.send(item.file);
    });
  };

  const startUpload = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      // 获取预签名 URL
      const urls = await getPresignedUrls(pendingFiles);

      // 更新文件信息
      setFiles((prev) =>
        prev.map((file) => {
          const urlInfo = urls.find(
            (u: any) => u.originalName === file.originalName,
          );
          if (urlInfo && file.status === "pending") {
            return {
              ...file,
              url: urlInfo.url,
              fileName: urlInfo.fileName,
              status: "uploading" as const,
            };
          }
          return file;
        }),
      );

      // 并发上传文件
      const uploadPromises = pendingFiles.map(async (file) => {
        const urlInfo = urls.find(
          (u: any) => u.originalName === file.originalName,
        );
        if (urlInfo) {
          const updatedFile = {
            ...file,
            url: urlInfo.url,
            fileName: urlInfo.fileName,
          };
          return uploadSingleFile(updatedFile);
        }
      });

      await Promise.allSettled(uploadPromises);
    } catch (error) {
      console.error("上传失败:", error);
      // 将所有 pending 状态的文件设置为错误状态，并显示具体错误信息
      const errorMessage = error instanceof Error ? error.message : "上传失败";
      setFiles((prev) =>
        prev.map((file) =>
          file.status === "pending"
            ? {
                ...file,
                status: "error",
                error: errorMessage,
              }
            : file,
        ),
      );
    } finally {
      setIsUploading(false);
    }
  }, [files]);

  const clearAll = useCallback(() => {
    files.forEach((file) => {
      if (file.abortController) {
        file.abortController.abort();
      }
    });
    setFiles([]);
  }, [files]);

  const stats = {
    total: files.length,
    pending: files.filter((f) => f.status === "pending").length,
    uploading: files.filter((f) => f.status === "uploading").length,
    completed: files.filter((f) => f.status === "completed").length,
    error: files.filter((f) => f.status === "error").length,
    cancelled: files.filter((f) => f.status === "cancelled").length,
  };

  return {
    files,
    isUploading,
    stats,
    addFiles,
    removeFile,
    cancelUpload,
    retryUpload,
    startUpload,
    clearAll,
  };
}
