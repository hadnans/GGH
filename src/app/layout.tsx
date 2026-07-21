import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/providers/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "GGH Gomla Go Home | جملة لحد البيت",
  description: "Number 1 Source for Your Home Supply with Trusted Reliability and Best Prices. المصدر رقم 1 لمستلزمات منزلك بأفضل الأسعار",
  keywords: ["GGH", "Gomla Go Home", "grocery", "Egypt", "wholesale", "جملة", "بقالة"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cairo.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
