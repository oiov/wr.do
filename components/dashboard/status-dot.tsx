import { cn } from "@/lib/utils";

export default function StatusDot({ status }: { status: number }) {
  return (
    <div
      className={cn(
        "h-[9px] w-[9px] rounded-full",
        status === 1 ? "bg-green-500" : "bg-yellow-500",
      )}
    />
  );
}
