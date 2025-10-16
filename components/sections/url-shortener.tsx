import Link from "next/link";

import { Icons } from "../shared/icons";

export default function UrlShotenerExp() {
  return (
    <main className="mx-auto mt-10 flex w-full max-w-[561.5px] scale-[0.8] flex-col items-center justify-center rounded-xl border border-neutral-900/[0.05] bg-neutral-500/5 px-4 py-5 backdrop-blur dark:border-neutral-700/50">
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
      <div className="w-full">
        <div className="space-y-3">
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Shorten any link..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600"
              />
              <Link
                href={"/dashboard/urls"}
                className="absolute right-2 rounded-lg bg-blue-500 p-1 text-white"
              >
                <Icons.arrowDown className="size-5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-black">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="white"
                    />
                    <path
                      d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-gray-700 dark:text-gray-50">
                      wr.do/try
                    </p>
                    <div className="flex gap-1">
                      <button className="rounded-full border p-1.5 transition-colors hover:bg-gray-100 dark:bg-gray-600/50">
                        <Icons.copy className="size-3 text-gray-500" />
                      </button>
                      <button className="rounded-full border p-1.5 transition-colors hover:bg-gray-100 dark:bg-gray-600/50">
                        <Icons.qrcode className="size-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                    <Icons.forwardArrow className="h-4 w-4 shrink-0 text-gray-400" />
                    wr.do/dashboard
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg border bg-gray-50 px-3 py-1 dark:bg-gray-600/50">
                  <Icons.mousePointerClick className="size-4" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-50">
                    12.6K <span className="hidden sm:inline">clicks</span>
                  </p>
                </div>
                <button className="hidden rounded-lg p-2 transition-colors hover:bg-gray-100 sm:block">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-500"
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
                      d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
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
        </div>
      </div>
    </main>
  );
}
