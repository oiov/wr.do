const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const { NextRequest } = require("next/server");

function load(file, dependencies = {}, env = {}, globals = {}) {
  const source = ts.transpileModule(
    fs.readFileSync(path.join(__dirname, "..", file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    },
  ).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    process: { env },
    URL,
    Response,
    console: { warn() {}, error() {} },
    require: (name) => dependencies[name] || require(name),
    ...globals,
  });
  return exports;
}

function request(headers = {}) {
  return new NextRequest("https://short.example/test", { headers });
}

const cityRecord = {
  city: { names: { en: "Shanghai" } },
  subdivisions: [{ iso_code: "SH", names: { en: "Shanghai" } }],
  country: { iso_code: "CN" },
  location: { latitude: 31.23, longitude: 121.47 },
};

function setup(env = {}, open = async () => ({ get: () => cityRecord })) {
  const geo = load("lib/geo.ts", {}, env);
  const node = load(
    "lib/geo-node.ts",
    { "./geo": geo, maxmind: { open } },
    env,
  );
  return { geo, node };
}

test("Cloudflare visitor IP takes priority over nginx and forwarded addresses", () => {
  const { geo } = setup();
  assert.equal(
    geo.getClientIp(
      request({
        "cf-connecting-ip": "203.0.113.5",
        "cf-ray": "example",
        "x-real-ip": "192.0.2.1",
        "x-forwarded-for": "198.51.100.9, 192.0.2.1",
      }),
    ),
    "203.0.113.5",
  );
  assert.equal(
    geo.getClientIp(
      request({
        "cf-ray": "example",
        "x-real-ip": "192.0.2.1",
      }),
    ),
    null,
  );
});

test("recognizes IPv4 and compressed/mapped IPv6, rejects invalid IPs", () => {
  const { geo } = setup();
  for (const ip of [
    "203.0.113.5",
    "2001:db8::1234",
    "::ffff:203.0.113.5",
    "::1",
  ]) {
    assert.equal(geo.getClientIp(request({ "x-real-ip": ip })), ip);
  }
  for (const ip of [
    "999.1.1.1",
    "01.2.3.4",
    "2001:db8:::1",
    "unknown",
    "1.2.3.4, 5.6.7.8",
  ]) {
    assert.equal(geo.getClientIp(request({ "x-real-ip": ip })), null);
  }
});

test("only trusts forwarded headers with an explicit proxy configuration", () => {
  const headers = { "x-forwarded-for": "203.0.113.5, 192.0.2.1" };
  assert.equal(setup().geo.getClientIp(request(headers)), null);
  const { geo } = setup({ GEO_TRUST_FORWARDED: "true" });
  assert.equal(geo.getClientIp(request(headers)), "203.0.113.5");
  for (const [forwarded, expected] of [
    ['for="[2001:db8::1234]:8080";proto=https', "2001:db8::1234"],
    ['for="[2001:db8::1234]"', "2001:db8::1234"],
    ["for=203.0.113.5:1234", "203.0.113.5"],
    ["for=203.0.113.5, for=192.0.2.1", "203.0.113.5"],
    ["for=_hidden", null],
    ["for=unknown", null],
  ]) {
    assert.equal(geo.getClientIp(request({ forwarded })), expected);
  }
});

test("normalizes country/coordinate headers and preserves real zero coordinates", () => {
  const { geo } = setup();
  const location = geo.getEdgeGeolocation(
    request({
      "cf-ipcountry": "cn",
      "cf-iplatitude": "0",
      "cf-iplongitude": "121.47",
    }),
  );
  assert.equal(location.country, "CN");
  assert.equal(location.latitude, "0");
  assert.equal(location.longitude, "121.47");
  for (const country of ["XX", "T1", "invalid"]) {
    assert.equal(
      geo.getEdgeGeolocation(request({ "cf-ipcountry": country })).country,
      undefined,
    );
  }
  for (const coordinate of [" ", "NaN", "Infinity", "181"]) {
    const result = geo.getEdgeGeolocation(
      request({
        "cf-iplatitude": coordinate,
        "cf-iplongitude": coordinate,
      }),
    );
    assert.equal(result.latitude, undefined);
    assert.equal(result.longitude, undefined);
  }
});

