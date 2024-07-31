import { Pagination } from "@nextui-org/pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "./button";

export function PaginationWrapper({
  total,
  currentPage,
  setCurrentPage,
}: {
  total: number;
  currentPage: number;
  setCurrentPage: any;
}) {
  return (
    <div className="my-3 flex items-center justify-end gap-3">
      <Button
        size="sm"
        variant="outline"
        color="secondary"
        onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
      >
        <ArrowLeft className="size-4" />
      </Button>
      <Pagination
        isCompact
        total={total}
        color="success"
        page={currentPage}
        onChange={setCurrentPage}
      />
      <Button
        size="sm"
        variant="outline"
        color="secondary"
        onClick={() => setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev))}
      >
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
