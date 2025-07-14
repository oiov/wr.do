"use client";

import * as React from "react";
import { useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-[99999] overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipArrow,
};

export const ClickableTooltip = ({ children, content, className = "" }) => {
  const [open, setOpen] = useState(false);
  const { isMobile } = useMediaQuery();

  const handleClick = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  return (
    <TooltipProvider>
      <Tooltip
        delayDuration={0}
        open={open}
        onOpenChange={setOpen}
        disableHoverableContent
      >
        <TooltipTrigger
          asChild
          onPointerEnter={(e) => e.preventDefault()} // 阻止指针进入事件
          onPointerLeave={(e) => e.preventDefault()} // 阻止指针离开事件
          onPointerMove={(e) => e.preventDefault()} // 阻止指针移动事件
          onFocus={(e) => e.preventDefault()} // 阻止焦点事件
          onBlur={(e) => e.preventDefault()}
        >
          <div onClick={handleClick} className={className} title="Details">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="p-1" side={isMobile ? "bottom" : "right"}>
            {content}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
