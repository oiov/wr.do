"use client";

import CountUp from "react-countup";

export default function ({ count }: { count: number }) {
  return <CountUp end={count} duration={3} />;
}
