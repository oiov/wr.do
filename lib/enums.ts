export const EXPIRATION_ENUMS = [
  {
    value: "-1",
    label: "Never",
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
