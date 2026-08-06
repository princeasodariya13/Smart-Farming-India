import type { Metadata } from "next";
import { Inter, Hind_Vadodara } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import GoogleTranslate from "@/components/GoogleTranslate";
import { Providers } from "@/components/Providers";
import { auth } from "@/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const hindVadodara = Hind_Vadodara({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "gujarati"],
  display: "swap",
  variable: "--font-hind",
  preload: true,
});

export const metadata: Metadata = {
  title: "Smart Farming India | Intelligent Agriculture",
  description: "AI-powered digital agriculture tools for every Indian farmer.",
  manifest: "/manifest.json",
  themeColor: "#2E7D32",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smart Farming",
  },
};

export const viewport = {
  themeColor: "#2E7D32",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hindVadodara.variable} antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
      </head>
      <body className="bg-[#F8FAF7] text-on-surface font-sans">
        <Providers session={session}>
          <GoogleTranslate />
          <SmoothScrolling>{children}</SmoothScrolling>
        </Providers>
      </body>
    </html>
  );
}
