"use client";

import { useState } from "react";
import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { vscodeTheme } from "@uiw/react-json-view/vscode";
import { useTranslations } from "next-intl";
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

export interface MarkdownScrapingProps {
  url: string;
  content: string;
  format: string;
  timestamp: string;
  payload: string;
}

export function ScreenshotScraping({
  user,
}: {
  user: { id: string; apiKey: string };
}) {
  const t = useTranslations("Scrape");
  const { theme } = useTheme();
  const [protocol, setProtocol] = useState("https://");

  const [isShoting, setIsShoting] = useState(false);
  const [currentScreenshotLink, setCurrentScreenshotLink] =
    useState("vmail.dev");
  const [screenshotInfo, setScreenshotInfo] = useState({
    tmp_url: "",
    payload: "",
  });

  const handleScrapingScreenshot = async () => {
    if (currentScreenshotLink) {
      setIsShoting(true);
      const payload = `/api/v1/scraping/screenshot?url=${protocol}${currentScreenshotLink}&key=${user.apiKey}`;
      const res = await fetch(payload);
      if (!res.ok || res.status !== 200) {
        const data = await res.json();
        toast.error(data.statusText);
      } else {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setScreenshotInfo({
          tmp_url: imageUrl,
          payload: `${window.location.origin}${payload}`,
        });
        toast.success("Success!");
      }
      setIsShoting(false);
    }
  };

  return (
    <>
      <CodeLight content={`https://wr.do/api/v1/scraping/screenshot`} />
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>{t("Playground")}</CardTitle>
          <CardDescription>
            {t(
              "Automate your website screenshots and turn them into stunning visuals for your applications",
            )}
            .
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
              <SelectTrigger className="h-10 w-24 rounded-r-none bg-transparent shadow-inner">
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
              className="w-28 rounded-l-none"
            >
              {isShoting ? t("Scraping") : t("Start")}
            </Button>
          </div>

          <div className="mt-4 rounded-md border p-3">
            <JsonView
              className="max-w-2xl overflow-auto p-2"
              style={theme === "dark" ? vscodeTheme : githubLightTheme}
              value={screenshotInfo}
              displayObjectSize={false}
              displayDataTypes={false}
              // shortenTextAfterLength={50}
            />
            {screenshotInfo.tmp_url && (
              <BlurImage
                src={screenshotInfo.tmp_url}
                alt="ligth preview landing"
                className="my-4 flex rounded-md border object-contain object-center shadow-md"
                width={1500}
                height={750}
                priority
                // placeholder="blur"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function MetaScraping({
  user,
}: {
  user: { id: string; apiKey: string };
}) {
  const t = useTranslations("Scrape");
  const { theme } = useTheme();
  const [currentLink, setCurrentLink] = useState("wr.do");
  const [protocol, setProtocol] = useState("https://");
  const [metaInfo, setMetaInfo] = useState<MetaScrapingProps>({
    title: "",
    description: "",
    image: "",
    icon: "",
    url: "",
    lang: "",
    author: "",
    timestamp: "",
    payload: "",
  });
  const [isScraping, setIsScraping] = useState(false);

  const handleScrapingMeta = async () => {
    if (currentLink) {
      setIsScraping(true);
      const res = await fetch(
        `/api/v1/scraping/meta?url=${protocol}${currentLink}&key=${user.apiKey}`,
      );
      if (!res.ok || res.status !== 200) {
        const data = await res.json();
        toast.error(data.statusText);
      } else {
        const data = await res.json();
        setMetaInfo(data);
        toast.success("Success!");
      }
      setIsScraping(false);
    }
  };

  return (
    <>
      <CodeLight content={`https://wr.do/api/v1/scraping/meta`} />
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>{t("Playground")}</CardTitle>
          <CardDescription>
            {t("Scrape the meta data of a website")}.
          </CardDescription>
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
              <SelectTrigger className="h-10 w-24 rounded-r-none bg-transparent shadow-inner">
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
              className="w-28 rounded-l-none"
            >
              {isScraping ? t("Scraping") : t("Start")}
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

export function MarkdownScraping({
  user,
}: {
  user: { id: string; apiKey: string };
}) {
  const t = useTranslations("Scrape");
  const { theme } = useTheme();
  const [currentLink, setCurrentLink] = useState("wr.do");
  const [protocol, setProtocol] = useState("https://");
  const [metaInfo, setMetaInfo] = useState<MarkdownScrapingProps>({
    url: "",
    content: "",
    format: "",
    timestamp: "",
    payload: "",
  });
  const [isScraping, setIsScraping] = useState(false);

  const handleScrapingMeta = async () => {
    if (currentLink) {
      setIsScraping(true);
      const res = await fetch(
        `/api/v1/scraping/markdown?url=${protocol}${currentLink}&key=${user.apiKey}`,
      );
      if (!res.ok || res.status !== 200) {
        const data = await res.json();
        toast.error(data.statusText);
      } else {
        const data = await res.json();
        setMetaInfo(data);
        toast.success("Success!");
      }
      setIsScraping(false);
    }
  };

  return (
    <>
      <CodeLight content={`https://wr.do/api/v1/scraping/markdown`} />
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Markdown</CardTitle>
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
              <SelectTrigger className="h-10 w-24 rounded-r-none bg-transparent shadow-inner">
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
              className="w-28 rounded-l-none"
            >
              {isScraping ? t("Scraping") : t("Start")}
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

export function TextScraping({
  user,
}: {
  user: { id: string; apiKey: string };
}) {
  const t = useTranslations("Scrape");
  const { theme } = useTheme();
  const [currentLink, setCurrentLink] = useState("wr.do");
  const [protocol, setProtocol] = useState("https://");
  const [metaInfo, setMetaInfo] = useState<MarkdownScrapingProps>({
    url: "",
    content: "",
    format: "",
    timestamp: "",
    payload: "",
  });
  const [isScraping, setIsScraping] = useState(false);

  const handleScrapingMeta = async () => {
    if (currentLink) {
      setIsScraping(true);
      const res = await fetch(
        `/api/v1/scraping/text?url=${protocol}${currentLink}&key=${user.apiKey}`,
      );
      if (!res.ok || res.status !== 200) {
        const data = await res.json();
        toast.error(data.statusText);
      } else {
        const data = await res.json();
        setMetaInfo(data);
        toast.success("Success!");
      }
      setIsScraping(false);
    }
  };

  return (
    <>
      <CodeLight content={`https://wr.do/api/v1/scraping/text`} />
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>{t("Text")}</CardTitle>
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
              <SelectTrigger className="h-10 w-24 rounded-r-none bg-transparent shadow-inner">
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
              className="w-28 rounded-l-none"
            >
              {isScraping ? t("Scraping") : t("Start")}
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

export function QrCodeScraping({
  user,
}: {
  user: { id: string; apiKey: string };
}) {
  const t = useTranslations("Scrape");
  const { theme } = useTheme();
  const [protocol, setProtocol] = useState("https://");

  const [isShoting, setIsShoting] = useState(false);
  const [currentScreenshotLink, setCurrentScreenshotLink] =
    useState("vmail.dev");
  const [qrInfo, setQrInfo] = useState({
    // tmp_url: "",
    payload: "",
  });

  const handleScrapingScreenshot = async () => {
    if (currentScreenshotLink) {
      setIsShoting(true);
      const payload = `/api/v1/scraping/qrcode?url=${protocol}${currentScreenshotLink}&key=${user.apiKey}`;
      const res = await fetch(payload);
      if (!res.ok || res.status !== 200) {
        toast.error(res.statusText);
      } else {
        setQrInfo({
          payload: `${window.location.origin}${payload}`,
        });
        toast.success("Success!");
      }
      setIsShoting(false);
    }
  };

  return (
    <>
      <CodeLight content={`https://wr.do/api/v1/scraping/qrcode`} />
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>{t("Playground")}</CardTitle>
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
              <SelectTrigger className="h-10 w-24 rounded-r-none bg-transparent shadow-inner">
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
              className="max-w-2xl overflow-auto p-2"
              style={theme === "dark" ? vscodeTheme : githubLightTheme}
              value={qrInfo}
              displayObjectSize={false}
              displayDataTypes={false}
              // shortenTextAfterLength={50}
            />
            {qrInfo.payload && (
              <BlurImage
                src={qrInfo.payload}
                alt="ligth preview landing"
                className="my-4 flex rounded-md border object-contain object-center shadow-md"
                width={150}
                height={150}
                priority
                // placeholder="blur"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export const CodeLight = ({ content }: { content: string }) => {
  const code = content.trim();

  return (
    <div className="mx-auto w-full">
      <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100">
        <code className="block font-mono text-sm">
          {code.split("\n").map((line, i) => (
            <div key={i} className="group relative">
              {/* Line number */}
              <span className="inline-block w-8 select-none text-gray-500">
                {i + 1}
              </span>
              {/* Code content */}
              <span className="text-blue-400">
                {line
                  .replace(
                    /function/,
                    (match) => `<span class="text-purple-400">${match}</span>`,
                  )
                  .replace(
                    /"[^"]*"/,
                    (match) => `<span class="text-green-400">${match}</span>`,
                  )
                  .replace(
                    /console/,
                    (match) => `<span class="text-yellow-400">${match}</span>`,
                  )}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};
