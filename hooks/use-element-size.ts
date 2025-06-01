import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash-es";

interface ElementSize {
  width: number;
  height: number;
}

interface UseElementSizeOptions {
  box?: "content-box" | "border-box" | "device-pixel-content-box";
}

export function useElementSize<T extends HTMLDivElement>(
  initialSize: ElementSize = { width: 0, height: 0 },
  options: UseElementSizeOptions = {},
): { ref: React.RefObject<T>; width: number; height: number } {
  const { box = "content-box" } = options;
  const [size, setSize] = useState<ElementSize>(initialSize);
  const ref = useRef<T>(null);

  // 检查是否为 SVG 元素
  const isSVG = useCallback(
    () => ref.current?.namespaceURI?.includes("svg"),
    [],
  );

  // 更新尺寸的防抖函数
  const updateSize = useCallback(
    debounce((newSize: ElementSize) => {
      setSize((prev) =>
        prev.width === newSize.width && prev.height === newSize.height
          ? prev
          : newSize,
      );
    }, 100),
    [],
  );

  // 初始化尺寸
  useEffect(() => {
    if (typeof window === "undefined") return;
    const element = ref.current;
    if (element) {
      updateSize({
        width:
          "offsetWidth" in element ? element.offsetWidth : initialSize.width,
        height:
          "offsetHeight" in element ? element.offsetHeight : initialSize.height,
      });
    }
  }, [initialSize, updateSize]);

  // 监听尺寸变化
  useEffect(() => {
    if (typeof window === "undefined" || !window.ResizeObserver) return;
    const element = ref.current;
    if (!element) {
      updateSize({ width: initialSize.width, height: initialSize.height });
      return;
    }

    const observer = new window.ResizeObserver(([entry]) => {
      const boxSize =
        box === "border-box"
          ? entry.borderBoxSize
          : box === "content-box"
            ? entry.contentBoxSize
            : entry.devicePixelContentBoxSize;

      if (isSVG()) {
        const rect = entry.target.getBoundingClientRect();
        updateSize({ width: rect.width, height: rect.height });
      } else if (boxSize) {
        const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
        const width = formatBoxSize.reduce(
          (acc, { inlineSize }) => acc + inlineSize,
          0,
        );
        const height = formatBoxSize.reduce(
          (acc, { blockSize }) => acc + blockSize,
          0,
        );
        updateSize({ width, height });
      } else {
        updateSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
      updateSize.cancel();
    };
  }, [box, initialSize, isSVG, updateSize]);

  return { ref, width: size.width, height: size.height };
}
