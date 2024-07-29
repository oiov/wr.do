import "@/styles/globals.css";

import { fontHeading, fontSans, fontSatoshi } from "@/assets/fonts";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            defer
            src="https://umami.oiov.dev/script.js"
            data-website-id="56549e9d-61df-470d-a1b1-cbf12cfafe9d"
          ></script>
        </head>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontHeading.variable,
            fontSatoshi.variable,
          )}
        >
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ModalProvider>{children}</ModalProvider>
              {/* <Analytics /> */}
              <Toaster richColors closeButton />
              <TailwindIndicator />
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
