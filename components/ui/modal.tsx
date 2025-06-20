"use client";

import { Dispatch, SetStateAction } from "react";
// import { useRouter } from "next/router";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
  maxHeight?: string; // 自定义最大高度
  contentClassName?: string; // 内容区域的额外样式
}

export function Modal({
  children,
  className,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
  maxHeight = "90vh",
  contentClassName,
}: ModalProps) {
  // const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose && onClose();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
    }
    // else, this is intercepting route @modal
    // else {
    // router.back();
    // }
  };
  const { isMobile } = useMediaQuery();

  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
      >
        <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden rounded-t-[10px] border bg-background",
              className,
            )}
            style={{ maxHeight }}
          >
            {/* 拖拽手柄 - 固定在顶部 */}
            <div className="flex shrink-0 items-center justify-center bg-inherit py-3">
              <div className="h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>

            {/* 可滚动内容区域 */}
            <div
              className={cn(
                "flex-1 overflow-y-auto overscroll-contain",
                contentClassName,
              )}
            >
              {children}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <Dialog
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "flex max-h-[90vh] flex-col overflow-hidden p-0 md:max-w-md md:rounded-2xl md:border",
          className,
        )}
        style={{ maxHeight }}
      >
        <div
          className={cn(
            "flex-1 overflow-y-auto overscroll-contain",
            contentClassName,
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
