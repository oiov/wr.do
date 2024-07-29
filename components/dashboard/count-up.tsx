"use client";

import CountUp from "react-countup";

export default function CountUpFn({ count }: { count: number }) {
  return <CountUp end={count} duration={3} />;
}
