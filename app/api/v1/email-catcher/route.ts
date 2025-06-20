import { OriginalEmail, saveForwardEmail } from "@/lib/dto/email";
import { getMultipleConfigs } from "@/lib/dto/system-config";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as OriginalEmail;
    // console.log("Received email:", data);
    if (!data) {
      return Response.json("No email data received", { status: 400 });
    }

    const configs = await getMultipleConfigs([
      "enable_email_catch_all",
      "catch_all_emails",
    ]);

    if (configs.enable_email_catch_all) {
      const validEmails = parseAndValidateEmails(configs.catch_all_emails);

      if (validEmails.length === 0) {
        return Response.json(
          { error: "No valid catch-all emails configured" },
          { status: 400 },
        );
      }

      // 方案1: 转发给所有配置的邮箱
      const forwardPromises = validEmails.map((email) =>
        saveForwardEmail({ ...data, to: email }),
      );

      await Promise.all(forwardPromises);

      // 方案2: 只想转发给第一个邮箱
      // await saveForwardEmail({ ...data, to: validEmails[0] });
    } else {
      await saveForwardEmail(data);
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
