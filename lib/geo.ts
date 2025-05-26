import { userAgent } from "next/server";
import { Geo, geolocation, ipAddress } from "@vercel/functions";
import { NextAuthRequest } from "next-auth/lib";
import UAParser from "ua-parser-js";

interface GeoLocation extends Geo {
  ip?: string;
}

const isVercel = process.env.VERCEL;

export async function getGeolocation(
  req: NextAuthRequest,
  ip: string,
): Promise<GeoLocation | null> {
  console.log("[Runtime Env]", isVercel ? "Vercel" : "Other");

  if (isVercel) {
    return geolocation(req);
  } else {
    return await getClientGeolocation(req, ip);
  }
}

export function getUserAgent(req: NextAuthRequest) {
  if (isVercel) {
    return userAgent(req);
  } else {
    const headers = req.headers;
    const userAgent = headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    return {
      browser: parser.getBrowser(),
      device: parser.getDevice(),
      os: parser.getOS(),
      engine: parser.getEngine(),
      cpu: parser.getCPU(),
      isBot: false,
    };
  }
}

export async function getClientGeolocation(
  req,
  ip,
): Promise<GeoLocation | null> {
  const new_headers = new Headers();
  new_headers.set("X-Forwarded-For", ip);
  new_headers.set("User-Agent", req.headers.get("user-agent") || "");
  const response = await fetch(`https://ip.wr.do/api?ip=${ip}`, {
    // signal: AbortSignal.timeout(3000),
    headers: new_headers,
  });
  if (!response.ok) return null;
  return await response.json();
}

export function extractRealIP(headers: Headers): string {
  const ipHeaders = [
    "X-Forwarded-For",
    "X-Real-IP",
    "CF-Connecting-IP",
    "X-Client-IP",
    "X-Cluster-Client-IP",
  ];

  for (const header of ipHeaders) {
    const value = headers.get(header);
    if (value) {
      const ip = value.split(",")[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  return "::1";
}

function isValidIP(ip: string): boolean {
  // IPv4 正则
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 正则（简化版）
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export async function getIpInfo(req) {
  const headers = req.headers;
  const ip = isVercel ? ipAddress(req) : extractRealIP(headers);
  const ua = getUserAgent(req);
  const geo = await getGeolocation(req, ip || "::1");

  const userLanguage =
    req.headers.get("accept-language")?.split(",")[0] || "en-US";

  return {
    referer: headers.get("referer") || "(None)",
    ip: isVercel ? ip : geo?.ip,
    city: geo?.city || "",
    region: geo?.region || "",
    country: geo?.country || "",
    latitude: geo?.latitude || "",
    longitude: geo?.longitude || "",
    flag: geo?.flag,
    lang: userLanguage,
    device: ua.device.model || "Unknown",
    browser: ua.browser.name || "Unknown",
  };
}
