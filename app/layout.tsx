import "@/styles/globals.css";

import { fontHeading, fontSans, fontSatoshi } from "@/assets/fonts";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning>
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
          <NextIntlClientProvider messages={messages}>
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
          </NextIntlClientProvider>
          <GoogleAnalytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
