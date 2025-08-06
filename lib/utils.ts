import crypto from "crypto";
import { Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import ms from "ms";
import { twMerge } from "tailwind-merge";

import { siteConfig } from "@/config/site";

import { TIME_RANGES } from "./enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      "Cloudflare",
      "DNS",
      "DNS Records",
      "Subdomains",
      "Short Link",
      "Email",
      "Open API",
      "Screenshot API",
    ],
    authors: [
      {
        name: "oiov",
      },
    ],
    creator: "oiov",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@yesmoree",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    manifest: `${siteConfig.url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function formatDate(input: string | number): string {
  const date = new Date(input);

  const locale = navigator.language || "en-US";

  return date.toLocaleDateString(locale, {
    second: "numeric",
    minute: "numeric",
    hour: "numeric",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(input: string | number): string {
  const date = new Date(input);

  const locale = navigator.language || "en-US";

  return date.toLocaleTimeString(locale, {
    // second: "numeric",
    minute: "numeric",
    hour: "numeric",
  });
}

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

export const expirationTime = (
  expiration: string,
  updatedAt?: Date,
  timeOnly?: boolean,
): string => {
  if (!expiration || !updatedAt) return "Invalid data";
  if (expiration === "-1") return "Never";

  const expirationSeconds = parseInt(expiration, 10);
  if (isNaN(expirationSeconds)) return "Invalid expiration format";

  const now = Date.now();
  const updatedAtTimestamp = new Date(updatedAt).getTime();
  const expirationMilliseconds = expirationSeconds * 1000;
  const expirationTime = updatedAtTimestamp + expirationMilliseconds;
  const remainingTime = expirationTime - now;
  if (remainingTime <= 0) return "Expired";

  const remainingTimeString = ms(remainingTime, { long: true });
  if (timeOnly) {
    return remainingTimeString;
  }
  return `${remainingTimeString}`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function nFormatter(num: number, digits: number = 2) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export const truncateMiddle = (
  text: string,
  maxLength: number = 20,
): string => {
  if (text.length <= maxLength) return text;

  // 找到最后一个点的位置（文件扩展名）
  const lastDotIndex = text.lastIndexOf(".");

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    // 没有扩展名，直接中间截断
    const half = Math.floor((maxLength - 3) / 2);
    return text.slice(0, half) + "..." + text.slice(-half);
  }

  const extension = text.slice(lastDotIndex);
  const nameWithoutExt = text.slice(0, lastDotIndex);

  // 如果扩展名太长，直接截断整个文件名
  if (extension.length > maxLength / 2) {
    const half = Math.floor((maxLength - 3) / 2);
    return text.slice(0, half) + "..." + text.slice(-half);
  }

  // 计算可用于文件名的长度
  const availableLength = maxLength - extension.length - 3;

  if (availableLength <= 0) {
    return "..." + extension;
  }

  // 如果文件名部分不需要截断
  if (nameWithoutExt.length <= availableLength) {
    return text;
  }

  // 中间截断文件名部分
  const startLength = Math.ceil(availableLength / 2);
  const endLength = Math.floor(availableLength / 2);

  return (
    nameWithoutExt.slice(0, startLength) +
    "..." +
    nameWithoutExt.slice(-endLength) +
    extension
  );
};

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }

  if (url.startsWith("/_static/")) {
    url = `${siteConfig.url}${url}`;
  }

  try {
    const response = await fetch(
      `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`,
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
};

export const placeholderBlurhash =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==";

export function generateSecret(length: number = 16): string {
  const buffer = crypto.randomBytes(length);
  return buffer.toString("hex");
}

export function generateUrlSuffix(length: number = 6): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  const randomValues = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += characters[randomValues[i] % charactersLength];
  }

  return result;
}

