"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DocsLang({ en, zh }: { en: string; zh: string }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-2">
      {pathname !== en ? (
        <Link href={en} className="text-blue-500 hover:underline">
          English
        </Link>
      ) : (
        <p className="text-muted-foreground">English</p>
      )}
      <span className="text-muted-foreground">|</span>
      {pathname !== zh ? (
        <Link href={zh} className="text-blue-500 hover:underline">
          中文
        </Link>
      ) : (
        <p className="text-muted-foreground">中文</p>
      )}
    </div>
  );
}
