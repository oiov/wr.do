"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

import { Skeleton } from "../ui/skeleton";

export default function TwikooComment() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cdnScript = document.createElement("script");
    cdnScript.src =
      "https://cdn.staticfile.org/twikoo/1.6.32/twikoo.all.min.js";
    cdnScript.async = true;

    const loadSecondScript = () => {
      const initScript = document.createElement("script");
      initScript.innerHTML = `
        twikoo.init({
          envId: "https://comment.oiov.dev",
          el: '#twikoo-comment',
          pageSize: 30,
          includeReply: true,
          lang: "${locale === "zh" ? "zh-CN" : "en"}",
          path: location.host,
          onCommentLoaded: function() {
            // 评论加载完成后隐藏 loading
            window.dispatchEvent(new CustomEvent('twikoo-loaded'));
          }
        });
      `;
      initScript.id = "twikoo-init-id";
      document.body.appendChild(initScript);
    };

    // 监听 twikoo 加载完成事件
    const handleTwikooLoaded = () => {
      setIsLoading(false);
    };

    window.addEventListener("twikoo-loaded", handleTwikooLoaded);

    cdnScript.addEventListener("load", loadSecondScript);
    document.body.appendChild(cdnScript);

    // 设置超时，防止一直加载
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("twikoo-loaded", handleTwikooLoaded);

      if (loadSecondScript) {
        cdnScript.removeEventListener("load", loadSecondScript);
      }
      if (cdnScript && document.body.contains(cdnScript)) {
        document.body.removeChild(cdnScript);
      }
      const secondScript = document.querySelector("#twikoo-init-id");
      if (secondScript && document.body.contains(secondScript)) {
        document.body.removeChild(secondScript);
      }
    };
  }, [locale]);

  return (
    <div className="mx-auto my-8 max-w-2xl px-6">
      <div className="grids my-20 text-balance py-8 text-center font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
        Feedback{" "}
        <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-[30px] text-transparent sm:text-3xl md:text-4xl">
          help us do better
        </span>
      </div>
      {isLoading && (
        <div className="space-y-4">
          {/* 评论输入框占位 */}
          <Skeleton className="h-32 w-full rounded-lg" />

          {/* 评论列表占位 */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-3 border-b pb-4">
              {/* 用户头像和名称 */}
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              {/* 评论内容 */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              {/* 操作按钮 */}
              <div className="flex space-x-4">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        id="twikoo-comment"
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-300"
        }
      />
    </div>
  );
}
