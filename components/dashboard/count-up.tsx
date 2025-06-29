"use client";

import CountUp from "react-countup";

import { nFormatter } from "@/lib/utils";

export default function CountUpFn({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <CountUp
      className={className}
      end={count}
      duration={2}
      redraw={false}
      formattingFn={(value) => nFormatter(value)}
    />
  );
}
