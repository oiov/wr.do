export const countryMap = {
  BO: "Bolivia, Plurinational State of",
  CG: "Congo, Republic of the",
  KP: "North Korea",
  KR: "South Korea",
  MD: "Moldova, Republic of",
  RU: "Russia",
  VA: "Holy See",
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AD: "Andorra",
  AO: "Angola",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BT: "Bhutan",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  CV: "Cabo Verde",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  KM: "Comoros",
  CD: "Congo, Democratic Republic of the",
  CR: "Costa Rica",
  CI: "Côte d'Ivoire",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czechia",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  SZ: "Eswatini",
  ET: "Ethiopia",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  GD: "Grenada",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HN: "Honduras",
  HU: "Hungary",
  HK: "Hong Kong,China",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MR: "Mauritania",
  MU: "Mauritius",
  MX: "Mexico",
  FM: "Micronesia, Federated States of",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  MK: "North Macedonia",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RO: "Romania",
  RW: "Rwanda",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  SS: "South Sudan",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AQ: "Antarctica",
  AS: "American Samoa",
  AX: "Åland Islands",
  BM: "Bermuda",
  MO: "Macao,China",
  PS: "Palestine, State of",
  PR: "Puerto Rico",
  TW: "Taiwan,China",
  XK: "Kosovo",
};

export const getCountryName = (code: string) => {
  return countryMap[code.toUpperCase()] || code;
};

const vendorMap = [
  // 手机厂商
  { prefix: /^CPH/i, vendor: "OPPO" }, // OPPO 智能手机
  { prefix: /^V\d/i, vendor: "Vivo" }, // Vivo 智能手机
  { prefix: /^(M\d|220\d|230\d|240\d)/i, vendor: "Xiaomi" }, // 小米/Redmi 智能手机
  { prefix: /^RMX/i, vendor: "Realme" }, // Realme 智能手机
  { prefix: /^SM-/i, vendor: "Samsung" }, // 三星智能手机/平板
  {
    prefix: /^(ANA|STF|VOG|JNY|LYA|TAS|DBR|ADY|FNE|REP|NOP|ROD)/i,
    vendor: "Huawei",
  },
  { prefix: /^iPhone/i, vendor: "iPhone" }, // 苹果 iPhone
  { prefix: /^(IN|KB|LE|CPH\d{4})/i, vendor: "OnePlus" }, // OnePlus 智能手机
  { prefix: /^(TA-\d|\d{4}$)/i, vendor: "Nokia" }, // 诺基亚智能手机/功能机
  { prefix: /^XQ-/i, vendor: "Sony" }, // 索尼 Xperia 智能手机
  { prefix: /^XT/i, vendor: "Motorola" }, // 摩托罗拉智能手机
  { prefix: /^(GP|G[0-9A-Z]{3})/i, vendor: "Google" }, // Google Pixel 智能手机
  { prefix: /^LM-/i, vendor: "LG" }, // LG 智能手机
  { prefix: /^ASUS-/i, vendor: "Asus" }, // 华硕智能手机

  // 平板厂商
  { prefix: /^iPad/i, vendor: "Apple" }, // 苹果 iPad
  { prefix: /^(TBL-|TB-)/i, vendor: "Lenovo" }, // 联想平板

  // 电脑厂商
  { prefix: /^MacBook/i, vendor: "MacBook" }, // 苹果 MacBook
  { prefix: /^(A1\d{2}|A2\d{2})/i, vendor: "Apple" }, // 苹果 MacBook 内部型号
  { prefix: /^(XPS|Latitude|Inspiron)/i, vendor: "Dell" }, // 戴尔笔记本
  { prefix: /^(Pavilion|EliteBook|ProBook|Envy)/i, vendor: "HP" }, // 惠普电脑
  { prefix: /^(ThinkPad|IdeaPad|Legion)/i, vendor: "Lenovo" }, // 联想笔记本
  { prefix: /^(ROG|ZenBook|VivoBook|G[5-9]|Strix)/i, vendor: "Asus" }, // 华硕笔记本
  { prefix: /^(Acer-|Predator|Nitro)/i, vendor: "Acer" }, // 宏碁笔记本/游戏设备
  { prefix: /^Surface/i, vendor: "Microsoft" }, // 微软 Surface
  { prefix: /^(MateBook|MagicBook)/i, vendor: "Huawei" }, // 华为笔记本

  // 其他设备
  { prefix: /^Watch/i, vendor: "Apple Watch" }, // 苹果 Watch
  { prefix: /^GT-/i, vendor: "Huawei Watch" }, // 华为手表
  { prefix: /^MiBand/i, vendor: "Xiaomi Watch" }, // 小米手环
];

export const getDeviceVendor = (model: string) => {
  const upperModel = model.toUpperCase();
  for (const { prefix, vendor } of vendorMap) {
    if (typeof prefix === "string" && upperModel.startsWith(prefix)) {
      return vendor;
    } else if (prefix instanceof RegExp && prefix.test(upperModel)) {
      return vendor;
    }
  }
  return model;
};