export function isLink(str: string): boolean {
  try {
    const url = new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

export function removeUrlPrefix(url: string): string {
  return url.startsWith("http") ? url.split("//")[1] : url;
}
export function addUrlPrefix(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

export function extractHostname(url: string): string {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch (error) {
    return "";
  }
}

export function toCamelCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export const getStartDate = (range: string): Date | undefined => {
  if (!range || !(range in TIME_RANGES)) return undefined;
  return new Date(Date.now() - TIME_RANGES[range]);
};

export function htmlToText(html: string): string {
  if (typeof window === "undefined") return html; // 服务端渲染时返回原始内容
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function formatFileSize(
  bytes: number,
  options: {
    precision?: number;
    binary?: boolean; // true for 1024, false for 1000
    longNames?: boolean; // true for "bytes", false for "B"
  } = {},
): string {
  const { precision = 1, binary = true, longNames = false } = options;

  // 输入验证
  if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) {
    return longNames ? "0 bytes" : "0 B";
  }

  if (bytes === 0) {
    return longNames ? "0 bytes" : "0 B";
  }

  const k = binary ? 1024 : 1000;
  const sizes = longNames
    ? ["bytes", "KB", "MB", "GB", "TB", "PB"]
    : ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizeIndex = Math.min(i, sizes.length - 1);
  const size = bytes / Math.pow(k, sizeIndex);

  // 特殊处理 bytes 单位的复数形式
  if (longNames && sizeIndex === 0) {
    return bytes === 1 ? "1 byte" : `${bytes} bytes`;
  }

  return `${size.toFixed(precision)} ${sizes[sizeIndex]}`;
}

export function downloadFile(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    a.setAttribute("rel", "noopener noreferrer");
    a.setAttribute("target", "_blank");

    try {
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export async function downloadFileFromUrl(
  url: string,
  filename: string,
): Promise<void> {
  try {
    // 获取文件内容
    const response = await fetch(url, {
      // credentials: "include", // 如果需要带上cookie
      // mode: "cors", // 处理跨域
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取 Blob
    const blob = await response.blob();

    // 创建下载 URL
    const downloadUrl = URL.createObjectURL(blob);

    // 创建下载链接
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;

    // 执行下载
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 清理
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("下载失败:", error);
    throw error;
  }
}

export const getSearchParams = (url: string) => {
  // Create a params object
  let params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const getUrlFromString = (str: string) => {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (_) {}
  return str;
};

export function extractHost(url: string): string {
  const regex = /^(?:https?:\/\/)?([^\/?:#]+)/i;
  const match = url.match(regex);
  return match ? match[1] : "";
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * 验证密码
 * @param password 用户输入的密码
 * @param storedPassword 数据库中存储的加密密码
 * @returns 是否匹配
 */
export function verifyPassword(
  password: string,
  storedPassword: string,
): boolean {
  const [salt, hash] = storedPassword.split(":");
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === hashToVerify;
}

export const formatFileSizeX = (bytes: number) => {
  if (bytes < 1048576) return (bytes / 1024).toFixed() + " KB";
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
  return (bytes / 1073741824).toFixed(2) + " GB";
};

export function extractFileName(filePath: string): string {
  if (!filePath || typeof filePath !== "string") {
    return "";
  }

  // 移除开头的斜杠
  let normalizedPath = filePath.trim();
  while (normalizedPath.startsWith("/")) {
    normalizedPath = normalizedPath.substring(1);
  }

  // 移除结尾的斜杠
  while (normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.substring(0, normalizedPath.length - 1);
  }

  // 如果路径为空，返回空字符串
  if (!normalizedPath) {
    return "";
  }

  // 提取文件名
  const lastSlashIndex = normalizedPath.lastIndexOf("/");
  return lastSlashIndex === -1
    ? normalizedPath
    : normalizedPath.substring(lastSlashIndex + 1);
}

// 提取文件扩展名
export function extractFileExtension(filePath: string): string {
  const fileName = extractFileName(filePath);

  if (!fileName) {
    return "";
  }

  const lastDotIndex = fileName.lastIndexOf(".");

  // 如果没有找到点，或者点在开头（隐藏文件），返回空字符串
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return "";
  }

  return fileName.substring(lastDotIndex + 1);
}

// 同时提取文件名和扩展名的组合函数
export function extractFileNameAndExtension(filePath: string): {
  fileName: string;
  extension: string;
  nameWithoutExtension: string;
} {
  const fileName = extractFileName(filePath);

  if (!fileName) {
    return {
      fileName: "",
      extension: "",
      nameWithoutExtension: "",
    };
  }

  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return {
      fileName: fileName,
      extension: "",
      nameWithoutExtension: fileName,
    };
  }

  return {
    fileName: fileName,
    extension: fileName.substring(lastDotIndex + 1),
    nameWithoutExtension: fileName.substring(0, lastDotIndex),
  };
}

export function generateFileKey(fileName: string, prefix?: string): string {
  if (prefix) {
    return `${prefix}/${fileName}`;
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}/${fileName}`;
}

const SIZE_THRESHOLD = 1000;
export function bytesToStorageValue(bytes: number): number {
  return bytes / SIZE_THRESHOLD;
}

export function storageValueToBytes(storageValue: number): number {
  return storageValue * SIZE_THRESHOLD;
}
