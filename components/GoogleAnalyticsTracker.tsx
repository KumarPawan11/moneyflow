"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = "G-VGV1VWPW1C";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function RouteChangeListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== "function") {
        window.gtag = function () {
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer.push(arguments);
        };
      }
    }

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

export function GoogleAnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <RouteChangeListener />
    </Suspense>
  );
}
