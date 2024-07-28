import { getUserRecordCount } from "@/actions/cloudflare-dns-record";
import { GlobeLock, Link } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export async function DNSInfoCard({ userId }: { userId: string }) {
  const count = await getUserRecordCount(userId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">DNS Records</CardTitle>
        <GlobeLock className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {[0, -1, undefined].includes(count) ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <div className="text-2xl font-bold">{count}</div>
        )}
        <p className="text-xs text-muted-foreground">total</p>
      </CardContent>
    </Card>
  );
}

export function UrlsInfoCard({ userId }: { userId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Short URLs</CardTitle>
        <Link className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">20</div>
        <p className="text-xs text-muted-foreground">total</p>
      </CardContent>
    </Card>
  );
}
