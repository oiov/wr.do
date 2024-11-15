import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { env } from "@/env.mjs";

const linuxDoProvider: any = {
  id: "linuxdo",
  name: "Linux Do",
  version: "1.0",
  type: "oauth",
  authorization: "https://connect.linux.do/oauth2/authorize",
  token: "https://connect.linux.do/oauth2/token",
  userinfo: "https://connect.linux.do/api/user",
  clientId: env.LinuxDo_CLIENT_ID,
  clientSecret: env.LinuxDo_CLIENT_SECRET,
  checks: ["state"],
  profile: (profile: any) => {
    // console.log("profile", profile);
    return {
      id: profile.user.id.toString(),
      username: profile.user.username,
      name: profile.user.username,
      active: profile.user.active,
      trust_level: profile.user.trust_level,
      silenced: profile.user.silenced,
      email: profile.user.email,
    };
  },
};

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: "wrdo <support@wr.do>",
    }),
    linuxDoProvider,
  ],
} satisfies NextAuthConfig;
