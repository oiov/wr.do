"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem, SidebarNavItem } from "@/types";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import pkg from "package.json";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/shared/icons";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const t = useTranslations("System");
  const path = usePathname();

  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);
  const [openCollapsibles, setOpenCollapsibles] = useState<Set<string>>(
    new Set(),
  );

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleCollapsible = (itemTitle: string) => {
    setOpenCollapsibles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemTitle)) {
        newSet.delete(itemTitle);
      } else {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  // Auto-open collapsibles that contain the current path
  useEffect(() => {
    links.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items) {
          const hasActivePath = item.items.some(
            (subItem) => subItem.href === path,
          );
          if (hasActivePath) {
            setOpenCollapsibles((prev) => new Set(prev).add(item.title));
          }
        }
      });
    });
  }, [path, links]);

  const renderNavItem = (item: NavItem, isNested = false) => {
    const Icon = Icons[item.icon ?? "arrowLeft"];
    const hasSubItems = item.items && item.items.length > 0;
    const isOpen = openCollapsibles.has(item.title);

    // Item with sub-items (collapsible)
    if (hasSubItems) {
      return (
        <Fragment key={`nav-item-${item.title}`}>
          {isSidebarExpanded ? (
            <Collapsible
              open={isOpen}
              onOpenChange={() => toggleCollapsible(item.title)}
            >
              <CollapsibleTrigger
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted",
                  "text-muted-foreground hover:text-accent-foreground",
                  item.disabled &&
                    "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                  item.icon ? "gap-3" : "pl-6",
                )}
              >
                <Icon className={item.icon ? "size-5" : "hidden"} />
                {t(item.title)}
                <Icons.chevronDown
                  className={cn(
                    "ml-auto size-4 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 pt-1">
                <div className="flex flex-col gap-0.5">
                  {item.items!.map((subItem) => renderNavItem(subItem, true))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Tooltip key={`tooltip-${item.title}`}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-muted",
                    "text-muted-foreground hover:text-accent-foreground",
                    item.disabled &&
                      "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                  )}
                >
                  <span className="flex size-full items-center justify-center">
                    <Icon className="size-5" />
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex flex-col gap-2">
                  {item.items!.map((subItem) =>
                    subItem.disabled ? (
                      <span className="cursor-pointer text-muted-foreground">
                        {t(subItem.title)}
                      </span>
                    ) : (
                      <Link
                        key={subItem.title}
                        href={subItem.href || "#"}
                        className="hover:underline"
                      >
                        {t(subItem.title)}
                      </Link>
                    ),
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </Fragment>
      );
    }

    // Regular link item
    if (item.href) {
      return (
        <Fragment key={`link-fragment-${item.title}`}>
          {isSidebarExpanded ? (
            <Link
              key={`link-${item.title}`}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center rounded-md text-sm hover:bg-muted",
                path === item.href
                  ? "bg-muted"
                  : "text-muted-foreground hover:text-accent-foreground",
                item.disabled &&
                  "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                isNested ? "py-1" : "gap-3 p-2 font-medium",
              )}
            >
              <Icon className={item.icon ? "size-5" : "opacity-0"} />
              {t(item.title)}
              {item.badge && (
                <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ) : (
            <Tooltip key={`tooltip-${item.title}`}>
              <TooltipTrigger asChild>
                <Link
                  key={`link-tooltip-${item.title}`}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-muted",
                    path === item.href
                      ? "bg-muted"
                      : "text-muted-foreground hover:text-accent-foreground",
                    item.disabled &&
                      "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                  )}
                >
                  <span className="flex size-full items-center justify-center">
                    <Icon className="size-5" />
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{t(item.title)}</TooltipContent>
            </Tooltip>
          )}
        </Fragment>
      );
    }

    return null;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 z-[40] h-full">
        <ScrollArea className="h-full overflow-y-auto border-r">
          <aside
            className={cn(
              isSidebarExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]",
              "hidden h-screen transition-all duration-200 md:block",
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center gap-2 p-4 lg:h-[60px]">
                {isSidebarExpanded && (
                  <>
                    <Icons.logo />
                    <Link
                      href="/"
                      style={{ fontFamily: "Bahamas Bold" }}
                      className="text-2xl font-bold"
                    >
                      {siteConfig.name}
                    </Link>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-9 lg:size-8"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  ) : (
                    <PanelRightClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links.map(
                  (section) =>
                    section.items.length > 0 && (
                      <section
                        key={section.title}
                        className="flex flex-col gap-0.5"
                      >
                        {isSidebarExpanded ? (
                          <p className="text-xs text-muted-foreground">
                            {t(section.title)}
                          </p>
                        ) : (
                          <div className="h-4" />
                        )}
                        {section.items.map((item) => renderNavItem(item))}
                      </section>
                    ),
                )}
              </nav>

              {isSidebarExpanded && (
                <div
                  className="mx-3 mt-auto flex items-center gap-1 pb-3 pt-6 text-xs text-muted-foreground/90"
                  style={{ fontFamily: "Bahamas Bold" }}
                >
                  Copyright {new Date().getFullYear()} &copy;
                  <Link
                    href={siteConfig.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {siteConfig.name}
                  </Link>
                  <Link
                    href={`${siteConfig.links.github}/releases/latest`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-thin underline-offset-2 hover:underline"
                  >
                    v{pkg.version}
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [openCollapsibles, setOpenCollapsibles] = useState<Set<string>>(
    new Set(),
  );
  const { isSm, isMobile } = useMediaQuery();
  const t = useTranslations("System");

  const toggleCollapsible = (itemTitle: string) => {
    setOpenCollapsibles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemTitle)) {
        newSet.delete(itemTitle);
      } else {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  };

  // Auto-open collapsibles that contain the current path
  useEffect(() => {
    links.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items) {
          const hasActivePath = item.items.some(
            (subItem) => subItem.href === path,
          );
          if (hasActivePath) {
            setOpenCollapsibles((prev) => new Set(prev).add(item.title));
          }
        }
      });
    });
  }, [path, links]);

  const renderMobileNavItem = (item: NavItem, isNested = false) => {
    const Icon = Icons[item.icon ?? "arrowLeft"];
    const hasSubItems = item.items && item.items.length > 0;
    const isOpen = openCollapsibles.has(item.title);

    // Item with sub-items (collapsible)
    if (hasSubItems) {
      return (
        <Collapsible
          key={`nav-item-${item.title}`}
          open={isOpen}
          onOpenChange={() => toggleCollapsible(item.title)}
        >
          <CollapsibleTrigger
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted",
              "text-muted-foreground hover:text-accent-foreground",
              item.disabled &&
                "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
              item.icon ? "gap-3" : "pl-6",
            )}
          >
            <Icon className={item.icon ? "size-5" : "hidden"} />
            {t(item.title)}
            <Icons.chevronDown
              className={cn(
                "ml-auto size-4 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-1">
            <div className="flex flex-col gap-0.5">
              {item.items!.map((subItem) => renderMobileNavItem(subItem, true))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Regular link item
    if (item.href) {
      return (
        <Fragment key={`link-fragment-${item.title}`}>
          <Link
            key={`link-${item.title}`}
            onClick={() => {
              if (!item.disabled) setOpen(false);
            }}
            href={item.disabled ? "#" : item.href}
            className={cn(
              "flex items-center rounded-md text-sm hover:bg-muted",
              path === item.href
                ? "bg-muted"
                : "text-muted-foreground hover:text-accent-foreground",
              item.disabled &&
                "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
              isNested ? "py-1.5" : "gap-3 p-2 font-medium",
            )}
          >
            <Icon className={item.icon ? "size-5" : "opacity-0"} />
            {t(item.title)}
            {item.badge && (
              <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                {item.badge}
              </Badge>
            )}
          </Link>
        </Fragment>
      );
    }

    return null;
  };

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Image src="/favicon.ico" alt="logo" width={20} height={20} />
                  <span
                    style={{ fontFamily: "Bahamas Bold" }}
                    className="pt-0.5 text-xl font-bold"
                  >
                    {siteConfig.name}
                  </span>
                </Link>

                {links.map(
                  (section) =>
                    section.items.length > 0 && (
                      <section
                        key={section.title}
                        className="flex flex-col gap-0.5"
                      >
                        <p className="text-xs text-muted-foreground">
                          {t(section.title)}
                        </p>

                        {section.items.map((item) => renderMobileNavItem(item))}
                      </section>
                    ),
                )}

                <div
                  className="mx-3 mt-auto flex items-center gap-1 pb-3 pt-6 font-mono text-xs text-muted-foreground/90"
                  style={{ fontFamily: "Bahamas Bold" }}
                >
                  Copyright {new Date().getFullYear()} &copy;
                  <Link
                    href={siteConfig.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {siteConfig.name}
                  </Link>
                  <Link
                    href={`${siteConfig.links.github}/releases/latest`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-thin underline-offset-2 hover:underline"
                  >
                    v{pkg.version}
                  </Link>
                </div>
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}
