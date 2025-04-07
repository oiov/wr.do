import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Password({ children }: ProtectedLayoutProps) {
  // const filteredLinks = sidebarLinks.map((section) => ({
  //   ...section,
  //   items: section.items.filter(
  //     ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
  //   ),
  // }));

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <div className="flex flex-1 flex-col">
        {/* <header className="sticky top-0 z-50 flex h-14 border-b bg-background px-4 lg:h-[60px] xl:px-8">
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
            <MobileSheetSidebar links={filteredLinks} />

            <div className="w-full flex-1">
              <SearchCommand links={filteredLinks} />
            </div>

            <ModeToggle />
            <UserAccountNav />
          </MaxWidthWrapper>
        </header> */}

        <main className="flex-1">
          <MaxWidthWrapper className="flex max-h-screen max-w-full flex-col gap-4 px-0 lg:gap-6">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}
