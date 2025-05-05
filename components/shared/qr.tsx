"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

import { WRDO_QR_LOGO } from "@/lib/qr/constants";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import BlurImage from "./blur-image";
import { Icons } from "./icons";

export default function QRCodeEditor({
  user,
  url,
}: {
  user: { id: string; apiKey: string };
  url: string;
}) {
  const [params, setParams] = useState({
    key: user.apiKey,
    url,
    logo: "",
    size: 600,
    level: "L",
    fgColor: "#d1ffb5",
    bgColor: "#000000",
    margin: 2,
    hideLogo: false,
  });

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQrCodeUrl = () => {
    const queryParams = new URLSearchParams({
      key: params.key,
      url: params.url,
      size: params.size.toString(),
      level: params.level,
      fgColor: params.fgColor,
      bgColor: params.bgColor,
      margin: params.margin.toString(),
      hideLogo: params.hideLogo.toString(),
    });

    if (params.logo) {
      queryParams.set("logo", params.logo);
    }

    return `/api/v1/scraping/qrcode?${queryParams.toString()}`;
  };

  useEffect(() => {
    setQrCodeUrl(generateQrCodeUrl());
  }, [params]);

  const handleColorChange = (color: string, type: "fgColor" | "bgColor") => {
    setParams((prev) => ({ ...prev, [type]: color }));
  };

  const handleToggleLogo = (v: boolean) => {
    setParams((prev) => ({ ...prev, hideLogo: !v }));
  };

  const handleDownloadQrCode = () => {
    const link = document.createElement("a");
    link.download = `qr-${params.url}.png`;
    link.href = qrCodeUrl;
    link.click();
  };
  const handleCopyQrCode = () => {
    navigator.clipboard.writeText(`https://wr.do${qrCodeUrl}`);
    toast.success("Copied to clipboard");
  };

  const colorOptions = [
    "#000000", // Black
    "#c73e33", // Red-orange
    "#df6547", // Light orange
    "#f4b3d7", // Pink
    "#f6cf54", // Light yellow
    "#49a065", // Green
    "#2146b7", // Blue
    "#ae49bf", // Purple
    "#ffffff",
  ];

  return (
    <div className="relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-900">
      <h2 className="mb-4 text-lg font-semibold">QR Code Design</h2>

      {/* QR Code Preview */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            QR Code Preview
          </h3>
          <Button
            onClick={() => {
              handleDownloadQrCode();
            }}
            className="ml-auto h-8 px-2 py-1"
            size="sm"
            variant={"ghost"}
          >
            <Icons.download className="size-4" />
          </Button>
          <Button
            onClick={() => {
              handleCopyQrCode();
            }}
            className="h-8 px-2 py-1"
            size="sm"
            variant={"ghost"}
          >
            <Icons.copy className="size-4" />
          </Button>
        </div>
        <div className="relative mt-2 flex h-40 items-center justify-center overflow-hidden rounded-md border border-gray-300">
          <div className="absolute inset-0 h-full w-full bg-neutral-50/60 bg-[radial-gradient(#d7d9dd_1px,transparent_1px)] [background-size:8px_9px]"></div>
          <div
            className="flex size-full items-center justify-center"
            style={{ filter: "blur(0px)", opacity: 1, willChange: "auto" }}
          >
            <Suspense
              fallback={<Skeleton className="h-32 w-32 rounded shadow" />}
            >
              {qrCodeUrl && (
                <BlurImage
                  src={qrCodeUrl}
                  alt="QR Code Preview"
                  width={128}
                  height={128}
                  className="h-auto max-w-full rounded"
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-nowrap text-sm font-semibold text-neutral-600 dark:text-neutral-300">
          Url
        </h3>

        <Input
          className="ml-auto w-[60%]"
          type="text"
          placeholder="https://example.com"
          defaultValue={params.url}
          onChange={(e) => {
            setParams((prev) => ({ ...prev, url: e.target.value }));
          }}
        />
      </div>

      <div className="mb-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            Logo
          </h3>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Icons.help className="ml-1 size-4 text-neutral-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-64 text-left">
                Display your logo in the center of the QR code.{" "}
                <Link
                  className="border-b text-neutral-500"
                  href="/docs/open-api/qrcode"
                  target="_blank"
                >
                  Learn more
                </Link>
                .
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Switch
            className="ml-auto"
            defaultChecked={!params.hideLogo}
            onCheckedChange={(v) => handleToggleLogo(v)}
          />
        </div>
        <details>
          <summary className="flex w-full cursor-pointer items-center justify-between">
            <h3 className="text-nowrap text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              Custom Logo
            </h3>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Icons.help className="ml-1 size-4 text-neutral-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-64 text-left">
                  Customize your QR code logo.{" "}
                  <Link
                    className="border-b text-neutral-500"
                    href="/docs/open-api/qrcode"
                    target="_blank"
                  >
                    Learn more
                  </Link>
                  .
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Icons.chevronDown className="ml-auto size-4" />
          </summary>
          <Input
            className="mt-2"
            type="text"
            placeholder="https://example.com/logo.png"
            disabled={params.hideLogo}
            defaultValue={WRDO_QR_LOGO}
            onChange={(e) => {
              setParams((prev) => ({ ...prev, logo: e.target.value }));
            }}
          />
        </details>
      </div>

      <details className="mb-3" open={true}>
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <h3 className="text-nowrap text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            Front Color
          </h3>
          <Icons.chevronDown className="ml-auto size-4" />
        </summary>
        <div className="mt-2 flex items-start space-x-4">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div className="relative flex h-8 w-32 shrink-0 rounded-md shadow-sm">
                  <div
                    className="h-full w-10 rounded-l-md border"
                    data-state="closed"
                    style={{
                      backgroundColor: params.fgColor,
                      borderColor: params.fgColor,
                    }}
                  ></div>
                  <input
                    id="color"
                    className="block w-full rounded-r-md border-2 border-l-0 pl-3 text-neutral-900 placeholder-gray-400 focus:outline-none focus:ring-black dark:text-neutral-300 sm:text-sm"
                    spellCheck="false"
                    defaultValue={params.fgColor}
                    name="color"
                    style={{ borderColor: params.fgColor }}
                    onChange={(e) =>
                      handleColorChange(e.target.value, "fgColor")
                    }
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-3">
                <HexColorPicker
                  color={params.fgColor}
                  onChange={(color) => handleColorChange(color, "fgColor")}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-wrap items-center justify-start gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                className="size-[30px] rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color, "fgColor")}
              />
            ))}
          </div>
        </div>
      </details>

      <details>
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <h3 className="text-nowrap text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            Background Color
          </h3>
          <Icons.chevronDown className="ml-auto size-4" />
        </summary>
        <div className="my-2 flex items-start space-x-4">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div className="relative flex h-8 w-32 shrink-0 rounded-md shadow-sm">
                  <div
                    className="h-full w-10 rounded-l-md border"
                    data-state="closed"
                    style={{
                      backgroundColor: params.bgColor,
                      borderColor: params.bgColor,
                    }}
                  ></div>
                  <input
                    id="color"
                    className="block w-full rounded-r-md border-2 border-l-0 pl-3 text-neutral-900 placeholder-gray-400 focus:outline-none focus:ring-black dark:text-neutral-300 sm:text-sm"
                    spellCheck="false"
                    defaultValue={params.bgColor}
                    name="color"
                    style={{ borderColor: params.bgColor }}
                    onChange={(e) =>
                      handleColorChange(e.target.value, "bgColor")
                    }
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-3">
                <HexColorPicker
                  color={params.bgColor}
                  onChange={(color) => handleColorChange(color, "bgColor")}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-wrap items-center justify-start gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                className="size-[30px] rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color, "bgColor")}
              />
            ))}
          </div>
        </div>
      </details>

      {/* Mask */}
      {!user.apiKey && (
        <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2 bg-neutral-100/20 px-4 backdrop-blur">
          <p className="text-center text-sm">
            Please create a <strong>api key</strong> before use this feature.{" "}
            <br /> Learn more about{" "}
            <Link
              className="py-1 text-blue-600 hover:text-blue-400 hover:underline dark:hover:text-primary-foreground"
              href={"/docs/open-api#api-key"}
              target="_blank"
            >
              api key
            </Link>
            .
          </p>

          <Link href={"/dashboard/settings"}>
            <Button>Create Api Key</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
