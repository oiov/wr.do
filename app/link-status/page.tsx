import { constructMetadata } from "@/lib/utils";

import LinkStatusContent from "./link-status-content";

export const metadata = constructMetadata({
  title: "Invalid Link",
  description: "Meet some problems of your link",
});

export default async function Page() {
  return <LinkStatusContent />;
}
