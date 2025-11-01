import React from "react";
import { useTranslations } from "next-intl";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function PaginationWrapper({
  className,
  total,
  currentPage,
  setCurrentPage,
  pageSize = 20,
  setPageSize,
  layout = "split",
  size = "medium",
}: {
  className?: string;
  total: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  layout?: "center" | "left" | "right" | "split";
  size?: "small" | "medium" | "large";
}) {
  // Page size options
  const pageSizeOptions = [10, 15, 20, 50, 100];

  // Calculate total pages based on pageSize
  const totalPages = Math.ceil(total / pageSize);

  const t = useTranslations("List");

  const shouldShowPage = (page: number) => {
    return (
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2
    );
  };

  const shouldShowEllipsis = (page: number, prevPage: number | null) => {
    return prevPage && page - prevPage > 1;
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    if (setPageSize) {
      const newSize = parseInt(value);
      setPageSize(newSize);
      // Reset to first page on size change
      setCurrentPage(1);
    }
  };

  const pages: any = [];
  let prevPage: number | null = null;

  for (let page = 1; page <= totalPages; page++) {
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
            className={cn({
              "px-2 py-1 text-xs": size === "small",
              "px-3 py-1.5 text-sm": size === "medium",
              "px-4 py-2 text-base": size === "large",
            })}
          >
            {page}
          </PaginationLink>
        </PaginationItem>,
      );
      prevPage = page;
    }
  }

  // Determine container classes based on layout
  const getLayoutClasses = () => {
    switch (layout) {
      case "center":
        return "justify-center gap-4 flex-wrap";
      case "left":
        return "justify-start gap-4 flex-wrap";
      case "right":
        return "justify-end gap-4 flex-wrap";
      case "split":
      default:
        return "justify-between gap-4";
    }
  };

  // Determine size classes for text and elements
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-xs";
      case "large":
        return "text-base";
      case "medium":
      default:
        return "text-sm";
    }
  };

  // Determine select trigger width based on size
  const getSelectWidth = () => {
    switch (size) {
      case "small":
        return "w-[60px]";
      case "large":
        return "w-[80px]";
      case "medium":
      default:
        return "w-[70px]";
    }
  };

  return (
    <Pagination
      className={cn(
        "my-3 flex items-center",
        getLayoutClasses(),
        getSizeClasses(),
        className,
      )}
    >
      {setPageSize && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {t("Total")} {total} {t("items")},
          </span>
          <span className="text-muted-foreground">{t("Show")}</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger
              className={cn(getSelectWidth(), {
                "h-7": size === "small",
                "h-9": size === "medium",
                "h-10": size === "large",
              })}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span
            className={cn(
              "text-nowrap text-muted-foreground",
              "hidden sm:inline-block",
            )}
          >
            {t("per page")}
          </span>
        </div>
      )}
      <PaginationContent
        className={cn({
          "gap-1": size === "small",
          "gap-2": size === "medium",
          "gap-3": size === "large",
        })}
      >
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            href={`#`}
            className={cn(
              currentPage === 1 ? "pointer-events-none opacity-50" : "",
              {
                "px-2 py-1 text-xs": size === "small",
                "px-3 py-1.5 text-sm": size === "medium",
                "px-4 py-2 text-base": size === "large",
              },
            )}
          />
        </PaginationItem>

        {pages}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            href={`#`}
            className={cn(
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "",
              {
                "px-2 py-1 text-xs": size === "small",
                "px-3 py-1.5 text-sm": size === "medium",
                "px-4 py-2 text-base": size === "large",
              },
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
