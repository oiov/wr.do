import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locales = ["en", "zh"];
  const defaultLocale = "en";

  const headersList = headers();
  // 获取 cookie 中的语言设置
  const cookieLanguage = headersList
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("language="))
    ?.split("=")[1];
  // 如果 cookie 中有有效的语言设置，直接使用
  if (cookieLanguage && locales.includes(cookieLanguage)) {
    return {
      locale: cookieLanguage,
      messages: (await import(`../locales/${cookieLanguage}.json`)).default,
    };
  }
  const acceptLanguage = headersList.get("accept-language") || "";
  // 解析用户偏好的语言列表
  const userLanguages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [language, weight = "q=1.0"] = lang.split(";");
      return {
        language: language.split("-")[0], // 只取主要语言代码
        weight: parseFloat(weight.split("=")[1]),
      };
    })
    .sort((a, b) => b.weight - a.weight);

  // 查找第一个匹配的支持语言
  const matchedLocale = userLanguages.find(({ language }) =>
    locales.includes(language),
  );
  const locale = matchedLocale ? matchedLocale.language : defaultLocale;
  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