test("Vercel uses visitor administrative region instead of the edge datacenter", async () => {
  const { geo, node } = setup({ VERCEL: "1" }, () =>
    assert.fail("Must not open MaxMind"),
  );
  const req = request({
    "x-real-ip": "203.0.113.5",
    "x-vercel-ip-country": "US",
    "x-vercel-ip-country-region": "NY",
    "x-vercel-ip-city": "New%20York",
    "x-vercel-id": "iad1::example",
  });
  assert.equal(geo.getClientIp(req), "203.0.113.5");
  assert.equal((await node.getIpInfo(req)).city, "New York");
  assert.equal((await node.getIpInfo(req)).region, "NY");
  assert.equal(
    geo.getEdgeGeolocation(request({ "x-vercel-id": "iad1::example" })).region,
    undefined,
  );
});

test("fills each missing Cloudflare field from a cached local database", async () => {
  let opens = 0;
  const { node } = setup(
    { MAXMIND_DB_PATH: "/mounted/city.mmdb" },
    async (file) => {
      opens++;
      assert.equal(file, "/mounted/city.mmdb");
      return { get: () => cityRecord };
    },
  );
  const req = request({
    "cf-connecting-ip": "203.0.113.5",
    "cf-ipcity": "Edge City",
    "cf-iplatitude": "0",
  });
  const [first, second] = await Promise.all([
    node.getIpInfo(req),
    node.getIpInfo(req),
  ]);
  assert.equal(opens, 1);
  assert.equal(first.city, "Edge City");
  assert.equal(first.region, "SH");
  assert.equal(first.country, "CN");
  assert.equal(first.latitude, "0");
  assert.equal(first.longitude, "121.47");
  assert.equal(second.ip, "203.0.113.5");
});

test("complete CDN locations and unknown/loopback IPs do not open a database", async () => {
  const { node } = setup({}, () => assert.fail("Must not open MaxMind"));
  await node.getIpInfo(
    request({
      "cf-connecting-ip": "203.0.113.5",
      "cf-ipcity": "Shanghai",
      "cf-region-code": "SH",
      "cf-ipcountry": "CN",
      "cf-iplatitude": "0",
      "cf-iplongitude": "121.47",
    }),
  );
  const unknown = await node.getIpInfo(request());
  assert.equal(unknown.latitude, "");
  assert.equal(unknown.longitude, "");
  await node.getIpInfo(request({ "x-real-ip": "::1" }));
});

test("missing or corrupt databases preserve the visitor IP and edge location", async () => {
  for (const open of [
    async () => {
      throw new Error("ENOENT");
    },
    async () => ({
      get() {
        throw new Error("Invalid database record");
      },
    }),
    async () => ({ get: () => null }),
  ]) {
    const { node } = setup({}, open);
    const info = await node.getIpInfo(
      request({
        "x-real-ip": "203.0.113.5",
        "cf-ipcountry": "CN",
      }),
    );
    assert.equal(info.ip, "203.0.113.5");
    assert.equal(info.country, "CN");
    assert.equal(info.latitude, "");
    assert.equal(info.longitude, "");
  }
});

