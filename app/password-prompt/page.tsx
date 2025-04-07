import { constructMetadata } from "@/lib/utils";

import PasswordPrompt from "./card";

export const metadata = constructMetadata({
  title: "Password Required",
  description: "Short link with password",
});

export default async function Page() {
  return <PasswordPrompt />;
}
