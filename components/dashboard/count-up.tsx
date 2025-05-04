"use client";

import CountUp from "react-countup";

import { nFormatter } from "@/lib/utils";

export default function CountUpFn({ count }: { count: number }) {
  return (
    <CountUp
      end={count}
      duration={2}
      redraw={false}
      formattingFn={(value) => nFormatter(value)}
    />
  );
}
