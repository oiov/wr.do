const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "..", "lib/in-app-browser.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
    },
  },
).outputText;
const moduleExports = {};
vm.runInNewContext(source, { exports: moduleExports });
const { isInAppBrowser, getInAppBrowserPlatform } = moduleExports;

const STANDALONE_QQ_BROWSER_UA =
  "Mozilla/5.0 (Linux; U; Android 12; zh-cn; PGT110 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.102 MQQBrowser/14.9 Mobile Safari/537.36";
const GOOGLE_APP_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.39 Mobile Safari/537.36 GSA/15.34.36.29.arm64";
const ANDROID_SYSTEM_WEBVIEW_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.39 Mobile Safari/537.36";
const ANDROID_CUSTOM_TAB_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.39 Mobile Safari/537.36";
const MOBILE_CHROME_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.39 Mobile Safari/537.36";

const EMBEDDED_BROWSER_USER_AGENTS = [
  "Mozilla/5.0 MicroMessenger/8.0.40",
  "Mozilla/5.0 QQ/9.0.20",
  "Mozilla/5.0 Weibo__13.0.3",
  "Mozilla/5.0 Instagram 320.0.0.0.59",
  "Mozilla/5.0 FBAN/FB4A; FBAV/450.0.0.0.0",
  "Mozilla/5.0 Line/14.20.0",
  "Mozilla/5.0 DingTalk/7.5.0",
  "Mozilla/5.0 AlipayClient/10.5.0",
  "Mozilla/5.0 Telegram-Android/11.0.2",
  "Mozilla/5.0 Twitter for iPhone/10.43",
  "Mozilla/5.0 LinkedInApp/9.1.123",
  "Mozilla/5.0 TikTok 38.0.4",
];

const NON_EMBEDDED_USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
  STANDALONE_QQ_BROWSER_UA,
  GOOGLE_APP_UA,
  ANDROID_SYSTEM_WEBVIEW_UA,
  ANDROID_CUSTOM_TAB_UA,
  MOBILE_CHROME_UA,
];

test("recognizes common embedded browsers", () => {
  for (const userAgent of EMBEDDED_BROWSER_USER_AGENTS) {
    assert.equal(isInAppBrowser(userAgent), true, userAgent);
  }
});

test("does not classify regular browsers as embedded", () => {
  for (const userAgent of NON_EMBEDDED_USER_AGENTS) {
    assert.equal(isInAppBrowser(userAgent), false, userAgent);
  }
  assert.equal(isInAppBrowser(undefined), false);
  assert.equal(isInAppBrowser(null), false);
  assert.equal(isInAppBrowser(""), false);
});

test("reports the embedded browser platform", () => {
  const cases = [
    ["Mozilla/5.0 MicroMessenger/8.0.40", "wechat"],
    [
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 V1_AND_SQ_8.9.13_1602_YYB_D QQ/8.9.13.6985 NetType/WIFI WebP/0.3.0 AppId/537143360",
      "qq",
    ],
    ["Mozilla/5.0 Weibo__13.0.3", "weibo"],
    ["Mozilla/5.0 Instagram 320.0.0.0.59", "other"],
    ["Mozilla/5.0 DingTalk/7.5.0", "other"],
    ["Mozilla/5.0 TikTok 38.0.4", "other"],
  ];

  for (const [userAgent, platform] of cases) {
    assert.equal(getInAppBrowserPlatform(userAgent), platform, userAgent);
  }
});

test("reports null for user agents that are not embedded browsers", () => {
  for (const userAgent of NON_EMBEDDED_USER_AGENTS) {
    assert.equal(getInAppBrowserPlatform(userAgent), null, userAgent);
  }
  assert.equal(getInAppBrowserPlatform(undefined), null);
  assert.equal(getInAppBrowserPlatform(null), null);
  assert.equal(getInAppBrowserPlatform(""), null);
});
