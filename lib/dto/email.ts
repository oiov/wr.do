import { ForwardEmail, UserEmail } from "@prisma/client";

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
) {
  const [userEmails, total] = await Promise.all([
    prisma.userEmail.findMany({
      where: {
        userId,
        deletedAt: null,
        emailAddress: { contains: search, mode: "insensitive" },
      },
      select: {
        id: true,
        userId: true,
        emailAddress: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { forwardEmails: true } },
      },
      skip: page * size,
      take: size,
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.userEmail.count({
      where: {
        userId,
        deletedAt: null,
        emailAddress: { contains: search, mode: "insensitive" },
      },
    }),
  ]);

  const result = userEmails.map((email) => ({
    ...email,
    count: email._count.forwardEmails,
  }));

  return {
    list: result,
    total,
  };
}

// 查询所有 UserEmail 数量
export async function getAllUserEmailsCount(userId: string) {
  return prisma.userEmail.count({ where: { userId, deletedAt: null } });
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