test("Docker user-agent parsing also detects bots", () => {
  assert.equal(
    setup().geo.getUserAgent(
      request({
        "user-agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      }),
    ).isBot,
    true,
  );
});

test("short-link middleware and API record the original IP and enriched geo before redirecting", async () => {
  for (const available of [true, false]) {
    const { geo, node } = setup({}, async () => {
      if (!available) throw new Error("ENOENT");
      return { get: () => cityRecord };
    });
    let recorded;
    const route = load("app/api/s/route.ts", {
      "@/lib/geo-node": node,
      "@/lib/dto/domains": {
        getInAppBrowserGuideConfig: async () => null,
      },
      "@/lib/in-app-browser": {
        isInAppBrowser: () => false,
      },
      "@/lib/dto/short-urls": {
        getUrlBySuffix: async () => ({
          id: "link-id",
          active: 1,
          password: "",
          expiration: "-1",
          updatedAt: new Date(),
          target: "https://destination.example/",
        }),
        createUserShortUrlMeta: async (data) => {
          recorded = data;
        },
      },
    });
    const middleware = load(
      "middleware.ts",
      {
        "./lib/geo": geo,
        "./config/site": { siteConfig: { url: "https://short.example" } },
        "./lib/utils": { extractHost: () => "short.example" },
      },
      {},
      {
        fetch: async (url, options) => {
          assert.equal(url, "https://short.example/api/s");
          return route.POST(new NextRequest(url, options));
        },
      },
    );
    const response = await middleware.default(
      request({
        host: "short.example",
        "x-real-ip": "203.0.113.5",
        "cf-ipcountry": "CN",
        "accept-language": "zh-CN,zh;q=0.9",
      }),
    );
    assert.equal(response.status, 302);
    assert.equal(
      response.headers.get("location"),
      "https://destination.example/",
    );
    assert.equal(recorded.ip, "203.0.113.5");
    assert.equal(recorded.click, 1);
    assert.equal(recorded.country, "CN");
    assert.equal(recorded.lang, "zh-CN");
    assert.equal(recorded.city, available ? "Shanghai" : null);
    assert.equal(recorded.latitude, available ? "31.23" : null);
  }
});

test("redirects an embedded browser to the generic guide when enabled", async () => {
  const { geo, node } = setup();
  const route = load("app/api/s/route.ts", {
    "@/lib/geo-node": node,
    "@/lib/dto/domains": {
      getInAppBrowserGuideConfig: async () => ({
        in_app_browser_guide_enabled: true,
      }),
    },
    "@/lib/in-app-browser": {
      isInAppBrowser: () => true,
    },
    "@/lib/dto/short-urls": {
      getUrlBySuffix: async () => ({
        id: "link-id",
        active: 1,
        password: "",
        expiration: "-1",
        updatedAt: new Date(),
        prefix: "short.example",
        target: "https://destination.example/",
      }),
      createUserShortUrlMeta: async () => undefined,
    },
  });
  const middleware = load(
    "middleware.ts",
    {
      "./lib/geo": geo,
      "./config/site": { siteConfig: { url: "https://short.example" } },
      "./lib/utils": { extractHost: () => "short.example" },
    },
    {},
    {
      fetch: async (url, options) =>
        route.POST(new NextRequest(url, options)),
    },
  );

  const response = await middleware.default(
    request({
      host: "short.example",
      "x-real-ip": "203.0.113.5",
      "user-agent": "Mozilla/5.0 MicroMessenger/8.0.40",
    }),
  );

  assert.equal(response.status, 302);
  assert.equal(
    response.headers.get("location"),
    "https://short.example/in-app-browser-guide?slug=test",
  );
});

test("keeps the guide disabled by default and honors per-link overrides", async () => {
  const { node } = setup();

  async function call({ override = null, domainEnabled = false }) {
    const route = load("app/api/s/route.ts", {
      "@/lib/geo-node": node,
      "@/lib/dto/domains": {
        getInAppBrowserGuideConfig: async () => ({
          in_app_browser_guide_enabled: domainEnabled,
        }),
      },
      "@/lib/in-app-browser": {
        isInAppBrowser: (userAgent) => userAgent.includes("MicroMessenger"),
      },
      "@/lib/dto/short-urls": {
        getUrlBySuffix: async () => ({
          id: "link-id",
          active: 1,
          password: "",
          expiration: "-1",
          updatedAt: new Date(),
          prefix: "short.example",
          target: "https://destination.example/",
          inAppBrowserGuideOverride: override,
        }),
        createUserShortUrlMeta: async () => undefined,
      },
    });

    const response = await route.POST(
      new NextRequest("https://short.example/api/s", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: "test",
          ip: "203.0.113.5",
          userAgent: "Mozilla/5.0 MicroMessenger/8.0.40",
        }),
      }),
    );
    return response.json();
  }

  assert.equal(await call({}), "https://destination.example/");
  assert.deepEqual(await call({ domainEnabled: true }), {
    target: "https://destination.example/",
    showGuide: true,
  });
  assert.deepEqual(await call({ override: true }), {
    target: "https://destination.example/",
    showGuide: true,
  });
  assert.equal(
    await call({ override: false, domainEnabled: true }),
    "https://destination.example/",
  );
});

test("never shows the guide to crawlers, even with an embedded browser UA", async () => {
  const { node } = setup();
  const route = load("app/api/s/route.ts", {
    "@/lib/geo-node": node,
    "@/lib/dto/domains": {
      getInAppBrowserGuideConfig: async () => ({
        in_app_browser_guide_enabled: true,
      }),
    },
    "@/lib/in-app-browser": {
      isInAppBrowser: () => true,
    },
    "@/lib/dto/short-urls": {
      getUrlBySuffix: async () => ({
        id: "link-id",
        active: 1,
        password: "",
        expiration: "-1",
        updatedAt: new Date(),
        prefix: "short.example",
        target: "https://destination.example/",
      }),
      createUserShortUrlMeta: async () => undefined,
    },
  });

  const response = await route.POST(
    new NextRequest("https://short.example/api/s", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        slug: "test",
        ip: "203.0.113.5",
        isBot: true,
        userAgent: "Mozilla/5.0 MicroMessenger/8.0.40",
      }),
    }),
  );

  // WeChat link-preview crawlers carry a MicroMessenger UA; they must follow
  // the redirect so previews still unfurl.
  assert.equal(await response.json(), "https://destination.example/");
});
