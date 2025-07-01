"use client";

import Script from "next/script";

const UmamiAnalytics = () => {
  const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <>
      {process.env.NEXT_PUBLIC_UMAMI_SCRIPT &&
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
        <Script
          src={umamiScriptUrl}
          data-website-id={websiteId}
          strategy="afterInteractive"
          async
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UmamiAnalytics;
