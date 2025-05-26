"use server";

import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { createUserShortUrlMeta, getUrlBySuffix } from "@/lib/dto/short-urls";

const redirectMap = {
  "Missing[0000]": "/docs/short-urls#missing-links",
  "Expired[0001]": "/docs/short-urls#expired-links",
  "Disabled[0002]": "/docs/short-urls#disabled-links",
  "Error[0003]": "/docs/short-urls#error-links",
  "PasswordRequired[0004]": "/password-prompt?error=0&slug=",
  "IncorrectPassword[0005]": "/password-prompt?error=1&slug=",
};

export async function RedirectsTo(data: any) {
  const {
    slug,
    referer,
    ip,
    city,
    region,
    country,
    latitude,
    longitude,
    lang,
    device,
    browser,
    password,
  } = data;

  if (!slug || !ip)
    return redirect(`${siteConfig.url}${redirectMap["Missing[0000]"]}${slug}`);

  const res = await getUrlBySuffix(slug);

  if (!res)
    return redirect(`${siteConfig.url}${redirectMap["Disabled[0002]"]}${slug}`);

  if (res.active !== 1)
    return redirect(`${siteConfig.url}${redirectMap["Disabled[0002]"]}${slug}`);

  if (res.password !== "") {
    if (!password) {
      return redirect(
        `${siteConfig.url}${redirectMap["PasswordRequired[0004]"]}${slug}`,
      );
    }
    if (password !== res.password) {
      return redirect(
        `${siteConfig.url}${redirectMap["IncorrectPassword[0005]"]}${slug}`,
      );
    }
  }

  const now = Date.now();
  const createdAt = new Date(res.updatedAt).getTime();
  const expirationMilliseconds = Number(res.expiration) * 1000;
  const expirationTime = createdAt + expirationMilliseconds;

  if (res.expiration !== "-1" && now > expirationTime) {
    return redirect(`${siteConfig.url}${redirectMap["Expired[0001]"]}`);
  }

  await createUserShortUrlMeta({
    urlId: res.id,
    click: 1,
    ip,
    city,
    region,
    country,
    latitude,
    longitude,
    referer,
    lang,
    device,
    browser,
  });
  console.log("到这了");

  redirect(res.target);
}
