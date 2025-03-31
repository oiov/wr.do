import React from "react";

import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export function PaginationWrapper({
  className,
  total,
  currentPage,
  setCurrentPage,
}: {
  className?: string;
  total: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const shouldShowPage = (page: number) => {
    return page === 1 || page === total || Math.abs(page - currentPage) <= 2;
  };

  const shouldShowEllipsis = (page: number, prevPage: number | null) => {
    return prevPage && page - prevPage > 1;
  };

  const pages: any = [];
  let prevPage: number | null = null;

  for (let page = 1; page <= total; page++) {
    if (shouldShowPage(page)) {
      if (shouldShowEllipsis(page, prevPage)) {
        pages.push(<PaginationEllipsis key={`ellipsis-${page}`} />);
      }
      pages.push(
        <PaginationItem key={page}>
          <PaginationLink
            isActive={page === currentPage}
            href={`#`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>,
      );
      prevPage = page;
    }
  }

  return (
    <Pagination className={cn("my-3 justify-end", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            href={`#`}
          />
        </PaginationItem>

        {pages}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < total && setCurrentPage(currentPage + 1)
            }
            href={`#`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
