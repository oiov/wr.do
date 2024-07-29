"use client";

import CountUp from "react-countup";

export default ({ count }: { count: number }) => {
  return <CountUp end={count} duration={3} />;
};
