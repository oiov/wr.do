"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import EmailList from "@/components/email/EmailList";
import EmailSidebar from "@/components/email/EmailSidebar";

export function EmailDashboard({ user }: { user: User }) {
  const [selectedEmailAddress, setSelectedEmailAddress] = useState<
    string | null
  >(null);
  const { isMobile } = useMediaQuery();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdminModel, setAdminModel] = useState(false);

  useEffect(() => {
    if (isMobile && selectedEmailAddress) {
      setIsCollapsed(true);
    }
  }, [isMobile, selectedEmailAddress]);

  return (
    <div className="flex h-[calc(100vh-60px)] w-full">
      <EmailSidebar
        className={cn(
          !isCollapsed ? "w-64 xl:w-72" : "w-16",
          isMobile && !isCollapsed ? "w-screen" : "",
        )}
        user={user}
        onSelectEmail={setSelectedEmailAddress}
        selectedEmailAddress={selectedEmailAddress}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isAdminModel={isAdminModel}
        setAdminModel={setAdminModel}
      />
      <EmailList
        className="flex-1"
        emailAddress={selectedEmailAddress}
        selectedEmailId={selectedEmailId}
        onSelectEmail={setSelectedEmailId}
        isAdminModel={isAdminModel}
      />
    </div>
  );
}
