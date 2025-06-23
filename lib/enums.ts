export const EXPIRATION_ENUMS = [
  {
    value: "-1",
    label: "Never",
  },
  {
    value: "10", // 10s
    label: "10s",
  },
  {
    value: "60", // 1 min
    label: "60s",
  },
  {
    value: "600", // 10 min
    label: "10min",
  },
  {
    value: "3600", // 1h
    label: "1h",
  },
  {
    value: "43200", // 12h
    label: "12h",
  },
  {
    value: "86400", // 1d
    label: "1d",
  },
  {
    value: "604800", // 7d
    label: "7d",
  },
  {
    value: "2592000", // 30d
    label: "30d",
  },
  {
    value: "7776000", // 90d
    label: "90d",
  },
  {
    value: "31536000", // 365d
    label: "365d",
  },
];

export const ROLE_ENUM = [
  {
    label: "User",
    value: "USER",
  },
  {
    label: "Admin",
    value: "ADMIN",
  },
];

export const RECORD_TYPE_ENUMS = [
  {
    value: "CNAME",
    label: "CNAME",
  },
  {
    value: "A",
    label: "A",
  },
  {
    value: "TXT",
    label: "TXT",
  },
];
export const TTL_ENUMS = [
  {
    value: "1",
    label: "Auto",
  },
  {
    value: "300",
    label: "5min",
  },
  {
    value: "3600",
    label: "1h",
  },
  {
    value: "18000",
    label: "5h",
  },
  {
    value: "86400",
    label: "1d",
  },
];
export const STATUS_ENUMS = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 0,
    label: "Inactive",
  },
];

export const reservedDomains = [
  "www",
  "api",
  "dev",
  "admin",
  "mail",
  "smtp",
  "pop",
  "imap",
  "ftp",
  "sftp",
  "ns1",
  "ns2",
  "dns",
  "vpn",
  "cdn",
  "proxy",
  "gateway",
  "server",
  "host",
  "staging",
  "test",
  "demo",

  "github",
  "gitlab",
  "bitbucket",
  "heroku",
  "vercel",
  "netlify",
  "cloudflare",
  "azure",
  "aws",
  "gcp",

  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "whatsapp",
  "telegram",
  "discord",
  "slack",

  "blog",
  "shop",
  "store",
  "app",
  "web",
  "portal",
  "auth",
  "login",
  "account",
  "help",
  "support",
  "status",
  "docs",
  "wiki",

  "security",
  "secure",
  "ssl",
  "cert",
  "phishing",
  "spam",
  "abuse",

  "dashboard",
  "analytics",
  "monitor",
  "stats",
  "metrics",
  "logs",
  "backup",
  "git",
  "svn",

  "zhihu",
  "weibo",
  "taobao",
  "qq",
  "wechat",
  "weixin",
  "alipay",
  "baidu",

  "root",
  "administrator",
  "admin1",
  "test1",
  "demo1",
];

export const reservedAddressSuffix = [
  "admin",
  "support",
  "billing",
  "security",
  "root",
  "administrator",
  "system",
  "noreply",
  "no-reply",
  "info",
  "contact",
  "help",
  "hello",
  "hi",
  "inquiries",
  "feedback",
  "suggestions",
  "service",
  "customerservice",
  "supportteam",
  "care",
  "assistance",
  "complaints",
  "sales",
  "marketing",
  "business",
  "partnerships",
  "advertising",
  "promo",
  "deals",
  "accounts",
  "payment",
  "finance",
  "invoicing",
  "refunds",
  "subscriptions",
  "webmaster",
  "postmaster",
  "hostmaster",
  "tech",
  "it",
  "ops",
  "dev",
  "developer",
  "engineering",
  "privacy",
  "abuse",
  "legal",
  "compliance",
  "trust",
  "fraud",
  "report",
  "news",
  "updates",
  "alerts",
  "notifications",
  "welcome",
  "verify",
  "confirmation",
  "team",
  "staff",
  "hr",
  "jobs",
  "careers",
  "press",
  "media",
  "events",
];

export const LOGS_LIMITEs_ENUMS = [
  {
    value: "50",
    label: "50",
  },
  {
    value: "100",
    label: "100",
  },
  {
    value: "200",
    label: "200",
  },
  {
    value: "500",
    label: "500",
  },
  {
    value: "1000",
    label: "1000",
  },
];

export const TIME_RANGES: Record<string, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "60d": 60 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
  "180d": 180 * 24 * 60 * 60 * 1000,
  "365d": 365 * 24 * 60 * 60 * 1000,
  All: 3650 * 24 * 60 * 60 * 1000,
};

export const DATE_DIMENSION_ENUMS = [
  { value: "24h", label: "Last 24 Hours", key: 1 },
  { value: "7d", label: "Last 7 Days", key: 7 },
  { value: "30d", label: "Last 30 Days", key: 30 },
  { value: "60d", label: "Last 2 Months", key: 60 },
  { value: "90d", label: "Last 3 Months", key: 90 },
  { value: "180d", label: "Last 6 Months", key: 180 },
  { value: "365d", label: "Last 1 Year", key: 365 },
  { value: "All", label: "All the time", key: 1000 },
] as const;

export const DAILY_DIMENSION_ENUMS = [
  { value: "5min", label: "Last 5 Minutes", key: 5 },
  { value: "10min", label: "Last 10 Minutes", key: 10 },
  { value: "30min", label: "Last 30 Minutes", key: 30 },
  { value: "1h", label: "Last 1 Hour", key: 60 },
  { value: "6h", label: "Last 6 Hours", key: 360 },
  { value: "12h", label: "Last 12 Hours", key: 720 },
  { value: "24h", label: "Last 24 Hours", key: 1440 },
] as const;

export const generateGradientClasses = (seed: string) => {
  const gradients = [
    "bg-gradient-to-br from-red-400 to-pink-500",
    "bg-gradient-to-br from-blue-400 to-indigo-500",
    "bg-gradient-to-br from-green-400 to-teal-500",
    "bg-gradient-to-br from-yellow-400 to-orange-500",
    "bg-gradient-to-br from-purple-400 to-pink-500",
    "bg-gradient-to-br from-cyan-400 to-blue-500",
    "bg-gradient-to-br from-pink-400 to-red-500",
    "bg-gradient-to-br from-teal-400 to-green-500",
    "bg-gradient-to-br from-orange-400 to-yellow-500",
    "bg-gradient-to-br from-indigo-400 to-blue-500",
  ];
  const hash = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};
