import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-black dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1 bg-[radial-gradient(circle_400px_at_50%_300px,#a1fffc36,#ffffff)] dark:bg-[radial-gradient(circle_400px_at_50%_300px,#a1fffc36,#000)]">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
