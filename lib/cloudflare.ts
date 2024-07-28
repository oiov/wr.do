export const CLOUDFLARE_API_URL = "https://api.cloudflare.com/client/v4";

export interface CreateDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied?: boolean;
  ttl?: number;
  tags?: string[];
  comment?: string;
}

export interface DNSRecordResponse {
  success: boolean;
  errors: {
    code: number;
    message: string;
  }[];
  messages: {
    code: number;
    message: string;
  }[];
  result?: DNSRecordResult;
  result_info?: {
    count: number;
    page: number;
    per_page: number;
    total_count: number;
  };
}

export interface DNSRecordResult {
  id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  meta: {
    auto_added: boolean;
    managed_by_apps: boolean;
    managed_by_argo_tunnel: boolean;
  };
  comment: string;
  tags: string[];
  created_on: string;
  modified_on: string;
}

export type RecordType = "A" | "CNAME";

export const RECORD_TYPE_ENUMS = [
  {
    value: "CNAME",
    label: "CNAME",
  },
  {
    value: "A",
    label: "A",
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

export const createDNSRecord = async (
  zoneId: string,
  apiKey: string,
  email: string,
  record: CreateDNSRecord,
): Promise<DNSRecordResponse> => {
  try {
    const url = `${CLOUDFLARE_API_URL}/zones/${zoneId}/dns_records`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Auth-Email": email,
      "X-Auth-Key": apiKey,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error creating DNS record.", error);
    throw error;
  }
};

export const deleteDNSRecord = async (
  zoneId: string,
  apiKey: string,
  email: string,
  recordId: string,
): Promise<Pick<DNSRecordResponse, "result">> => {
  try {
    const url = `${CLOUDFLARE_API_URL}/zones/${zoneId}/dns_records/${recordId}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Auth-Email": email,
      "X-Auth-Key": apiKey,
    };

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting DNS record.", error);
    throw error;
  }
};

export const getDNSRecordsList = async (
  zoneId: string,
  apiKey: string,
  email: string,
  type?: RecordType,
  name?: string,
  page = 1,
  perPage = 100,
): Promise<DNSRecordResult[]> => {
  try {
    const url = `${CLOUDFLARE_API_URL}/zones/${zoneId}/dns_records?page=${page}&per_page=${perPage}&type=${type}&name=${name}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Auth-Email": email,
      "X-Auth-Key": apiKey,
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    throw error;
  }
};

export const getDNSRecordDetail = async (
  zoneId: string,
  apiKey: string,
  email: string,
  recordId: string,
): Promise<DNSRecordResponse> => {
  try {
    const url = `${CLOUDFLARE_API_URL}/zones/${zoneId}/dns_records/${recordId}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Auth-Email": email,
      "X-Auth-Key": apiKey,
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
