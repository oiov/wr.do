interface GeoData {
  ip: string;
  ipVersion?: string;
  country: string;
  city: string;
  region: string;
  timezone?: string;
  isp?: string;
  asn?: number;
  latitude: string;
  longitude: string;
}

export async function getClientGeolocation(): Promise<GeoData | null> {
  const response = await fetch("https://ip.wr.do/api", {
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) return null;
  return await response.json();
}

export function extractRealIP(headers: Headers): string {
  // 按优先级检查不同的IP头
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
      // X-Forwarded-For 可能包含多个IP，取第一个
      const ip = value.split(",")[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  return "";
}

function isValidIP(ip: string): boolean {
  // IPv4 正则
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 正则（简化版）
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
