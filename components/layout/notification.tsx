"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";

import { Icons } from "../shared/icons";
import { Button } from "../ui/button";

export function Notification() {
  const [isVisible, setIsVisible] = useState(true);

  const { data, isLoading, error } = useSWR<Record<string, any>>(
    "/api/configs?key=system_notification",
    fetcher,
  );

  const handleClose = () => {
    setIsVisible(false);
  };

  if (error || isLoading || !data || !data.system_notification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="relative flex max-h-24 w-full items-center justify-center bg-muted text-sm text-primary"
        >
          <div
            className="max-w-3xl flex-1 px-8 py-2.5 text-center"
            dangerouslySetInnerHTML={{ __html: data.system_notification }}
          />

          <Button
            onClick={handleClose}
            variant={"ghost"}
            size={"icon"}
            className="absolute right-1.5 top-[18px] flex size-6 -translate-y-1/2 items-center justify-center"
          >
            <Icons.close className="size-4 text-primary" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
