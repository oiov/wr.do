import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { Notification } from "@/components/layout/notification";
import { SiteFooter } from "@/components/layout/site-footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col dark:bg-black">
      <NavMobile />
      <NavBar scroll={true} />
      <Notification />
      <main className="flex-1 bg-[radial-gradient(circle_500px_at_50%_300px,#a1fffc36,#ffffff)] dark:bg-[radial-gradient(circle_500px_at_50%_300px,#a1fffc36,#000)]">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
