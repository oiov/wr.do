import Link from "next/link";
import { useTranslations } from "next-intl";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  link?: string;
  linkText?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  link,
  linkText,
  children,
}: DashboardHeaderProps) {
  const t = useTranslations("Components");
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl font-semibold">{t(heading)}</h1>

        <p className="text-sm text-muted-foreground">
          {text && <span>{t(text)}.</span>}
          {link && (
            <span>
              {" "}
              {t("See documentation")}:{" "}
              <Link
                href={link}
                target="_blank"
                className="font-semibold after:content-['_↗'] hover:text-blue-500 hover:underline"
              >
                {linkText}
              </Link>
              .
            </span>
          )}
        </p>
      </div>
      {children}
    </div>
  );
}
