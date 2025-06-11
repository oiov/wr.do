"use client";

import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { PlanQuotaFormData } from "@/lib/dto/plan";
import { cn, fetcher, nFormatter } from "@/lib/utils";

import { Icons } from "../shared/icons";
import { Button } from "../ui/button";

const getBenefits = (plan: PlanQuotaFormData) => [
  {
    text: `${nFormatter(plan.slTrackedClicks)} tracked clicks/mo`,
    checked: true,
    icon: <Icons.mousePointerClick className="size-4" />,
  },
  {
    text: `${nFormatter(plan.slNewLinks)} new links/mo`,
    checked: true,
    icon: <Icons.link className="size-4" />,
  },
  {
    text: `${plan.slAnalyticsRetention}-day analytics retention`,
    checked: true,
    icon: <Icons.calendar className="size-4" />,
  },
  {
    text: `Customize short link QR code`,
    checked: plan.slCustomQrCodeLogo,
    icon: <Icons.qrcode className="size-4" />,
  },
  {
    text: `${nFormatter(plan.emEmailAddresses)} email addresses/mo`,
    checked: true,
    icon: <Icons.mail className="size-4" />,
  },
  {
    text: `${nFormatter(plan.emSendEmails)} send emails/mo`,
    checked: true,
    icon: <Icons.send className="size-4" />,
  },
  {
    text: `${plan.slDomains === 1 ? "One" : plan.slDomains} domain${plan.slDomains > 1 ? "s" : ""}`,
    checked: true,
    icon: <Icons.globe className="size-4" />,
  },
  {
    text: "Advanced analytics",
    checked: plan.slAdvancedAnalytics,
    icon: <Icons.lineChart className="size-4" />,
  },
  {
    text: `${plan.appSupport.charAt(0).toUpperCase() + plan.appSupport.slice(1)} support`,
    checked: true,
    icon: <Icons.help className="size-4" />,
  },
  {
    text: "Open API Access",
    checked: plan.appApiAccess,
    icon: <Icons.unplug className="size-4" />,
  },
];

export const PricingSection = () => {
  const t = useTranslations("Landing");
  const { data: plan } = useSWR<{
    total: number;
    list: PlanQuotaFormData[];
  }>(`/api/plan?all=1`, fetcher);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-zinc-50 text-zinc-800 selection:bg-zinc-200 dark:bg-zinc-950 dark:text-zinc-200 dark:selection:bg-zinc-600"
    >
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,rgba(245,245,245,0.8),rgba(240,240,240,1))] dark:bg-[radial-gradient(100%_100%_at_50%_0%,rgba(13,13,17,1),rgba(9,9,11,1))]"></div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:px-8">
        <div className="mb-12 space-y-3">
          <h2 className="text-center text-xl font-semibold leading-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight">
            {t("pricingTitle")}
          </h2>
          <p className="text-center text-base text-zinc-600 dark:text-zinc-400 md:text-lg">
            {t("pricingDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {plan && (
            <PriceCard
              tier={t("freeTier")}
              price={t("freePrice")}
              bestFor={t("freeBestFor")}
              CTA={
                <Link href={"/dashboard"}>
                  <Button className="w-full" variant={"default"}>
                    {t("getStartedFree")}
                  </Button>
                </Link>
              }
              benefits={getBenefits(plan.list[0])}
            />
          )}
          {plan && (
            <PriceCard
              tier={t("enterpriseTier")}
              price={t("enterprisePrice")}
              bestFor={t("enterpriseBestFor")}
              CTA={
                <Link href={"mailto:support@wr.do"}>
                  <Button className="w-full" variant="outline">
                    {t("contactUs")}
                  </Button>
                </Link>
              }
              benefits={getBenefits(plan.list[plan.list.length - 1])}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const PriceCard = ({ tier, price, bestFor, CTA, benefits }: PriceCardProps) => {
  return (
    <Card>
      <div className="flex flex-col items-center border-b border-zinc-200 pb-6 dark:border-zinc-700">
        <span className="mb-6 inline-block text-zinc-800 dark:text-zinc-50">
          {tier}
        </span>
        <span className="mb-3 inline-block text-4xl font-medium text-zinc-900 dark:text-zinc-100">
          {price}
        </span>
        <span className="bg-gradient-to-br from-zinc-700 to-zinc-900 bg-clip-text text-center text-transparent dark:from-zinc-200 dark:to-zinc-500">
          {bestFor}
        </span>
      </div>

      <div className="space-y-3 py-9">
        {benefits.map((b, i) => (
          <Benefit {...b} key={i} />
        ))}
      </div>

      {CTA}
    </Card>
  );
};

const Benefit = ({ text, checked, icon }: BenefitType) => {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <span className="grid size-5 place-content-center">{icon}</span>
      ) : (
        <span className="grid size-5 place-content-center rounded-full bg-zinc-200 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          <X className="h-3 w-3" />
        </span>
      )}
      <span className="text-sm text-neutral-600 dark:text-zinc-300">
        {text}
      </span>
    </div>
  );
};

const Card = ({ className, children, style = {} }: CardProps) => {
  return (
    <motion.div
      initial={{
        filter: "blur(2px)",
      }}
      whileInView={{
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.25,
      }}
      style={style}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50/50 to-zinc-100/80 p-6 dark:border-zinc-700 dark:from-zinc-950/50 dark:to-zinc-900/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

type PriceCardProps = {
  tier: string;
  price: string;
  bestFor: string;
  CTA: ReactNode;
  benefits: BenefitType[];
};

type CardProps = {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

type BenefitType = {
  text: string;
  checked: boolean;
  icon: ReactNode;
};
