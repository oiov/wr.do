import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import BlurImage, { BlurImg } from "@/components/shared/blur-image";

export default function XihanLoading() {
  return (
    <div className="flex h-screen w-screen animate-fade-in flex-col items-center justify-center">
      <BlurImage
        className="size-16"
        src="/_static/lover-c.png"
        alt="lover"
        width={64}
        height={64}
      />
      <p className="mt-3 font-semibold text-slate-500">熙菡你...</p>
    </div>
  );
}
