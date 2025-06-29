import { prisma } from "../db";

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
  cf_record_types: string;
  cf_api_key_encrypted: boolean;
  resend_api_key: string | null;
  min_url_length: number;
  min_email_length: number;
  min_record_length: number;
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

export async function getAllDomains(page = 1, size = 10, target: string = "") {
  try {
    let option: any;

    if (target) {
      option = {
        domain_name: {
          contains: target,
        },
      };
    }

    const [total, list] = await prisma.$transaction([
      prisma.domain.count({
        where: option,
      }),
      prisma.domain.findMany({
        where: option,
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    return { list, total };
  } catch (error) {
    throw new Error(`Failed to fetch domain config: ${error.message}`);
  }
}

export async function getDomainsByFeature(
  feature: string,
  admin: boolean = false,
) {
  try {
    const domains = await prisma.domain.findMany({
      where: { [feature]: true },
      select: {
        domain_name: true,
        cf_record_types: true,
        min_url_length: true,
        min_email_length: true,
        min_record_length: true,
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
        cf_record_types: true,
        min_url_length: true,
        min_email_length: true,
        min_record_length: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return domains;
  } catch (error) {
    throw new Error(`Failed to fetch domain config: ${error.message}`);
  }
}

export async function getDomainByName(domain_name: string) {
  return await prisma.domain.findUnique({
    where: { domain_name },
  });
}

export async function checkDomainIsConfiguratedResend(domain_name: string) {
  try {
    const domain = await prisma.domain.findUnique({
      where: { domain_name },
      select: {
        resend_api_key: true,
      },
    });
    return domain?.resend_api_key;
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
