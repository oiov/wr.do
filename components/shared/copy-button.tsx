"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Icons } from "./icons";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className={cn(
        "z-10 size-[30px] p-1.5 text-foreground hover:border hover:text-foreground dark:text-foreground",
        className,
      )}
      onClick={() => handleCopyValue(value)}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <Icons.check className="size-4" />
      ) : (
        <Icons.copy className="size-4" />
      )}
    </Button>
  );
}
