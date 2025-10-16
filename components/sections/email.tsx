"use client";

import { useState } from "react";
import Link from "next/link";

import { Icons } from "../shared/icons";

export default function EmailManagerInnovate() {
  const [viewMode, setViewMode] = useState("inbox"); // Toggle between inbox and sent

  return (
    <main className="mx-auto my-8 hidden w-full max-w-[561.5px] scale-[0.8] flex-col items-center justify-center rounded-2xl border border-neutral-800/[0.08] bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-lg backdrop-blur-lg dark:border-neutral-700/50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black dark:shadow-xl md:flex">
      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-neutral-300 bg-[#eff9fa] px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-700/50 dark:bg-neutral-900 dark:text-neutral-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-link2 size-3.5 text-neutral-800 dark:text-neutral-300"
        >
          <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
          <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
          <line x1="8" x2="16" y1="12" y2="12"></line>
        </svg>
        Try it out
      </div>
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="flex items-center gap-2 rounded-full bg-blue-100/50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Email Manager
        </div>
        <div className="flex gap-2 rounded-full border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setViewMode("inbox")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              viewMode === "inbox"
                ? "bg-blue-500 text-white dark:bg-blue-600"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setViewMode("sent")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              viewMode === "sent"
                ? "bg-blue-500 text-white dark:bg-blue-600"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Sent
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <div className="flex items-center">
          <input
            type="text"
            placeholder={`Search ${viewMode === "inbox" ? "received" : "sent"} emails...`}
            className="w-full rounded-full border border-gray-200 bg-white/80 px-4 py-2.5 text-sm text-gray-700 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200 dark:placeholder:text-gray-400 dark:focus:ring-blue-500"
          />
          <Link
            href={`/emails`}
            className="absolute right-2 rounded-full bg-blue-600 p-1.5 text-white shadow-md transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Icons.search className="size-4" />
          </Link>
        </div>
      </div>

      {/* Email Card */}
      <div className="mt-4 w-full rounded-xl border border-gray-100 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90 dark:hover:shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white dark:from-blue-600 dark:to-blue-800">
              <Icons.mail className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {viewMode === "inbox" ? "example@gmail.com" : "app@wr.do"}
                </p>
                <div className="flex gap-1">
                  <button className="rounded-full border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                    <Icons.copy className="size-3" />
                  </button>
                  <button className="rounded-full border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                    <Icons.qrcode className="size-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Icons.forwardArrow className="h-4 w-4 shrink-0 text-gray-400" />
                {viewMode === "inbox" ? "app@wr.do" : "example@gmail.com"}
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
              <Icons.mail className="size-4" />
              <p>
                {viewMode === "inbox" ? "5.2K" : "3.8K"}{" "}
                <span className="hidden sm:inline">emails</span>
              </p>
            </div>
            <button className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-500 dark:text-gray-400"
              >
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 19C11 19.5523 11.4477 20 12 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
