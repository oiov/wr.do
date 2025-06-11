import { useLocale } from "next-intl";
import TimeAgo from "timeago-react";

export function TimeAgoIntl({ date }: { date: Date }) {
  const locale = useLocale();

  return (
    <TimeAgo
      className="text-nowrap"
      datetime={date}
      locale={locale === "zh" ? "zh_CN" : locale}
    />
  );
}
