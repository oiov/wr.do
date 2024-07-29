import Link from "next/link";
import { GlobeLock, Link as LinkIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { getUserRecordCount } from "@/lib/dto/cloudflare-dns-record";
import { getUserShortUrlCount } from "@/lib/dto/short-urls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "@/components/dashboard/count-up";

export async function DNSInfoCard({ userId }: { userId: string }) {
  const count = await getUserRecordCount(userId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link className="hover:underline" href="/dashboard/records">
            DNS Records
          </Link>
        </CardTitle>
        <GlobeLock className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {[-1, undefined].includes(count) ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <div className="flex items-end gap-2 text-2xl font-bold">
            <CountUp count={count} />
            <span className="align-top text-base text-slate-500">
              / {siteConfig.freeQuota.record}
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">total</p>
      </CardContent>
    </Card>
  );
}

export async function UrlsInfoCard({ userId }: { userId: string }) {
  const count = await getUserShortUrlCount(userId);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link className="hover:underline" href="/dashboard/urls">
            Short URLs
          </Link>
        </CardTitle>
        <LinkIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {[-1, undefined].includes(count) ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <div className="flex items-end gap-2 text-2xl font-bold">
            <CountUp count={count} />
            <span className="align-top text-base text-slate-500">
              / {siteConfig.freeQuota.url}
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">total</p>
      </CardContent>
    </Card>
  );
}
