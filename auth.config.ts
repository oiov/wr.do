import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { env } from "@/env.mjs";

const linuxDoProvider: any = {
  id: "linuxdo",
  name: "Linux Do",
  version: "2.0",
  type: "oauth",
  authorization: "https://connect.linux.do/oauth2/authorize",
  token: "https://connect.linux.do/oauth2/token",
  userinfo: "https://connect.linux.do/api/user",
  clientId: env.LinuxDo_CLIENT_ID,
  clientSecret: env.LinuxDo_CLIENT_SECRET,
  checks: ["state"],
  profile: (profile: any) => {
    console.log("profile", profile);
    return {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      trust_level: profile.trust_level,
      image: profile.avatar_template,
      // active: profile.user.active,
      // silenced: profile.user.silenced,
      // email: profile.user.email,
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
    // linuxDoProvider,
  ],
} satisfies NextAuthConfig;
