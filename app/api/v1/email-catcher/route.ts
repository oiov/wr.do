import { OriginalEmail, saveForwardEmail } from "@/lib/dto/email";
import { getMultipleConfigs } from "@/lib/dto/system-config";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as OriginalEmail;
    if (!data) {
      return Response.json("No email data received", { status: 400 });
    }

    const configs = await getMultipleConfigs([
      "enable_email_catch_all",
      "catch_all_emails",
      "enable_tg_email_push",
      "tg_email_bot_token",
      "tg_email_chat_id",
      "tg_email_template",
      "tg_email_target_white_list",
    ]);

    // Catch-all
    if (configs.enable_email_catch_all) {
      const validEmails = parseAndValidateEmails(configs.catch_all_emails);

      if (validEmails.length === 0) {
        return Response.json(
          { error: "No valid catch-all emails configured" },
          { status: 400 },
        );
      }

      const forwardPromises = validEmails.map((email) =>
        saveForwardEmail({ ...data, to: email }),
      );

      await Promise.all(forwardPromises);
    } else {
      await saveForwardEmail(data);
    }

    // Telegram
    if (configs.enable_tg_email_push) {
      const shouldPush = shouldPushToTelegram(
        data,
        configs.tg_email_target_white_list,
      );
      if (shouldPush) {
        await sendToTelegram(data, configs);
      }
    }

    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 500 });
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function parseAndValidateEmails(emailsString: string): string[] {
  if (!emailsString || typeof emailsString !== "string") {
    return [];
  }

  const emails = emailsString
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  const validEmails = emails.filter((email) => isValidEmail(email));

  if (validEmails.length !== emails.length) {
    console.warn(
      "Some invalid email addresses found:",
      emails.filter((email) => !isValidEmail(email)),
    );
  }

  return validEmails;
}

/*  Pusher   */
function shouldPushToTelegram(
  email: OriginalEmail,
  whiteList: string,
): boolean {
  if (!whiteList || whiteList.trim() === "") {
    return true;
  }

  const whiteListArray = whiteList
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  return whiteListArray.includes(email.to);
}

async function sendToTelegram(email: OriginalEmail, configs: any) {
  const { tg_email_bot_token, tg_email_chat_id, tg_email_template } = configs;

  if (!tg_email_bot_token || !tg_email_chat_id) {
    console.error("Telegram bot token or chat ID not configured");
    return;
  }

  // 解析多个 chat ID（支持逗号分隔）
  const chatIds = tg_email_chat_id
    .split(",")
    .map((id: string) => id.trim())
    .filter((id: string) => id.length > 0);

  if (chatIds.length === 0) {
    console.error("No valid chat IDs found");
    return;
  }

  try {
    const message = formatEmailForTelegram(email, tg_email_template);

    const sendPromises = chatIds.map(async (chatId: string) => {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${tg_email_bot_token}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "Markdown",
              disable_web_page_preview: true,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          console.error(
            `Failed to send message to Telegram chat ${chatId}:`,
            error,
          );
          return { chatId, success: false, error };
        } else {
          console.log(`Email successfully sent to Telegram chat ${chatId}`);
          return { chatId, success: true };
        }
      } catch (error) {
        console.error(`Error sending to Telegram chat ${chatId}:`, error);
        return { chatId, success: false, error };
      }
    });

    const results = await Promise.all(sendPromises);

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    console.log(
      `Telegram push completed: ${successCount}/${totalCount} successful`,
    );
  } catch (error) {
    console.error("Error in sendToTelegram:", error);
  }
}

// 格式化邮件内容为 Telegram 消息（Markdown 格式）
function formatEmailForTelegram(
  email: OriginalEmail,
  template?: string,
): string {
  const fromInfo = email.fromName
    ? `${email.fromName} <${email.from}>`
    : email.from;

  if (template) {
    return template
      .replace("{{from}}", fromInfo)
      .replace("{{to}}", email.to)
      .replace("{{subject}}", email.subject || "No Subject")
      .replace("{{text}}", email.text || "No content")
      .replace("{{date}}", email.date || "--");
  }

  const subject = email.subject || "No Subject";
  const content =
    email.text || email.html?.replace(/<[^>]*>/g, "") || "No content";

  const date = email.date || "Unknown date";

  // 限制内容长度
  const maxContentLength = 2000;
  const truncatedContent =
    content.length > maxContentLength
      ? content.substring(0, maxContentLength) + "..."
      : content;

  let message = `📧 *New Email*\n\n`;
  message += `*From:* \`${fromInfo}\`\n`;
  message += `*To:* \`${email.to}\`\n`;
  message += `*Subject:* ${subject}\n`;
  message += `*Date:* ${date}\n`;
  message += `\n\`\`\`Content\n${truncatedContent}\n\`\`\``;

  return message;
}
