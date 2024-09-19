import Link from "next/link";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getCheckEventNames } from "@/lib/dto/han-event";
import { constructMetadata } from "@/lib/utils";

import EventList from "./event-list";
import XihanLoading from "./loading";

export const metadata = constructMetadata({
  title: "我熙菡你 | 主页",
  description: "关于我们的故事",
});

export default async function XiHanPage() {
  return (
    <div>
      <EventList />
    </div>
  );
}
