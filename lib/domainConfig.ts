import { getAllDomains } from "@/lib/dto/domains";

export async function getDomainConfig() {
  return await getAllDomains();
}

export async function getCloudflareCredentials(domain_name: string) {
  try {
    const domains = await getAllDomains();
    const domain = domains.list.find((d) => d.domain_name === domain_name);
    if (!domain || !domain.cf_api_key || !domain.cf_email) {
      throw new Error(
        `No Cloudflare credentials found for domain: ${domain_name}`,
      );
    }

    let apiKey = domain.cf_api_key;
    if (domain.cf_api_key_encrypted) {
      // TODO
      apiKey = decrypt(apiKey);
    }

    return {
      api_key: apiKey,
      email: domain.cf_email,
    };
  } catch (error) {
    throw new Error(`Failed to fetch credentials: ${error.message}`);
  }
}

function decrypt(encryptedKey: string) {
  return encryptedKey; // Replace with actual decryption logic
}
