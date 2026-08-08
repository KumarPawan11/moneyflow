import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { GoogleAnalyticsTracker } from "@/components/GoogleAnalyticsTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairSerif = Playfair_Display({
  variable: "--font-playfair-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoneyFlow - Personal Finance Tracker",
  description: "Track spending, budgets, goals, and loans in a simple monthly view.",
};

const GA_MEASUREMENT_ID = "G-VGV1VWPW1C";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairSerif.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                send_page_view: true
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fafaf9] text-stone-900 font-sans">
        <GoogleAnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
