import Link from "next/link";

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
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl font-semibold">{heading}</h1>

        <p className="text-sm text-muted-foreground">
          {text && <span>{text}</span>}
          {link && (
            <span>
              {" "}
              See documentation about{" "}
              <Link
                href={link}
                target="_blank"
                className="font-semibold after:content-['_↗'] hover:text-blue-500 hover:underline"
              >
                {linkText}
              </Link>
            </span>
          )}
        </p>
      </div>
      {children}
    </div>
  );
}
