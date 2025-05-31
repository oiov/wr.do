"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "../ui/separator";

export function DocsLang({ en, zh }: { en: string; zh: string }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1.5">
      {pathname !== en ? (
        <Link href={en} className="text-blue-500 hover:underline">
          English
        </Link>
      ) : (
        <p className="text-muted-foreground">English</p>
      )}
      <div className="h-[20px] w-px shrink-0 border bg-border text-neutral-400"></div>
      {pathname !== zh ? (
        <Link href={zh} className="text-blue-500 hover:underline">
          简体中文
        </Link>
      ) : (
        <p className="text-muted-foreground">简体中文</p>
      )}
    </div>
  );
}
