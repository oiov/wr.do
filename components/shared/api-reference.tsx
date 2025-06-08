import Link from "next/link";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiReference({
  badge,
  target,
  link,
}: {
  badge: string;
  target: string;
  link: string;
}) {
  const t = useTranslations("Components");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("API Reference")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>{badge}</Badge>
        <div className="mt-2">
          <span style={{ fontFamily: "Bahamas Bold" }}>WR.DO</span>{" "}
          {t("provide a api for {target}", { target: t(target) })}.{" "}
          {t("View the usage tutorial")}{" "}
          <Link
            href={link}
            target="_blank"
            className="font-semibold after:content-['_↗'] hover:text-blue-500 hover:underline"
          >
            {t("document")}
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
}
