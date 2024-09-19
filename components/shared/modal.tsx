"use client";

import useWindowSize from "@/lib/hooks/use-window-size";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Leaflet from "./leaflet";

export default function Modal({
  children,
  showModal,
  setShowModal,
  showBlur = true,
}: {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showBlur?: boolean;
}) {
  const desktopModalRef = useRef(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    },
    [setShowModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const { isMobile, isDesktop } = useWindowSize();

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {isMobile && (
            <Leaflet setShow={setShowModal} showBlur={showBlur}>
              {children}
            </Leaflet>
          )}
          {isDesktop && showBlur && (
            <>
              <motion.div
                ref={desktopModalRef}
                key="desktop-modal"
                className="fixed inset-0 z-[100] hidden min-h-screen items-center justify-center md:flex"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                // exit={{ scale: 0.95 }}
                onMouseDown={(e) => {
                  if (desktopModalRef.current === e.target) {
                    setShowModal(false);
                  }
                }}>
                {children}
              </motion.div>

              <motion.div
                key="desktop-backdrop"
                className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
