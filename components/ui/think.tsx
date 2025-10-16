"use client";

import { motion } from "framer-motion";

export const Think = () => {
  return (
    <motion.div
      className="h-2 w-2 rounded-full bg-primary"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0,
      }}
    />
  );
};
