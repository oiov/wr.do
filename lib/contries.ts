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

export function getRegionName(regionCode: string) {
  const regionMap = {
    // Vercel/Cloudflare 地区代码
    hkg1: "Hong Kong",
    sin1: "Singapore",
    iad1: "Washington D.C. (US East)",
    gru1: "São Paulo (Brazil)",
    sfo1: "San Francisco (US West)",
    cdg1: "Paris (France)",
    cle1: "Cleveland (US Central)",
    cpt1: "Cape Town (South Africa)",

    // AWS 地区代码
    "us-east-1": "N. Virginia (US East)",
    "us-west-1": "N. California (US West)",
    "us-west-2": "Oregon (US West)",
    "eu-west-1": "Ireland (Europe)",
    "eu-central-1": "Frankfurt (Europe)",
    "ap-southeast-1": "Singapore (Asia Pacific)",
    "ap-northeast-1": "Tokyo (Asia Pacific)",
    "ap-south-1": "Mumbai (Asia Pacific)",

    // Cloudflare 地区代码
    lhr: "London (UK)",
    fra: "Frankfurt (Germany)",
    ams: "Amsterdam (Netherlands)",
    nrt: "Tokyo (Japan)",
    icn: "Seoul (South Korea)",
    syd: "Sydney (Australia)",
    yyz: "Toronto (Canada)",
    mia: "Miami (US Southeast)",
    lax: "Los Angeles (US West)",
    ord: "Chicago (US Central)",
    atl: "Atlanta (US Southeast)",
    dfw: "Dallas (US Central)",
    sea: "Seattle (US West)",
    bos: "Boston (US Northeast)",
    ewr: "Newark (US Northeast)",
    jfk: "New York (US Northeast)",

    // 其他常见地区代码
    pdx1: "Portland (US West)",
    bom1: "Mumbai (India)",
    syd1: "Sydney (Australia)",
    nrt1: "Tokyo (Japan)",
    fra1: "Frankfurt (Germany)",
    lon1: "London (UK)",
    ams1: "Amsterdam (Netherlands)",
    tor1: "Toronto (Canada)",
    nyc1: "New York (US East)",
    dub1: "Dublin (Ireland)",
    blr1: "Bangalore (India)",
    sgp1: "Singapore",
    hnd1: "Tokyo Haneda (Japan)",
    kix1: "Osaka (Japan)",
    icn1: "Seoul (South Korea)",
    bkk1: "Bangkok (Thailand)",
    mnl1: "Manila (Philippines)",
    jkt1: "Jakarta (Indonesia)",
    mel1: "Melbourne (Australia)",
    per1: "Perth (Australia)",
    akl1: "Auckland (New Zealand)",
    mad1: "Madrid (Spain)",
    bcn1: "Barcelona (Spain)",
    mxp1: "Milan (Italy)",
    vie1: "Vienna (Austria)",
    zrh1: "Zurich (Switzerland)",
    sto1: "Stockholm (Sweden)",
    hel1: "Helsinki (Finland)",
    cph1: "Copenhagen (Denmark)",
    osl1: "Oslo (Norway)",
    waw1: "Warsaw (Poland)",
    prg1: "Prague (Czech Republic)",
    bud1: "Budapest (Hungary)",
    buh1: "Bucharest (Romania)",
    sof1: "Sofia (Bulgaria)",
    ath1: "Athens (Greece)",
    ist1: "Istanbul (Turkey)",
    tlv1: "Tel Aviv (Israel)",
    cai1: "Cairo (Egypt)",
    jnb1: "Johannesburg (South Africa)",
    lag1: "Lagos (Nigeria)",
    nbo1: "Nairobi (Kenya)",
    dxb1: "Dubai (UAE)",
    bah1: "Bahrain",
    khi1: "Karachi (Pakistan)",
    del1: "Delhi (India)",
    ccj1: "Kolkata (India)",
    maa1: "Chennai (India)",
    hyd1: "Hyderabad (India)",
    pnq1: "Pune (India)",
  };

  return regionMap[regionCode.toLowerCase()] || regionCode.toUpperCase();
}

