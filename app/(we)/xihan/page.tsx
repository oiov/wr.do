import Link from "next/link";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "我熙菡你",
  description: "关于我们的故事",
});

export default async function XiHanPage() {
  return (
    <>
      <div className="flex flex-col gap-5">菡</div>
    </>
  );
}
