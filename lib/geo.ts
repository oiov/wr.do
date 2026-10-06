import { userAgent } from "next/server";
import { geolocation, ipAddress, type Geo } from "@vercel/functions";

export type GeoRequest = Request;

export type RequestGeo = Pick<
  Geo,
  "city" | "region" | "country" | "latitude" | "longitude" | "flag"
>;

function isValidIP(ip: string): boolean {
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return ip
      .split(".")
      .every((part) => Number(part) <= 255 && String(Number(part)) === part);
  }

  if (!ip.includes(":") || !/^[\da-f:.]+$/i.test(ip)) return false;
  try {
    return new URL(`http://[${ip}]/`).hostname.length > 0;
  } catch {
    return false;
  }
}

function forwardedIP(value: string): string | null {
  const first = value.split(",", 1)[0];
  const match = first.match(
    /(?:^|;)\s*for=(?:"([^";]+)"|([^;\s]+))(?:\s*;|\s*$)/i,
  );
  if (!match) return null;

  const raw = (match[1] || match[2]).trim();
  const candidate = raw.startsWith("[")
    ? raw.match(/^\[([^\]]+)\](?::\d+)?$/)?.[1]
    : raw.includes(".") && /^\d+(?:\.\d+){3}:\d+$/.test(raw)
      ? raw.replace(/:\d+$/, "")
      : raw;
  return candidate && isValidIP(candidate) ? candidate : null;
}

export function getClientIp(req: GeoRequest): string | null {
  if (process.env.VERCEL === "1") {
    const ip = ipAddress(req);
    return ip && isValidIP(ip) ? ip : null;
  }

  // These headers must be replaced by a trusted proxy. CF-Ray is only a
  // routing hint, not proof of origin: restrict access to the origin server.
  const viaCloudflare = req.headers.get("cf-ray") !== null;
  for (const name of ["cf-connecting-ip", "true-client-ip", "x-real-ip"]) {
    if (name === "x-real-ip" && viaCloudflare) continue;
    const value = req.headers.get(name)?.trim();
    if (value && isValidIP(value)) return value;
  }

  // Forwarded chains are client-controlled unless the ingress replaces them.
  if (process.env.GEO_TRUST_FORWARDED === "true") {
    const forwarded = req.headers.get("forwarded");
    if (forwarded) return forwardedIP(forwarded);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    return ip && isValidIP(ip) ? ip : null;
  }

  return null;
}

function coordinate(value: string | null, limit: number): string | undefined {
  if (!value?.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= limit
    ? String(number)
    : undefined;
}

export function getEdgeGeolocation(req: GeoRequest): RequestGeo {
  if (process.env.VERCEL === "1") {
    const geo = geolocation(req);
    return {
      city: geo.city,
      region: geo.countryRegion,
      country: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      flag: geo.flag,
    };
  }

  const country = req.headers.get("cf-ipcountry")?.trim().toUpperCase();
  return {
    city: req.headers.get("cf-ipcity") || undefined,
    region: req.headers.get("cf-region-code") || undefined,
    country:
      country && /^[A-Z]{2}$/.test(country) && country !== "XX"
        ? country
        : undefined,
    latitude: coordinate(req.headers.get("cf-iplatitude"), 90),
    longitude: coordinate(req.headers.get("cf-iplongitude"), 180),
  };
}

export function getUserAgent(req: GeoRequest) {
  return userAgent(req);
}
