import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { nFormatter } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "@/components/dashboard/count-up";
import { Icons } from "@/components/shared/icons";

export async function UserInfoCard({
  userId,
  title,
  total,
  count,
  link,
  icon = "users",
}: {
  userId: string;
  title: string;
  total?: number;
  count: number;
  link: string;
  icon?: keyof typeof Icons;
}) {
  const Icon = Icons[icon || "arrowRight"];
  const t = useTranslations("Components");
  return (
    <Card className="grids group bg-gray-50/70 backdrop-blur-lg dark:bg-primary-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link
            className="font-semibold text-slate-500 duration-500 group-hover:text-blue-500 group-hover:underline"
            href={link}
          >
            {t(title)}
          </Link>
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {[-1, undefined].includes(count) ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <div className="flex items-end gap-2 text-2xl font-bold">
            <CountUp count={count} />
            {total !== undefined && (
              <span className="align-top text-base text-slate-500">
                / {total}
              </span>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{t("total")}</p>
      </CardContent>
    </Card>
  );
}

export async function DashboardInfoCard({
  userId,
  title,
  total,
  monthTotal,
  limit,
  link,
  icon = "users",
}: {
  userId: string;
  title: string;
  total?: number;
  monthTotal: number;
  limit: number;
  link: string;
  icon?: keyof typeof Icons;
}) {
  // const t = useTranslations("Components");
  const t = await getTranslations("Components");
  const Icon = Icons[icon || "arrowRight"];
  return (
    <Card className="grids group animate-fade-in bg-gray-50/70 backdrop-blur-lg dark:bg-primary-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link
            className="font-semibold text-slate-500 duration-500 group-hover:text-blue-500 group-hover:underline"
            href={link}
          >
            {t(title)}
          </Link>
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {[-1, undefined].includes(total) ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <div className="flex items-end gap-2 text-2xl font-bold">
            <CountUp count={monthTotal} />
            {total !== undefined && (
              <p className="align-top text-base text-slate-500">
                / {nFormatter(limit)}{" "}
                <span className="text-xs">({t("monthly")})</span>
              </p>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {t("total")}: {total}
        </p>
      </CardContent>
    </Card>
  );
}

export async function HeroCard({
  total,
  monthTotal,
  limit,
}: {
  total: number;
  monthTotal: number;
  limit: number;
}) {
  // const t = useTranslations("Components");
  const t = await getTranslations("Components");
  return (
    <div className="grids group relative mb-4 h-full w-full shrink-0 origin-left overflow-hidden rounded-lg border bg-gray-50/70 px-5 pt-5 text-left duration-500 before:absolute before:right-1 before:top-1 before:z-[2] before:h-12 before:w-12 before:rounded-full before:bg-violet-500 before:blur-lg before:duration-500 after:absolute after:right-8 after:top-3 after:z-[2] after:h-20 after:w-20 after:rounded-full after:bg-rose-300 after:blur-lg after:duration-500 hover:border-cyan-600 hover:decoration-2 hover:duration-500 hover:before:-bottom-8 hover:before:right-12 hover:before:blur hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] hover:after:-right-8 group-hover:before:duration-500 group-hover:after:duration-500 dark:bg-primary-foreground md:max-w-[350px]">
      <div className="flex flex-row items-center justify-between">
        <Link
          href="/emails"
          className="text-lg font-bold duration-500 group-hover:text-blue-500 group-hover:underline"
        >
          {t("Email box")}
        </Link>
        <Icons.mail className="size-4 text-muted-foreground" />
      </div>

      <div className="mt-1">
        {[-1, undefined].includes(total) ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <div className="flex items-end gap-2 text-2xl font-bold">
            <CountUp count={monthTotal} />
            {total !== undefined && (
              <p className="align-top text-base text-slate-500">
                / {nFormatter(limit)}{" "}
                <span className="text-xs">({t("monthly")})</span>
              </p>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {t("total")}: {total}
        </p>
      </div>
    </div>
  );
}

export async function StaticInfoCard({
  title,
  desc,
  link,
  icon = "users",
}: {
  title: string;
  desc?: string;
  link: string;
  icon?: keyof typeof Icons;
}) {
  const Icon = Icons[icon || "arrowRight"];
  const t = await getTranslations("Components");
  return (
    <Card className="grids group bg-gray-50/70 backdrop-blur-lg dark:bg-primary-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link
            className="font-semibold text-slate-500 duration-500 group-hover:text-blue-500 group-hover:underline"
            href={link}
          >
            {t(title)}
          </Link>
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {desc && <p className="text-xs text-muted-foreground">{t(desc)}</p>}
      </CardContent>
    </Card>
  );
}
