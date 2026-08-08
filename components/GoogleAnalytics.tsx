"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-VGV1VWPW1C";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  );
}
