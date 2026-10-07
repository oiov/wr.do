export type InAppBrowserPlatform = "wechat" | "qq" | "weibo" | "other";

type InAppBrowserSignature = {
  platform: InAppBrowserPlatform;
  pattern: RegExp;
};

const IN_APP_BROWSER_SIGNATURES: InAppBrowserSignature[] = [
  { platform: "wechat", pattern: /MicroMessenger/i },
  { platform: "qq", pattern: /(?:^|[ ;])QQ\/\d/i },
  { platform: "weibo", pattern: /(?:^|[ ;])Weibo/i },
  {
    platform: "other",
    pattern:
      /(?:FBAN|FBAV|Instagram|Line\/|DingTalk|AlipayClient|AliApp|淘宝|Telegram|Twitter for (?:iPhone|Android)|LinkedInApp|Snapchat|Pinterest|Discord|Reddit\/|TikTok|musical_ly|BytedanceWebview)/i,
  },
  // The bare `wv)` token also appears on stock Android System WebView and Custom
  // Tabs, which hand off to a real browser, so only the explicit WebView token is
  // kept as a weak signal.
  { platform: "other", pattern: /;\s*WebView/i },
];

/** Returns the platform of an app-embedded browser, or null when the user agent is a regular browser. */
export function getInAppBrowserPlatform(
  userAgent: string | null | undefined,
): InAppBrowserPlatform | null {
  if (!userAgent) return null;
  const signature = IN_APP_BROWSER_SIGNATURES.find((candidate) =>
    candidate.pattern.test(userAgent),
  );
  return signature ? signature.platform : null;
}

/** Returns true for social and app-embedded browsers that cannot open a new tab normally. */
export function isInAppBrowser(userAgent: string | null | undefined): boolean {
  return getInAppBrowserPlatform(userAgent) !== null;
}
