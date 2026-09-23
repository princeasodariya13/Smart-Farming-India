import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Agricultural Marketplace & Equipment Rental",
  description:
    "Buy high-yield seeds, fertilizers, and smart farming tools, or rent tractors and agricultural machinery directly from verified owners.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/market",
  },
  openGraph: {
    title: "Agricultural Marketplace & Equipment Rental | Smart Farming India",
    description:
      "Buy high-yield seeds, fertilizers, and smart farming tools, or rent tractors and agricultural machinery directly from verified owners.",
    url: "https://smart-farming-india.vercel.app/market",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Marketplace" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agricultural Marketplace & Equipment Rental | Smart Farming India",
    description:
      "Buy high-yield seeds, fertilizers, and smart farming tools, or rent tractors and agricultural machinery directly from verified owners.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
