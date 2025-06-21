"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import pkg from "package.json";

import { Button } from "../ui/button";

interface VersionNotifierProps {
  currentVersion?: string;
  githubRepo?: string;
  className?: string;
}

const VersionNotifier: React.FC<VersionNotifierProps> = ({
  currentVersion = pkg.version,
  githubRepo = "oiov/wr.do",
  className = "",
}) => {
  const [latestVersion, setLatestVersion] = useState<string>("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Setting");

  const compareVersions = (v1: string, v2: string): boolean => {
    const normalize = (v: string) => v.replace(/^v/, "").split(".").map(Number);
    const parts1 = normalize(v1);
    const parts2 = normalize(v2);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const a = parts1[i] || 0;
      const b = parts2[i] || 0;
      if (a > b) return true;
      if (a < b) return false;
    }
    return false;
  };

  const checkVersion = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${githubRepo}/releases/latest`,
      );
      if (response.ok) {
        const data = await response.json();
        setLatestVersion(data.tag_name);

        const hasUpdate = compareVersions(data.tag_name, currentVersion);
        const dismissed =
          localStorage.getItem(`dismissed-${data.tag_name}`) === "true";

        setShowUpdate(hasUpdate && !dismissed);
      }
    } catch (error) {
      console.error("Failed to check version:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissUpdate = () => {
    localStorage.setItem(`dismissed-${latestVersion}`, "true");
    setShowUpdate(false);
  };

  useEffect(() => {
    checkVersion();
    // 每小时检查一次
    const interval = setInterval(checkVersion, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Button
        onClick={checkVersion}
        disabled={isLoading}
        variant={"outline"}
        size={"sm"}
        className={`ml-auto flex items-center gap-2 text-xs ${className}`}
      >
        <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        {t("Check for updates")}
      </Button>
      {showUpdate && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="max-w-xs rounded-lg border bg-muted p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <div className="mr-6 flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  🎉 {t("New version available")}: {latestVersion}
                </span>
              </div>
              <Button
                onClick={() => setShowUpdate(false)}
                className="px-2 text-muted-foreground"
                title="Dismiss"
                variant={"ghost"}
                size={"sm"}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex space-x-3">
              <a
                href={`https://github.com/${githubRepo}/releases/latest`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {t("Update now")}
              </a>
              <Button onClick={dismissUpdate} variant={"outline"} size={"sm"}>
                {t("Dismiss")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VersionNotifier;
