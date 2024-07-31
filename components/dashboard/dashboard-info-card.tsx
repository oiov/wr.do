import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "@/components/dashboard/count-up";
import { Icons } from "@/components/shared/icons";

export async function DashboardInfoCard({
  userId,
  title,
  total,
  count,
  link,
  // icon = "user",
}: {
  userId: string;
  title: string;
  total?: number;
  count: number;
  link: string;
  // icon: keyof typeof Icons;
}) {
  // const iconCpn = Icons[icon];
  return (
    <Card className="grids group bg-gray-50/70 backdrop-blur-lg dark:bg-primary-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link
            className="font-semibold text-slate-500 duration-500 group-hover:text-blue-500 group-hover:underline"
            href={link}
          >
            {title}
          </Link>
        </CardTitle>
        {/* {icon && <iconCpn />} */}
        <LinkIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {[-1, undefined].includes(count) ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <div className="flex items-end gap-2 text-2xl font-bold">
            <CountUp count={count} />
            {total && (
              <span className="align-top text-base text-slate-500">
                / {total}
              </span>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground">total</p>
      </CardContent>
    </Card>
  );
}

export function HeroCard() {
  return (
    <div className="group relative mb-4 h-full w-full shrink-0 origin-left overflow-hidden rounded-lg border bg-gray-50/70 p-4 text-left duration-500 before:absolute before:right-1 before:top-1 before:z-[2] before:h-12 before:w-12 before:rounded-full before:bg-violet-500 before:blur-lg before:duration-500 after:absolute after:right-8 after:top-3 after:z-[2] after:h-20 after:w-20 after:rounded-full after:bg-rose-300 after:blur-lg after:duration-500 hover:border-cyan-600 hover:decoration-2 hover:duration-500 hover:before:-bottom-8 hover:before:right-12 hover:before:blur hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] hover:after:-right-8 group-hover:before:duration-500 group-hover:after:duration-500 dark:bg-primary-foreground md:max-w-[350px]">
      <h1 className="mb-7 text-lg font-bold duration-500 group-hover:text-blue-500">
        Free Records & URLs
      </h1>
      <p className="text-sm">
        Learn more from{" "}
        <Link
          className="text-blue-500 hover:underline"
          href="/docs"
          target="_blank"
        >
          documents.
        </Link>{" "}
      </p>
    </div>
  );
}