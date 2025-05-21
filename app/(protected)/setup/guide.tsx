"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { siteConfig } from "@/config/site";
import { cn, removeUrlSuffix } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSectionColumns } from "@/components/dashboard/form-section-columns";
import { Icons } from "@/components/shared/icons";

export default function StepGuide({
  user,
}: {
  user: { id: string; email: string };
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Set up an administrator",
      description:
        "Begin by entering your website URL or selecting an example site to reimagine your website with modern themes.",
      component: () => <SetAdminRole id={user.id} email={user.email} />,
    },
    {
      id: 2,
      title: "Add the first domain",
      description:
        "Check out your reimagined site and click to Migrate & Download.",
      component: () => <AddDomain onNextStep={goToNextStep} />,
    },
    {
      id: 3,
      title: "Congrats on completing setup 🎉",
      description:
        "Navigate to your GitHub dashboard where you'll manage your repository and project files.",
      component: () => <Congrats />,
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
    } else if (currentStep === steps.length) {
      router.push("/admin");
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData =
    steps.find((step) => step.id === currentStep) || steps[0];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <Modal className="md:max-w-2xl">
      <div className="w-full px-4 py-2 md:px-8 md:py-4">
        <div className="mb-6 mt-3 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Admin Setup Guide</h2>
          <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5 text-sm font-medium">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {currentStep}
            </span>
            <span className="text-muted-foreground">of</span>
            <span>{steps.length}</span>
          </div>
        </div>

        {/* Content area */}
        <div className="relative w-full rounded-lg">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col justify-center gap-6"
            >
              <div className="flex h-full w-full flex-col">
                <div className="mb-2 flex items-center gap-1 rounded-lg bg-neutral-100 p-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {currentStep}
                  </span>
                  <motion.h3
                    className="text-base font-semibold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {currentStepData.title}
                  </motion.h3>
                </div>

                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {currentStepData.component()}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="mt-auto flex justify-between px-4 pb-4 pt-3 md:px-8 md:pb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 transition-colors",
            currentStep === 1
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          onClick={goToNextStep}
          // disabled={currentStep === steps.length}
          className={cn(
            "flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90",
          )}
        >
          {currentStep === steps.length ? "🚀 Start" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>
    </Modal>
  );
}

function SetAdminRole({ id, email }: { id: string; email: string }) {
  const [isPending, startTransition] = useTransition();
  const [isAdmin, setIsAdmin] = useState(false);
  const handleSetAdmin = async () => {
    startTransition(async () => {
      const res = await fetch("/api/setup");
      if (res.ok) {
        setIsAdmin(true);
      }
    });
  };

  const ReadyBadge = (
    <Badge className="text-xs font-semibold" variant="green">
      <Icons.check className="mr-1 size-3" />
      Ready
    </Badge>
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-neutral-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-500">
          Allow Sign Up:
        </span>
        {siteConfig.openSignup ? ReadyBadge : <Skeleton className="h-4 w-12" />}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-500">
          Set {email} as ADMIN:
        </span>
        {isAdmin ? (
          ReadyBadge
        ) : (
          <Button
            className=""
            variant={"outline"}
            size={"sm"}
            onClick={handleSetAdmin}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Active Now
          </Button>
        )}
      </div>

      <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
        <p className="flex items-start gap-1">
          📢 Only by becoming an administrator can one access the admin panel
          and add domain names.
        </p>
        <p className="my-1">
          📢 Administrators can set all user permissions, allocate quotas, view
          and edit all resources (short links, subdomains, email), etc.
        </p>
        <p>
          📢 Via{" "}
          <a
            className="text-blue-500"
            target="_blank"
            href="/docs/developer/quick-start"
          >
            quick start
          </a>{" "}
          docs to get more information.
        </p>
      </div>
    </div>
  );
}

function AddDomain({ onNextStep }: { onNextStep: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [domain, setDomain] = useState("");
  const handleCreateDomain = async () => {
    if (!domain) {
      toast.warning("Domain name cannot be empty");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/admin/domain", {
        method: "POST",
        body: JSON.stringify({
          data: {
            domain_name: removeUrlSuffix(domain),
            enable_short_link: true,
            enable_email: true,
            enable_dns: true,
            cf_zone_id: "",
            cf_api_key: "",
            cf_email: "",
            cf_api_key_encrypted: false,
            max_short_links: 0,
            max_email_forwards: 0,
            max_dns_records: 0,
            active: true,
          },
        }),
      });
      if (res.ok) {
        onNextStep();
      } else {
        toast.error("Created Failed!", {
          description: await res.text(),
        });
      }
    });
  };
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-neutral-50 p-4">
      <FormSectionColumns title="Domain Name">
        <div className="flex w-full flex-col items-start justify-between gap-2">
          <Label className="sr-only" htmlFor="domain_name">
            Domain Name
          </Label>
          <div className="w-full">
            <Input
              id="target"
              className="flex-1 bg-neutral-50 shadow-inner"
              size={32}
              placeholder="example.com"
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Please enter a valid domain name (must be hosted on Cloudflare).
          </p>
        </div>

        <div className="mt-2 flex w-full items-center justify-end gap-3">
          <Button
            className="text-xs text-muted-foreground"
            variant={"ghost"}
            size={"sm"}
            onClick={onNextStep}
          >
            Or add later
          </Button>
          <Button
            className="flex items-center gap-1"
            size={"sm"}
            variant={"blue"}
            disabled={isPending}
            onClick={handleCreateDomain}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </FormSectionColumns>
    </div>
  );
}

function Congrats() {
  return <></>;
}
