import * as brevo from "@getbrevo/brevo";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailSender {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  from?: string;
  fromName?: string;
  to: string | string[] | EmailRecipient | EmailRecipient[];
  subject: string;
  html: string;
  sender?: EmailSender;
  textContent?: string;
  key?: string;
}

export interface EmailResponse {
  success: boolean;
  data?: any;
  error?: any;
}

// 初始化 API 实例
let apiInstance: brevo.TransactionalEmailsApi | null = null;

function getApiInstance(key?: string): brevo.TransactionalEmailsApi {
  if (!apiInstance) {
    const apiKey = key || process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not defined in environment variables");
    }

    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }
  return apiInstance;
}

// 处理收件人格式
function formatRecipients(
  to: string | string[] | EmailRecipient | EmailRecipient[],
): EmailRecipient[] {
  if (typeof to === "string") {
    return [{ email: to, name: to.split("@")[0] }];
  }
  if (Array.isArray(to)) {
    return to.map((item) => {
      // 如果是字符串，转换为对象格式
      if (typeof item === "string") {
        return {
          email: item,
          name: item.includes("@") ? item.split("@")[0] : item,
        };
      }
      // 如果已经是对象格式，直接返回
      return item;
    });
  }
  return [to];
}

/**
 * 发送单封邮件
 * @param options - 邮件配置选项
 * @returns 返回发送结果的Promise
 */
export async function brevoSendEmail(
  options: SendEmailOptions,
): Promise<EmailResponse> {
  const {
    to,
    subject,
    html,
    from,
    fromName,
    sender = {
      email: from || process.env.EMAIL_FROM || "service@wr.do",
      name: fromName || process.env.EMAIL_FROM_NAME || "WRDO",
    },
    textContent,
    key,
  } = options;

  try {
    const api = getApiInstance(key);
    const recipients = formatRecipients(to);

    // 构建邮件对象
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = recipients;
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    if (textContent) {
      sendSmtpEmail.textContent = textContent;
    }

    const data = await api.sendTransacEmail(sendSmtpEmail);
    return { success: true, data };
  } catch (error) {
    console.error("Send email error:", error);
    return { success: false, error };
  }
}

/**
 * 批量发送邮件
 * @param emailList - 邮件列表
 * @returns 返回所有邮件发送结果
 */
export async function sendBatchEmails(
  emailList: SendEmailOptions[],
): Promise<PromiseSettledResult<EmailResponse>[]> {
  const results = await Promise.allSettled(
    emailList.map((emailOptions) => brevoSendEmail(emailOptions)),
  );
  return results;
}
