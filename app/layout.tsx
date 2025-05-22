import "@/styles/globals.css";

import { fontHeading, fontSans, fontSatoshi } from "@/assets/fonts";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import GoogleAnalytics from "./GoogleAnalytics";

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
            src="https://umami.biuxin.com/script.js"
            data-website-id="e6f3625a-d2a2-48be-a00a-cc227c9355ea"
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
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ModalProvider>{children}</ModalProvider>
              <Toaster richColors closeButton />
              <TailwindIndicator />
            </ThemeProvider>
          </SessionProvider>
          <GoogleAnalytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
