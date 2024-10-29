"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { vscodeTheme } from "@uiw/react-json-view/vscode";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BlurImage from "@/components/shared/blur-image";

export interface MetaScrapingProps {
  title: string;
  description: string;
  image: string;
  icon: string;
  url: string;
  lang: string;
  author: string;
  timestamp: string;
  payload: string;
}

export default function MetaScraping({
  user,
}: {
  user: { id: string; apiKey: string };
}) {
  const { theme } = useTheme();
  const [currentLink, setCurrentLink] = useState("wr.do");
  const [protocol, setProtocol] = useState("https://");
  const [metaInfo, setMetaInfo] = useState<MetaScrapingProps>({
    payload: "",
    title: "",
    description: "",
    image: "",
    icon: "",
    url: "",
    lang: "",
    author: "",
    timestamp: "",
  });
  const [isScraping, setIsScraping] = useState(false);

  const [isShoting, setIsShoting] = useState(false);
  const [currentScreenshotLink, setCurrentScreenshotLink] =
    useState("vmail.dev");
  const [screenshotInfo, setScreenshotInfo] = useState({
    url: "",
    payload: "",
  });

  const handleScrapingMeta = async () => {
    if (currentLink) {
      setIsScraping(true);
      const res = await fetch(
        `/api/scraping/meta?url=${protocol}${currentLink}&key=${user.apiKey}`,
      );
      if (!res.ok || res.status !== 200) {
        toast.error(res.statusText || "Error");
      } else {
        const data = await res.json();
        setMetaInfo(data);
        toast.success("Success!");
      }
      setIsScraping(false);
    }
  };

  const handleScrapingScreenshot = async () => {
    if (currentScreenshotLink) {
      setIsShoting(true);
      const payload = `/api/scraping/screenshot?url=${protocol}${currentScreenshotLink}&key=${user.apiKey}`;
      const res = await fetch(payload);
      if (!res.ok || res.status !== 200) {
        toast.error(res.statusText);
      } else {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setScreenshotInfo({
          url: imageUrl,
          payload: `${window.location.origin}${payload}`,
        });
        toast.success("Success!");
      }
      setIsShoting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Screenshot</CardTitle>
          <CardDescription>
            Automate your website screenshots and turn them into stunning
            visuals for your applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Select
              onValueChange={(value: string) => {
                setProtocol(value);
              }}
              name="protocol"
              defaultValue="https://"
            >
              <SelectTrigger className="h-10 w-24 rounded-r-none shadow-inner">
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="https" value="https://">
                  https://
                </SelectItem>
                <SelectItem key="http" value="http://">
                  http://
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="www.example.com"
              className="h-10 rounded-none border focus:border-primary active:border-primary"
              value={currentScreenshotLink}
              size={100}
              onChange={(e) => setCurrentScreenshotLink(e.target.value)}
            />
            <Button
              variant="blue"
              onClick={handleScrapingScreenshot}
              disabled={isShoting}
              className="rounded-l-none"
            >
              {isShoting ? "Scraping..." : "Send"}
            </Button>
          </div>

          <div className="mt-4 rounded-md border p-3">
            <JsonView
              className="max-w-[400px] overflow-hidden"
              style={theme === "dark" ? vscodeTheme : githubLightTheme}
              value={screenshotInfo}
              displayObjectSize={false}
              displayDataTypes={false}
              // shortenTextAfterLength={50}
            />
            {screenshotInfo.url && (
              <BlurImage
                src={screenshotInfo.url}
                alt="ligth preview landing"
                className="my-4 flex rounded-md border object-contain object-center shadow-md dark:hidden"
                width={1500}
                height={750}
                priority
                // placeholder="blur"
              />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Website Meta Scrape</CardTitle>
          <CardDescription>Scrape the meta data of a website.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Select
              onValueChange={(value: string) => {
                setProtocol(value);
              }}
              name="protocol"
              defaultValue={"https://"}
            >
              <SelectTrigger className="h-10 w-24 rounded-r-none shadow-inner">
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="https" value="https://">
                  https://
                </SelectItem>
                <SelectItem key="http" value="http://">
                  http://
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="www.example.com"
              className="h-10 rounded-none border focus:border-primary active:border-primary"
              value={currentLink}
              size={100}
              onChange={(e) => setCurrentLink(e.target.value)}
            />
            <Button
              variant="blue"
              onClick={handleScrapingMeta}
              disabled={isScraping}
              className="rounded-l-none"
            >
              {isScraping ? "Scraping..." : "Send"}
            </Button>
          </div>

          <div className="mt-4 rounded-md border p-3">
            <JsonView
              style={theme === "dark" ? vscodeTheme : githubLightTheme}
              value={metaInfo}
              displayObjectSize={false}
              displayDataTypes={false}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
