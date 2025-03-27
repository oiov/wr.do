import { Resend } from "resend";

import { env } from "@/env.mjs";

export const resend = new Resend(env.RESEND_API_KEY);

export function getVerificationEmailHtml({
  url,
  appName,
}: {
  url: string;
  appName: string;
}): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification - ${appName}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 0;
          }
          .wrapper {
            max-width: 600px;
            margin: 40px auto;
            background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(90deg, #346df1 0%, #5b9aff 100%);
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            font-size: 28px;
            margin: 0;
            font-weight: 600;
          }
          .header p {
            font-size: 16px;
            margin: 8px 0 0;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
            color: #333333;
          }
          .content h2 {
            font-size: 20px;
            margin: 0 0 15px;
            color: #1a1a1a;
          }
          .content p {
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 20px;
            color: #555555;
          }
          .button-container {
            text-align: center;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #346df1;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: #2858c1;
          }
          .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 30px 0;
          }
          .footer {
            padding: 20px 30px;
            background-color: #f9fafb;
            text-align: center;
            font-size: 14px;
            color: #888888;
          }
          .footer a {
            color: #346df1;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>Welcome to ${appName}</h1>
            <p>Your journey starts here 🎉</p>
          </div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p>
              Hello there,<br />
              Thank you for joining ${appName}! To complete your login and get started,
              please verify your email address by clicking the button below:
            </p>
            <div class="button-container">
              <a href="${url}" class="button">Verify Email Now</a>
            </div>
            <p>
              Or copy and paste the link below into your browser: <br />
              <a href="${url}">${url}</a>
            </p>
            <p>
              If you didn’t request this email or believe this was sent in error,
              you can safely ignore it. This link will expire in 24 hours for security reasons.
            </p>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <p>
              Best regards,<br />
              The ${appName} Team
            </p>
            <p>
              Need help? <a href="mailto:support@${appName.toLowerCase()}">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// TODO: Update sendVerificationRequest for use react-email with resend magic-link

// Email({
//   sendVerificationRequest: async ({ identifier, url, provider }) => {
//     const user = await getUserByEmail(identifier);
//     if (!user || !user.name) return null;

//     const userVerified = user?.emailVerified ? true : false;
//     const authSubject = userVerified ? `Sign-in link for ${siteConfig.name}` : "Activate your account";

//     try {
//       const { data, error } = await resend.emails.send({
//         from: 'WR.DO App <onboarding@resend.dev>',
//         to: process.env.NODE_ENV === "development" ? 'delivered@resend.dev' : identifier,
//         subject: authSubject,
//         react: MagicLinkEmail({
//           firstName: user?.name as string,
//           actionUrl: url,
//           mailType: userVerified ? "login" : "register",
//           siteName: siteConfig.name
//         }),
//         // Set this to prevent Gmail from threading emails.
//         // More info: https://resend.com/changelog/custom-email-headers
//         headers: {
//           'X-Entity-Ref-ID': new Date().getTime() + "",
//         },
//       });

//       if (error || !data) {
//         throw new Error(error?.message)
//       }

//       // console.log(data)
//     } catch (error) {
//       throw new Error("Failed to send verification email.")
//     }
//   },
// }),
