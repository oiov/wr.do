import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function LinkStatus({ children }: ProtectedLayoutProps) {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <div className="flex flex-1 flex-col">
        <main className="flex-1">
          <MaxWidthWrapper className="flex max-h-screen max-w-full flex-col gap-4 px-0 lg:gap-6">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}
