import { prisma } from "../db";

export type ConfigType = "BOOLEAN" | "STRING" | "NUMBER" | "OBJECT";

export interface SystemConfigData {
  key: string;
  value: any; // 解析后的实际值
  type: ConfigType;
  description?: string;
  version?: string;
}

export interface CreateSystemConfigData {
  key: string;
  value: any;
  type: ConfigType;
  description?: string;
  version?: string;
}

export interface UpdateSystemConfigData {
  value?: any;
  type?: ConfigType;
  description?: string;
  version?: string;
}

// 解析配置值
function parseConfigValue(value: string, type: ConfigType): any {
  switch (type) {
    case "BOOLEAN":
      return value === "true";
    case "NUMBER":
      return Number(value);
    case "OBJECT":
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(e);
        return {};
      }
    case "STRING":
    default:
      // 如果是 JSON 字符串格式的字符串，需要解析
      if (value.startsWith('"') && value.endsWith('"')) {
        return JSON.parse(value);
      }
      return value;
  }
}

// 序列化配置值
function serializeConfigValue(value: any, type: ConfigType): string {
  switch (type) {
    case "BOOLEAN":
      return String(Boolean(value));
    case "NUMBER":
      return String(Number(value));
    case "OBJECT":
      return JSON.stringify(value);
    case "STRING":
    default:
      return JSON.stringify(value);
  }
}

// 获取单个配置
export async function getSystemConfig(
  key: string,
): Promise<SystemConfigData | null> {
  const config = await prisma.systemConfig.findUnique({
    where: { key },
  });

  if (!config) {
    return null;
  }

  return {
    key: config.key,
    value: parseConfigValue(config.value, config.type as ConfigType),
    type: config.type as ConfigType,
    description: config.description || undefined,
    version: config.version,
  };
}

// 获取配置值（简化版本，直接返回解析后的值）
export async function getConfigValue<T = any>(key: string): Promise<T | null> {
  const config = await getSystemConfig(key);
  return config ? config.value : null;
}

// 获取所有配置
export async function getAllSystemConfigs(): Promise<SystemConfigData[]> {
  const configs = await prisma.systemConfig.findMany({
    orderBy: { key: "asc" },
  });

  return configs.map((config) => ({
    key: config.key,
    value: parseConfigValue(config.value, config.type as ConfigType),
    type: config.type as ConfigType,
    description: config.description || undefined,
    version: config.version,
  }));
}

// 获取配置的原始数据（包含元数据）
export async function getSystemConfigRaw(key: string) {
  return await prisma.systemConfig.findUnique({
    where: { key },
  });
}

// 创建配置
export async function createSystemConfig(data: CreateSystemConfigData) {
  const serializedValue = serializeConfigValue(data.value, data.type);

  return await prisma.systemConfig.create({
    data: {
      key: data.key,
      value: serializedValue,
      type: data.type,
      description: data.description,
      version: data.version || "0.5.0",
    },
  });
}

// 更新配置
export async function updateSystemConfig(
  key: string,
  data: UpdateSystemConfigData,
) {
  const updateData: any = {};

  if (data.value !== undefined && data.type) {
    updateData.value = serializeConfigValue(data.value, data.type);
  }
  if (data.type !== undefined) {
    updateData.type = data.type;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  if (data.version !== undefined) {
    updateData.version = data.version;
  }

  return await prisma.systemConfig.update({
    where: { key },
    data: updateData,
  });
}

// 设置配置值（upsert操作）
export async function setSystemConfig(
  key: string,
  value: any,
  type: ConfigType,
  description?: string,
) {
  const serializedValue = serializeConfigValue(value, type);

  return await prisma.systemConfig.upsert({
    where: { key },
    update: {
      value: serializedValue,
      type,
      description,
    },
    create: {
      key,
      value: serializedValue,
      type,
      description,
    },
  });
}

// 删除配置
export async function deleteSystemConfig(key: string) {
  return await prisma.systemConfig.delete({
    where: { key },
  });
}

// 批量获取配置
export async function getMultipleConfigs(
  keys: string[],
): Promise<Record<string, any>> {
  const configs = await prisma.systemConfig.findMany({
    where: {
      key: {
        in: keys,
      },
    },
  });

  const result: Record<string, any> = {};
  configs.forEach((config) => {
    result[config.key] = parseConfigValue(
      config.value,
      config.type as ConfigType,
    );
  });

  return result;
}

// 按类型获取配置
export async function getConfigsByType(
  type: ConfigType,
): Promise<SystemConfigData[]> {
  const configs = await prisma.systemConfig.findMany({
    where: { type },
    orderBy: { key: "asc" },
  });

  return configs.map((config) => ({
    key: config.key,
    value: parseConfigValue(config.value, config.type as ConfigType),
    type: config.type as ConfigType,
    description: config.description || undefined,
    version: config.version,
  }));
}

// 搜索配置
export async function searchConfigs(
  searchTerm: string,
): Promise<SystemConfigData[]> {
  const configs = await prisma.systemConfig.findMany({
    where: {
      OR: [
        { key: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    orderBy: { key: "asc" },
  });

  return configs.map((config) => ({
    key: config.key,
    value: parseConfigValue(config.value, config.type as ConfigType),
    type: config.type as ConfigType,
    description: config.description || undefined,
    version: config.version,
  }));
}

// 配置是否存在
export async function configExists(key: string): Promise<boolean> {
  const count = await prisma.systemConfig.count({
    where: { key },
  });
  return count > 0;
}

// 获取配置统计
export async function getConfigStats() {
  const total = await prisma.systemConfig.count();
  const byType = await prisma.systemConfig.groupBy({
    by: ["type"],
    _count: {
      type: true,
    },
  });

  return {
    total,
    byType: byType.reduce(
      (acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };
}

/** Usage Example */

/**

 // 取单个配置值
const appName = await getConfigValue<string>('app_name');

// 设置配置
await setSystemConfig('maintenance_mode', true, 'BOOLEAN', 'Enable maintenance mode');

// 批量获取配置
const configs = await getMultipleConfigs(['app_name', 'maintenance_mode', 'api_rate_limit']);

// 搜索配置
const emailConfigs = await searchConfigs('email');

// 获取统计信息
const stats = await getConfigStats();
 
 */
