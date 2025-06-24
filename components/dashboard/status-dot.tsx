import { cn } from "@/lib/utils";

export default function StatusDot({
  status,
  color = "bg-green-500",
}: {
  status: number;
  color?: string;
}) {
  return (
    <div
      className={cn(
        "h-[9px] w-[9px] animate-pulse rounded-full",
        status === 1 ? color : "bg-yellow-500",
      )}
    />
  );
}
