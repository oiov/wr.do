import { Domain } from "@prisma/client";

import { prisma } from "../db";

// In-memory cache
let domainConfigCache: Domain[] | null = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 60 * 1000; // Cache for 1 minute in memory

export const FeatureMap = {
  short: "enable_short_link",
  email: "enable_email",
  record: "enable_dns",
};

export interface DomainConfig {
  domain_name: string;
  enable_short_link: boolean;
  enable_email: boolean;
  enable_dns: boolean;
  cf_zone_id: string | null;
  cf_api_key: string | null;
  cf_email: string | null;
  cf_api_key_encrypted: boolean;
  max_short_links: number | null;
  max_email_forwards: number | null;
  max_dns_records: number | null;
  active: boolean;
}

export interface DomainFormData extends DomainConfig {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllDomains() {
  try {
    const now = Date.now();
    if (domainConfigCache && now - lastCacheUpdate < CACHE_DURATION) {
      return domainConfigCache;
    }

    const domains = await prisma.domain.findMany({
      // where: { active: true },
    });

    domainConfigCache = domains;
    lastCacheUpdate = now;
    return domains;
  } catch (error) {
    throw new Error(`Failed to fetch domain config: ${error.message}`);
  }
}

export async function getDomainsByFeature(
  feature: string,
  admin: boolean = false,
) {
  try {
    const now = Date.now();
    if (domainConfigCache && now - lastCacheUpdate < CACHE_DURATION) {
      return domainConfigCache;
    }

    const domains = await prisma.domain.findMany({
      where: { [feature]: true },
      select: {
        domain_name: true,
        enable_short_link: admin,
        enable_email: admin,
        enable_dns: admin,
        cf_zone_id: admin,
        cf_api_key: admin,
        cf_email: admin,
      },
    });
    return domains;
  } catch (error) {
    throw new Error(`Failed to fetch domain config: ${error.message}`);
  }
}

export async function getDomainsByFeatureClient(feature: string) {
  try {
    const domains = await prisma.domain.findMany({
      where: { [feature]: true },
      select: {
        domain_name: true,
      },
    });
    return domains;
  } catch (error) {
    throw new Error(`Failed to fetch domain config: ${error.message}`);
  }
}

export async function createDomain(data: DomainConfig) {
  try {
    const createdDomain = await prisma.domain.create({ data });
    return createdDomain;
  } catch (error) {
    throw new Error(`Failed to create domain: ${error.message}`);
  }
}

export async function updateDomain(id: string, data) {
  try {
    const updatedDomain = await prisma.domain.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return updatedDomain;
  } catch (error) {
    throw new Error(`Failed to update domain: ${error.message}`);
  }
}

export async function deleteDomain(domain_name: string) {
  try {
    const deletedDomain = await prisma.domain.delete({
      where: { domain_name },
    });
    return deletedDomain;
  } catch (error) {
    throw new Error(`Failed to delete domain`);
  }
}

export function invalidateDomainConfigCache() {
  domainConfigCache = null;
  lastCacheUpdate = 0;
}
