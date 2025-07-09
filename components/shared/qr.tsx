"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import { HexColorPicker } from "react-colorful";

import { getQRAsCanvas, getQRAsSVGDataUri, getQRData } from "@/lib/qr";
import { WRDO_QR_LOGO } from "@/lib/qr/constants";
import { extractHost } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
import { CopyButton } from "./copy-button";
import { Icons } from "./icons";

export default function QRCodeEditor({
  user,
  url,
}: {
  user: { id: string; apiKey: string; team: string };
  url: string;
}) {
  const t = useTranslations("List");
  const [params, setParams] = useState({
    key: user.apiKey,
    url,
    logo: "",
    size: 600,
    level: "Q",
    fgColor: "#d1ffb5",
    bgColor: "#000000",
    margin: 2,
    hideLogo: false,
  });

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const anchorRef = useRef<HTMLAnchorElement>(null);

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

  const handleColorChange = useCallback(
    debounce((color: string, type: "fgColor" | "bgColor") => {
      setParams((prev) => ({ ...prev, [type]: color }));
    }, 300),
    [],
  );

  const handleToggleLogo = (v: boolean) => {
    setParams((prev) => ({ ...prev, hideLogo: !v }));
  };

  function download(url: string, extension: string) {
    if (!anchorRef.current) return;
    anchorRef.current.href = url;
    anchorRef.current.download = `${extractHost(params.url)}-qrcode.${extension}`;
    anchorRef.current.click();
  }

  const handleChangeUrl = useCallback(
    debounce((value) => {
      setParams((prev) => ({ ...prev, url: value }));
    }, 300),
    [],
  );
  const handleChangeLogo = useCallback(
    debounce((value) => {
      setParams((prev) => ({ ...prev, logo: value }));
    }, 300),
    [],
  );

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

  const qrData = useMemo(
    () =>
      url
        ? getQRData({
            url: params.url,
            bgColor: params.bgColor,
            fgColor: params.fgColor,
            logo: params.logo,
            size: params.size,
            level: params.level,
            margin: params.margin,
            hideLogo: params.hideLogo,
          })
        : null,
    [url, params],
  );

  return (
    <div className="relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-900">
      <h2 className="mb-4 text-lg font-semibold">{t("QR Code Design")}</h2>

      {/* QR Code Preview */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            {t("Preview")}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto px-2 py-2 hover:bg-accent hover:text-accent-foreground">
              <Icons.download className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                asChild
                onClick={async () => {
                  qrData && download(await getQRAsSVGDataUri(qrData), "svg");
                }}
              >
                <div className="flex items-center gap-2 text-neutral-500">
                  <Icons.media className="size-4" />
                  <span className="font-semibold">{t("Download SVG")}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                onClick={async () => {
                  qrData &&
                    download(
                      (await getQRAsCanvas(qrData, "image/png")) as string,
                      "png",
                    );
                }}
              >
                <div className="flex items-center gap-2 text-neutral-500">
                  <Icons.media className="size-4" />
                  <span className="font-semibold">{t("Download PNG")}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                onClick={async () => {
                  qrData &&
                    download(
                      (await getQRAsCanvas(qrData, "image/jpeg")) as string,
                      "jpg",
                    );
                }}
              >
                <div className="flex items-center gap-2 text-neutral-500">
                  <Icons.media className="size-4" />
                  <span className="font-semibold">{t("Download JPG")}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            className="hidden"
            download={`${params.url}-qrcode.svg`}
            ref={anchorRef}
          />

          <CopyButton value={`https://wr.do${qrCodeUrl}`}></CopyButton>
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

      <div className="group mb-3 flex items-center justify-between">
        <h3 className="text-nowrap text-sm font-semibold text-neutral-600 transition-all group-hover:ml-1 group-hover:font-bold dark:text-neutral-300">
          {t("Url")}
        </h3>
        <Input
          className="ml-auto w-3/5"
          type="text"
          placeholder="https://example.com"
          defaultValue={params.url}
          onChange={(e) => handleChangeUrl(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <div className="group mb-3 flex items-center justify-between">
          <h3 className="text-nowrap text-sm font-semibold text-neutral-600 transition-all group-hover:ml-1 group-hover:font-bold dark:text-neutral-300">
            {t("Logo")}
          </h3>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Icons.help className="ml-1 size-4 text-neutral-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-64 text-left">
                {t("Display your logo in the center of the QR code")}.{" "}
                <Link
                  className="border-b text-neutral-500"
                  href="/docs/open-api/qrcode"
                  target="_blank"
                >
                  {t("Learn more")}
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
        <details className="group">
          <summary className="flex w-full cursor-pointer items-center justify-between">
            <h3 className="text-nowrap text-sm font-semibold text-neutral-600 transition-all group-hover:ml-1 group-hover:font-bold dark:text-neutral-300">
              {t("Custom Logo")}
            </h3>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Badge
                    variant={"outline"}
                    className="ml-1 text-xs font-semibold"
                  >
                    <Icons.crown className="mr-1 size-3" />
                    Premium
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-64 text-left">
                  {t("Customize your QR code logo")}.{" "}
                  <Link
                    className="border-b text-neutral-500"
                    href="/docs/open-api/qrcode"
                    target="_blank"
                  >
                    {t("Learn more")}
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
            disabled={user.team === "free" || params.hideLogo}
            defaultValue={WRDO_QR_LOGO}
            onChange={(e) => handleChangeLogo(e.target.value)}
          />
        </details>
      </div>

      <details className="group mb-3">
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <h3 className="text-nowrap text-sm font-semibold text-neutral-600 transition-all group-hover:ml-1 group-hover:font-bold dark:text-neutral-300">
            {t("Front Color")}
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
                    className="block w-full rounded-r-md border-2 border-l-0 pl-3 text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-black dark:text-neutral-300 sm:text-sm"
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

      <details className="group" open={true}>
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <h3 className="text-nowrap text-sm font-semibold text-neutral-600 transition-all group-hover:ml-1 group-hover:font-bold dark:text-neutral-300">
            {t("Background Color")}
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
                    className="block w-full rounded-r-md border-2 border-l-0 pl-3 text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-black dark:text-neutral-300 sm:text-sm"
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

      {/* Api Key Mask */}
      {!user.apiKey && (
        <div className="absolute left-0 top-0 z-20 flex size-full flex-col items-center justify-center gap-2 bg-neutral-100/20 px-4 backdrop-blur">
          <p className="text-center text-sm">
            {t("Please create a api key before use this feature")}. <br />{" "}
            {t("Learn more about")}{" "}
            <Link
              className="py-1 text-blue-600 hover:text-blue-400 hover:underline dark:hover:text-primary-foreground"
              href={"/docs/open-api#api-key"}
              target="_blank"
            >
              Api key
            </Link>
            .
          </p>

          <Link href={"/dashboard/settings"}>
            <Button>{t("Create Api Key")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
