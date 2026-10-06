import { isIP } from "node:net";
import maxmind, { type CityResponse, type Reader } from "maxmind";

import {
  getClientIp,
  getEdgeGeolocation,
  getUserAgent,
  type GeoRequest,
  type RequestGeo,
} from "./geo";

const DEFAULT_DB_PATH = "/app/geoip/GeoLite2-City.mmdb";
let readerPromise: Promise<Reader<CityResponse> | null> | undefined;

function getReader(): Promise<Reader<CityResponse> | null> {
  if (!readerPromise) {
    const path = process.env.MAXMIND_DB_PATH || DEFAULT_DB_PATH;
    readerPromise = maxmind.open<CityResponse>(path).catch((error) => {
      console.warn(
        `[geo] MaxMind database unavailable at ${path}; using edge location headers only:`,
        error instanceof Error ? error.message : error,
      );
      return null;
    });
  }
  return readerPromise;
}

export async function completeGeolocation(
  geo: RequestGeo,
  ip: string | null,
): Promise<RequestGeo> {
  if (
    process.env.VERCEL === "1" ||
    !ip ||
    !isIP(ip) ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    [geo.city, geo.region, geo.country, geo.latitude, geo.longitude].every(
      Boolean,
    )
  )
    return geo;
  const reader = await getReader();
  let result: CityResponse | null = null;
  try {
    result = reader?.get(ip) || null;
  } catch (error) {
    console.warn(
      "[geo] MaxMind lookup failed; using edge location headers only:",
      error instanceof Error ? error.message : error,
    );
  }

  return {
    city: geo.city || result?.city?.names?.en,
    region:
      geo.region ||
      result?.subdivisions?.[0]?.iso_code ||
      result?.subdivisions?.[0]?.names?.en,
    country: geo.country || result?.country?.iso_code,
    latitude: geo.latitude || result?.location?.latitude?.toString(),
    longitude: geo.longitude || result?.location?.longitude?.toString(),
    flag: geo.flag,
  };
}

export async function getIpInfo(req: GeoRequest) {
  const ip = getClientIp(req);
  const geo = await completeGeolocation(getEdgeGeolocation(req), ip);
  const ua = getUserAgent(req);

  return {
    referer: req.headers.get("referer") || "(None)",
    ip: ip || "127.0.0.1",
    city: geo.city || "",
    region: geo.region || "",
    country: geo.country || "",
    latitude: geo.latitude || "",
    longitude: geo.longitude || "",
    flag: geo.flag,
    lang: req.headers.get("accept-language")?.split(",")[0] || "en-US",
    device: ua.device.model || "Unknown",
    browser: ua.browser.name || "Unknown",
  };
}
