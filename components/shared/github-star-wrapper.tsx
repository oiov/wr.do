// components/GitHubStarsWrapper.tsx
import { Suspense } from "react";

import { Skeleton } from "../ui/skeleton";
import { ErrorBoundary } from "./error-boundary";
import GitHubStarsButton from "./github-star-button";

interface GitHubResponse {
  stargazers_count: number;
}

async function getGitHubStars(owner: string, repo: string) {
  const res = await fetch(
    `https://wr.do/api/github?owner=${owner}&repo=${repo}`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub stars");
  }

  const data = await res.json();
  return data.stars;
}

interface Props {
  owner: string;
  repo: string;
  className?: string;
}

async function GitHubStarsWrapper({ owner, repo, className }: Props) {
  const stars = await getGitHubStars(owner, repo);

  return (
    <GitHubStarsButton
      owner={owner}
      repo={repo}
      className={className}
      initialStars={stars}
    />
  );
}

// 导出一个包装了 Suspense 的组件
export default function GitHubStarsWithSuspense(props: Props) {
  return (
    <ErrorBoundary fallback={<Skeleton className="h-4 w-12 rounded-lg" />}>
      <Suspense fallback={<Skeleton className="h-4 w-12 rounded-lg" />}>
        <GitHubStarsWrapper {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
