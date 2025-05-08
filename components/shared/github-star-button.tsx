// components/GitHubStarsButton.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { cn, nFormatter } from "@/lib/utils";

import { buttonVariants } from "../ui/button";

interface GitHubStarsButtonProps {
  owner: string;
  repo: string;
  className?: string;
  initialStars?: number;
}

const GitHubStarsButton: React.FC<GitHubStarsButtonProps> = ({
  owner,
  repo,
  className = "",
  initialStars,
}) => {
  const [stars, setStars] = useState<number>(initialStars ?? 0);
  const [loading, setLoading] = useState<boolean>(!initialStars);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      // 如果有初始值，不需要立即获取
      if (initialStars !== undefined) return;

      try {
        const response = await fetch(
          `/api/github?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`,
          );
        }

        const data = await response.json();
        setStars(data.stars);
        setError(null);
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch stars",
        );
      } finally {
        setLoading(false);
      }
    };

    if (owner && repo) {
      fetchStars();
    }
  }, [owner, repo, initialStars]);

  return (
    <Link
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({
          variant: "outline",
          rounded: "lg",
          size: "lg",
          className: "bg-primary-foreground hover:opacity-70",
        }),
        "px-4 text-[15px]",
        className,
      )}
      aria-label={`GitHub repository: ${owner}/${repo}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="mr-2 h-5 w-5"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
      <span className="flex items-center gap-2 font-medium">
        GitHub
        {loading ? (
          <span className="h-7 w-20 animate-pulse rounded-[16px] bg-gray-200/80" />
        ) : (
          <span className="animate-fade-in rounded-[16px] bg-gray-200/80 px-3 py-1 text-sm font-bold text-slate-600">
            {nFormatter(stars)} stars
          </span>
        )}
      </span>
    </Link>
  );
};

export default GitHubStarsButton;
