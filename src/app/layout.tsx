import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevents FOUT — page text shows instantly with fallback font
  preload: true,
});

export const metadata: Metadata = {
  title: "Smart Farming India | Intelligent Agriculture",
  description: "AI-powered digital agriculture tools for every Indian farmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} antialiased`}
    >
      <body className="bg-slate-50 text-slate-900">
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
