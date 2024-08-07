"use client";

import { useState } from "react";
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

export default function MetaScraping() {
  const { theme } = useTheme();
  const [currentLink, setCurrentLink] = useState("");
  const [protocol, setProtocol] = useState("https");
  const [metaInfo, setMetaInfo] = useState({
    title: "",
    description: "",
    image: "",
    icon: "",
    url: "",
    lang: "",
    author: "",
    publisher: "",
    timestamp: "",
  });
  const [isScraping, setIsScraping] = useState(false);

  const handleScraping = async () => {
    if (currentLink) {
      setIsScraping(true);
      const res = await fetch(
        `/api/scraping/meta?url=${protocol}://${currentLink}`,
      );
      if (!res.ok || res.status !== 200) {
        toast.error(res.statusText);
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
              defaultValue={"https"}
            >
              <SelectTrigger className="h-10 w-24 rounded-r-none shadow-inner">
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="https" value="https">
                  https
                </SelectItem>
                <SelectItem key="http" value="http">
                  http
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleScraping();
                }
              }}
            />
            <Button
              variant="blue"
              onClick={handleScraping}
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