export function getLanguageName(langCode: string) {
  // 统一转换为小写处理大小写不一致
  const normalizedCode = langCode.toLowerCase();

  const languageMap = {
    // 英语系列
    en: "English",
    "en-us": "English (United States)",
    "en-gb": "English (United Kingdom)",
    "en-ca": "English (Canada)",
    "en-au": "English (Australia)",
    "en-nz": "English (New Zealand)",
    "en-ie": "English (Ireland)",
    "en-za": "English (South Africa)",
    "en-in": "English (India)",

    // 中文系列
    zh: "Chinese",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    "zh-hk": "Chinese (Hong Kong)",
    "zh-sg": "Chinese (Singapore)",

    // 法语系列
    fr: "French",
    "fr-fr": "French (France)",
    "fr-ca": "French (Canada)",
    "fr-be": "French (Belgium)",
    "fr-ch": "French (Switzerland)",

    // 德语系列
    de: "German",
    "de-de": "German (Germany)",
    "de-at": "German (Austria)",
    "de-ch": "German (Switzerland)",

    // 西班牙语系列
    es: "Spanish",
    "es-es": "Spanish (Spain)",
    "es-mx": "Spanish (Mexico)",
    "es-ar": "Spanish (Argentina)",
    "es-co": "Spanish (Colombia)",
    "es-cl": "Spanish (Chile)",

    // 葡萄牙语系列
    pt: "Portuguese",
    "pt-pt": "Portuguese (Portugal)",
    "pt-br": "Portuguese (Brazil)",

    // 意大利语
    it: "Italian",
    "it-it": "Italian (Italy)",

    // 俄语
    ru: "Russian",
    "ru-ru": "Russian (Russia)",

    // 日语
    ja: "Japanese",
    "ja-jp": "Japanese (Japan)",

    // 韩语
    ko: "Korean",
    "ko-kr": "Korean (South Korea)",

    // 阿拉伯语
    ar: "Arabic",
    "ar-sa": "Arabic (Saudi Arabia)",
    "ar-ae": "Arabic (UAE)",
    "ar-eg": "Arabic (Egypt)",

    // 荷兰语
    nl: "Dutch",
    "nl-nl": "Dutch (Netherlands)",
    "nl-be": "Dutch (Belgium)",

    // 北欧语言
    sv: "Swedish",
    "sv-se": "Swedish (Sweden)",
    da: "Danish",
    "da-dk": "Danish (Denmark)",
    no: "Norwegian",
    "no-no": "Norwegian (Norway)",
    "nb-no": "Norwegian Bokmål",
    "nn-no": "Norwegian Nynorsk",
    fi: "Finnish",
    "fi-fi": "Finnish (Finland)",

    // 其他常见语言
    hi: "Hindi",
    "hi-in": "Hindi (India)",
    th: "Thai",
    "th-th": "Thai (Thailand)",
    vi: "Vietnamese",
    "vi-vn": "Vietnamese (Vietnam)",
    tr: "Turkish",
    "tr-tr": "Turkish (Turkey)",
    pl: "Polish",
    "pl-pl": "Polish (Poland)",
    cs: "Czech",
    "cs-cz": "Czech (Czech Republic)",
    sk: "Slovak",
    "sk-sk": "Slovak (Slovakia)",
    hu: "Hungarian",
    "hu-hu": "Hungarian (Hungary)",
    ro: "Romanian",
    "ro-ro": "Romanian (Romania)",
    bg: "Bulgarian",
    "bg-bg": "Bulgarian (Bulgaria)",
    hr: "Croatian",
    "hr-hr": "Croatian (Croatia)",
    sr: "Serbian",
    "sr-rs": "Serbian (Serbia)",
    sl: "Slovenian",
    "sl-si": "Slovenian (Slovenia)",
    et: "Estonian",
    "et-ee": "Estonian (Estonia)",
    lv: "Latvian",
    "lv-lv": "Latvian (Latvia)",
    lt: "Lithuanian",
    "lt-lt": "Lithuanian (Lithuania)",
    el: "Greek",
    "el-gr": "Greek (Greece)",
    he: "Hebrew",
    "he-il": "Hebrew (Israel)",
    fa: "Persian",
    "fa-ir": "Persian (Iran)",
    ur: "Urdu",
    "ur-pk": "Urdu (Pakistan)",
    bn: "Bengali",
    "bn-bd": "Bengali (Bangladesh)",
    ta: "Tamil",
    "ta-in": "Tamil (India)",
    te: "Telugu",
    "te-in": "Telugu (India)",
    ml: "Malayalam",
    "ml-in": "Malayalam (India)",
    kn: "Kannada",
    "kn-in": "Kannada (India)",
    gu: "Gujarati",
    "gu-in": "Gujarati (India)",
    pa: "Punjabi",
    "pa-in": "Punjabi (India)",
    mr: "Marathi",
    "mr-in": "Marathi (India)",
    ne: "Nepali",
    "ne-np": "Nepali (Nepal)",
    si: "Sinhala",
    "si-lk": "Sinhala (Sri Lanka)",
    my: "Myanmar",
    "my-mm": "Myanmar (Myanmar)",
    km: "Khmer",
    "km-kh": "Khmer (Cambodia)",
    lo: "Lao",
    "lo-la": "Lao (Laos)",
    ka: "Georgian",
    "ka-ge": "Georgian (Georgia)",
    hy: "Armenian",
    "hy-am": "Armenian (Armenia)",
    az: "Azerbaijani",
    "az-az": "Azerbaijani (Azerbaijan)",
    kk: "Kazakh",
    "kk-kz": "Kazakh (Kazakhstan)",
    ky: "Kyrgyz",
    "ky-kg": "Kyrgyz (Kyrgyzstan)",
    uz: "Uzbek",
    "uz-uz": "Uzbek (Uzbekistan)",
    tg: "Tajik",
    "tg-tj": "Tajik (Tajikistan)",
    mn: "Mongolian",
    "mn-mn": "Mongolian (Mongolia)",
    bo: "Tibetan",
    "bo-cn": "Tibetan (China)",
    ug: "Uyghur",
    "ug-cn": "Uyghur (China)",
    id: "Indonesian",
    "id-id": "Indonesian (Indonesia)",
    ms: "Malay",
    "ms-my": "Malay (Malaysia)",
    tl: "Filipino",
    "tl-ph": "Filipino (Philippines)",
    sw: "Swahili",
    "sw-ke": "Swahili (Kenya)",
    am: "Amharic",
    "am-et": "Amharic (Ethiopia)",
    ha: "Hausa",
    "ha-ng": "Hausa (Nigeria)",
    yo: "Yoruba",
    "yo-ng": "Yoruba (Nigeria)",
    ig: "Igbo",
    "ig-ng": "Igbo (Nigeria)",
    zu: "Zulu",
    "zu-za": "Zulu (South Africa)",
    xh: "Xhosa",
    "xh-za": "Xhosa (South Africa)",
    af: "Afrikaans",
    "af-za": "Afrikaans (South Africa)",
  };

  // 如果找到精确匹配，返回对应值
  if (languageMap[normalizedCode]) {
    return languageMap[normalizedCode];
  }

  // 如果没有精确匹配，尝试匹配语言部分（如 en-xx -> English）
  const langPart = normalizedCode.split("-")[0];
  if (languageMap[langPart]) {
    return languageMap[langPart];
  }

  // 如果都没有匹配，返回原始值（大写）
  return langCode.toUpperCase();
}

export function getEngineName(engine: string) {
  const engineMap = {
    Blink: "Chrome Engine",
    WebKit: "Safari Engine",
    Gecko: "Firefox Engine",
    Trident: "IE Engine",
    EdgeHTML: "Edge Engine",
    Presto: "Opera Engine",
  };

  return engineMap[engine] || `${engine} Engine`;
}

export function getBotName(bot: boolean) {
  return bot === true ? "Bot" : "Human";
}
