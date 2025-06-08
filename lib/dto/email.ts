import { ForwardEmail, UserEmail, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

export type EmailAddress = {
  name: string;
  address?: string;
  group?: EmailAddress[];
};
export type EmailHeader = Record<string, string>;

export interface OriginalEmail {
  from: string;
  fromName: string;
  to: string;
  cc?: string;
  subject?: string;
  text?: string;
  html?: string;
  date?: string;
  messageId?: string;
  replyTo?: string;
  headers?: string;
  attachments?: {
    filename: string;
    mimeType: string;
    r2Path: string;
    size: number;
  }[];
}

export interface UserEmailList extends UserEmail {
  count: number;
  unreadCount: number;
  user: string;
  email: string;
}

export async function saveForwardEmail(emailData: OriginalEmail) {
  const user_email = await prisma.userEmail.findFirst({
    where: {
      emailAddress: emailData.to,
    },
  });
  if (!user_email) return null;

  const res = await prisma.forwardEmail.create({
    data: {
      from: emailData.from,
      fromName: emailData.fromName,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      date: emailData.date,
      messageId: emailData.messageId,
      replyTo: emailData.replyTo,
      cc: emailData.cc,
      headers: "[]",
      attachments: JSON.stringify(emailData.attachments),
      readAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
  if (!res) {
    return null;
  }
  return res.id;
}

// 查询所有 UserEmail
export async function getAllUserEmails(
  userId: string,
  page: number,
  size: number,
  search: string,
  admin: boolean,
  onlyUnread: boolean = false,
) {
  let whereOptions: any = {};

  if (admin) {
    whereOptions = {
      emailAddress: { contains: search, mode: "insensitive" },
    };
  } else {
    whereOptions = {
      userId,
      deletedAt: null,
      emailAddress: { contains: search, mode: "insensitive" },
    };
  }

  if (onlyUnread) {
    whereOptions.forwardEmails = {
      some: {
        readAt: null,
      },
    };
  }

  // Fetch paginated UserEmail records
  const userEmailsPromise = prisma.userEmail.findMany({
    where: whereOptions,
    select: {
      id: true,
      userId: true,
      emailAddress: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      _count: { select: { forwardEmails: true } },
      user: { select: { name: true, email: true } },
      forwardEmails: {
        select: {
          readAt: true,
        },
      },
    },
    skip: (page - 1) * size,
    take: size,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalPromise = prisma.userEmail.count({
    where: whereOptions,
  });

  const emailAddressesPromise = prisma.userEmail.findMany({
    where: whereOptions,
    select: { emailAddress: true },
  });

  const [userEmails, total, emailAddresses] = await Promise.all([
    userEmailsPromise,
    totalPromise,
    emailAddressesPromise,
  ]);

  const emailAddressList = emailAddresses.map((e) => e.emailAddress);

  const [totalInboxCount, totalUnreadCount] = await Promise.all([
    prisma.forwardEmail.count({
      where: {
        to: { in: emailAddressList },
      },
    }),
    prisma.forwardEmail.count({
      where: {
        to: { in: emailAddressList },
        readAt: null,
      },
    }),
  ]);

  const result = userEmails.map((email) => {
    const unreadCount = email.forwardEmails.filter(
      (mail) => mail.readAt === null,
    ).length;

    return {
      ...email,
      count: email._count.forwardEmails,
      unreadCount,
      user: email.user.name,
      email: email.user.email,
      forwardEmails: undefined,
    };
  });

  return {
    list: result,
    total,
    totalInboxCount,
    totalUnreadCount,
  };
}

// 查询所有 UserEmail 数量
export async function getAllUserEmailsCount(
  userId: string,
  role: UserRole = "USER",
) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const [total, month_total] = await prisma.$transaction([
    prisma.userEmail.count({
      where:
        role === "USER" ? { userId, deletedAt: null } : { deletedAt: null },
    }),
    prisma.userEmail.count({
      where:
        role === "USER"
          ? { userId, createdAt: { gte: start, lte: end }, deletedAt: null }
          : { createdAt: { gte: start, lte: end }, deletedAt: null },
    }),
  ]);
  return { total, month_total };
}

// 查询所有 inbox 数量
export async function getAllUserInboxEmailsCount() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const [total, month_total] = await prisma.$transaction([
    prisma.forwardEmail.count(),
    prisma.forwardEmail.count({
      where: { createdAt: { gte: start, lte: end } },
    }),
  ]);
  return { total, month_total };
}

// 创建 UserEmail
export async function createUserEmail(
  userId: string,
  emailAddress: string,
): Promise<UserEmail> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("Invalid userId");
  }

  return prisma.userEmail.create({
    data: {
      userId,
      emailAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    },
  });
}

// 查询单个 UserEmail
export async function getUserEmailById(id: string): Promise<UserEmail | null> {
  return prisma.userEmail.findUnique({
    where: { id, deletedAt: null },
  });
}

// 更新 UserEmail
export async function updateUserEmail(
  id: string,
  emailAddress: string,
): Promise<UserEmail> {
  return prisma.userEmail.update({
    where: { id, deletedAt: null },
    data: { emailAddress, updatedAt: new Date().toISOString() },
  });
}

// 删除 UserEmail (软删除)
export async function deleteUserEmail(id: string) {
  const userEmail = await prisma.userEmail.findFirst({
    where: { id, deletedAt: null },
  });
  if (userEmail) {
    await prisma.userEmail.update({
      where: { id },
      data: { deletedAt: new Date() }, // 设置删除时间
    });
  }
}
// 删除 UserEmail (软删除)
export async function deleteUserEmailByAddress(email: string) {
  const userEmail = await prisma.userEmail.findFirst({
    where: { emailAddress: email, deletedAt: null },
  });

  if (userEmail) {
    await prisma.userEmail.update({
      where: { emailAddress: email },
      data: { deletedAt: new Date() },
    });
  } else {
    throw new Error("User email not found or already deleted");
  }
}

// 通过 emailAddress 查询邮件列表
export async function getEmailsByEmailAddress(
  emailAddress: string,
  page: number,
  pageSize: number,
): Promise<{ list: ForwardEmail[]; total: number }> {
  const userEmail = await prisma.userEmail.findUnique({
    where: { emailAddress, deletedAt: null },
  });

  if (!userEmail) {
    throw new Error("Email address not found");
  }

  const list = await prisma.forwardEmail.findMany({
    where: { to: emailAddress },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize, // 从第 (page-1)*pageSize 条开始
    take: pageSize, // 取 pageSize 条
  });

  const total = await prisma.forwardEmail.count({
    where: { to: emailAddress },
  });

  return {
    list,
    total,
  };
}

/**
 * 将邮件标记为已读
 * @param emailId 需要标记为已读的邮件ID
 * @param userId 当前用户ID (用于权限验证)
 * @returns 更新后的邮件信息
 */
export async function markEmailAsRead(emailId: string, userId: string) {
  try {
    // 首先查询邮件是否存在，并检查权限
    const email = await prisma.forwardEmail.findFirst({
      where: {
        id: emailId,
        UserEmail: {
          userId,
        },
        readAt: null,
      },
      include: {
        UserEmail: true,
      },
    });

    if (!email) {
      throw new Error(
        "There are no valid emails to mark as read or you do not have permission",
      );
    }

    // 更新邮件的 readAt 字段为当前时间
    const updatedEmail = await prisma.forwardEmail.update({
      where: {
        id: emailId,
      },
      data: {
        readAt: new Date(),
      },
    });

    return updatedEmail;
  } catch (error) {
    console.error("标记邮件为已读失败:", error);
    throw error;
  }
}

/**
 * 批量将邮件标记为已读
 * @param emailIds 需要标记为已读的邮件ID数组
 * @param userId 当前用户ID (用于权限验证)
 * @returns 更新的邮件数量
 */
export async function markEmailsAsRead(emailIds: string[], userId: string) {
  try {
    // 验证所有邮件是否属于该用户
    const emails = await prisma.forwardEmail.findMany({
      where: {
        id: { in: emailIds },
        UserEmail: {
          userId: userId,
        },
      },
    });

    // 获取有效的邮件IDs (用户有权限的)
    const validEmailIds = emails.map((email) => email.id);

    if (validEmailIds.length === 0) {
      throw new Error(
        "There are no valid emails to mark as read or you do not have permission",
      );
    }

    // 批量更新邮件的 readAt 字段
    const updateResult = await prisma.forwardEmail.updateMany({
      where: {
        id: { in: validEmailIds },
      },
      data: {
        readAt: new Date(),
      },
    });

    return {
      updatedCount: updateResult.count,
      message: `Successfully marked ${updateResult.count} emails as read`,
    };
  } catch (error) {
    console.error("批量标记邮件为已读失败:", error);
    throw error;
  }
}

/**
 * 将指定用户邮箱的所有邮件标记为已读
 * @param userEmailId 用户邮箱ID
 * @param userId 当前用户ID (用于权限验证)
 * @returns 更新的邮件数量
 */
export async function markAllEmailsAsRead(userEmailId: string, userId: string) {
  try {
    // 验证用户邮箱是否属于该用户
    const userEmail = await prisma.userEmail.findFirst({
      where: {
        id: userEmailId,
        userId: userId,
      },
    });

    if (!userEmail) {
      throw new Error(
        "There are no valid emails or you do not have permission",
      );
    }

    // 更新该邮箱下所有未读邮件
    const updateResult = await prisma.forwardEmail.updateMany({
      where: {
        to: userEmail.emailAddress,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return {
      updatedCount: updateResult.count,
      message: `Successfully marked ${updateResult.count} emails as read`,
    };
  } catch (error) {
    console.error("标记所有邮件为已读失败:", error);
    throw error;
  }
}

// 删除邮件
export async function deleteEmailsByIds(ids: string[]) {
  return prisma.forwardEmail.deleteMany({
    where: { id: { in: ids } },
  });
}

export async function saveUserSendEmail(
  userId: string,
  from: string,
  to: string,
  subject: string,
  html: string,
) {
  return prisma.userSendEmail.create({
    data: {
      userId,
      from,
      to,
      subject,
      html,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function getUserSendEmailCount(userId: string, admin: boolean) {
  if (admin) {
    return prisma.userSendEmail.count();
  }
  return prisma.userSendEmail.count({ where: { userId } });
}

export async function getUserSendEmailList(
  userId: string,
  admin: boolean,
  page: number,
  size: number,
  search: string,
) {
  const select = {
    from: true,
    to: true,
    subject: true,
    html: true,
    createdAt: true,
  };
  let where: any = {};

  if (admin) {
    where = {
      to: { contains: search, mode: "insensitive" },
    };
  } else {
    where = {
      userId,
      to: { contains: search, mode: "insensitive" },
    };
  }

  const listPromise = prisma.userSendEmail.findMany({
    where,
    select,
    skip: (page - 1) * size,
    take: size,
    orderBy: {
      updatedAt: "desc",
    },
  });
  const totalPromise = prisma.userSendEmail.count({
    where,
  });

  const [list, total] = await Promise.all([listPromise, totalPromise]);
  return { list, total };
}
