import { ForwardEmail } from "@prisma/client";

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

export async function createEmail(emailData: OriginalEmail) {
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
      headers: emailData.headers,
      attachments: JSON.stringify(emailData.attachments), // 转换为 JSON 字符串
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
  if (!res) {
    return null;
  }
  return res.id;
}
