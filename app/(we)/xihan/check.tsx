"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import BlurImage from "@/components/shared/blur-image";

export default function CheckEvent({
  event,
}: {
  event: { name: string; notes: string | null } | null;
}) {
  const router = useRouter();
  const [isChecking, setChecking] = useState(false);

  const handleCheck = async (answer: string) => {
    setChecking(true);
    const res = await fetch(`/api/xihan/check`, {
      method: "POST",
      body: JSON.stringify({
        name: event?.name,
        answer,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data === 202) {
        toast.info("正在开启我们的故事...");
        router.push("/xihan/home");
      } else if (data === 401) {
        toast.error("答案错误");
      }
    }

    setChecking(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-start p-4 xl:px-8">
      <h1 className="my-4 font-sans text-xl font-semibold">{event?.name}</h1>

      {event?.notes && (
        <div className="flex w-full animate-fade-in flex-col gap-4">
          {event.notes.split(",").map((ans, index) => (
            <Button
              key={index}
              className="justify-start rounded-lg border px-4 py-3"
              onClick={() => handleCheck(ans)}
              variant="ghost"
              disabled={isChecking}
            >
              <span>{String.fromCharCode(65 + index)}.&nbsp;</span>
              {ans}
            </Button>
          ))}
        </div>
      )}

      <BlurImage
        className={
          "mx-auto mb-16 mt-auto size-12 " + (isChecking ? "animate-pulse" : "")
        }
        src="/_static/lover.png"
        alt="lover"
        width={48}
        height={48}
      />
    </div>
  );
}
