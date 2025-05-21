import React from "react";

import { cn } from "@/lib/utils";

interface SectionColumnsType {
  title: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function FormSectionColumns({
  title,
  children,
  required,
  className,
}: SectionColumnsType) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 items-center gap-x-12 gap-y-2 py-2",
        className,
      )}
    >
      <div className="col-span-4 flex items-start gap-0.5 text-sm leading-none">
        <h2 className="font-semibold">{title}</h2>
        {required && (
          <span className="text-neutral-500 dark:text-neutral-300">*</span>
        )}
      </div>
      <div className="col-span-6">{children}</div>
    </div>
  );
}
