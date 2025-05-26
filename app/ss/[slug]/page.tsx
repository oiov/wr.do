import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UAParser from "ua-parser-js";

import { siteConfig } from "@/config/site";
import { createUserShortUrlMeta, getUrlBySuffix } from "@/lib/dto/short-urls";
import { extractRealIP, getClientGeolocation } from "@/lib/geo";

const redirectMap = {
  "Missing[0000]": "/docs/short-urls#missing-links",
  "Expired[0001]": "/docs/short-urls#expired-links",
  "Disabled[0002]": "/docs/short-urls#disabled-links",
  "Error[0003]": "/docs/short-urls#error-links",
  "PasswordRequired[0004]": "/password-prompt?error=0&slug=",
  "IncorrectPassword[0005]": "/password-prompt?error=1&slug=",
};

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    password?: string;
  };
}

export default async function ShortUrlPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = params;
  const { password = "" } = searchParams;

  if (!slug) redirect(redirectMap["Missing[0000]"]);

  try {
    // 获取请求头信息
    const headersList = headers();
    const userAgent = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || "(None)";
    const acceptLanguage = headersList.get("accept-language");

    const realIP = extractRealIP(headersList);

    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const device = parser.getDevice();

    const geo = await getClientGeolocation();

    // const trackingData = {
    //   slug,
    //   referer,
    //   ip: realIP,
    //   city: geo?.city,
    //   region: geo?.region,
    //   country: geo?.country,
    //   latitude: geo?.latitude,
    //   longitude: geo?.longitude,
    //   // flag: geo?.flag,
    //   lang: acceptLanguage?.split(",")[0],
    //   device: device.model || "Unknown",
    //   browser: browser.name || "Unknown",
    //   password,
    // };

    const data = await getUrlBySuffix(slug);
    if (!data || data.active !== 1) redirect(redirectMap["Disabled[0002]"]);

    if (data.password !== "") {
      if (!password) {
        redirect(redirectMap["PasswordRequired[0004]"]);
      }
      if (password !== data.password) {
        redirect(redirectMap["IncorrectPassword[0005]"]);
      }
    }

    const now = Date.now();
    const createdAt = new Date(data.updatedAt).getTime();
    const expirationMilliseconds = Number(data.expiration) * 1000;
    const expirationTime = createdAt + expirationMilliseconds;

    if (data.expiration !== "-1" && now > expirationTime) {
      redirect(redirectMap["Expired[0001]"]);
    }

    await createUserShortUrlMeta({
      urlId: data.id,
      click: 1,
      ip: realIP,
      city: geo?.city || "",
      region: geo?.region || "",
      country: geo?.country || "",
      latitude: geo?.latitude || "",
      longitude: geo?.longitude || "",
      referer,
      lang: acceptLanguage?.split(",")[0] || "",
      device: device.model || "Unknown",
      browser: browser.name || "Unknown",
    });

    // 重定向到目标URL
    window.location.href = data.target;
    // redirect(data.target);
  } catch (error) {
    console.error("Short URL redirect error:", error);
    redirect("/");
  }
}
