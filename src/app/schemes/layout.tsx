import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Government Schemes for Farmers & Subsidies",
  description:
    "Explore Central and State Government schemes for Indian farmers. Filter by financial support, subsidies, crop insurance, soil health, and eligibility criteria.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/schemes",
  },
  openGraph: {
    title: "Government Schemes for Farmers & Subsidies | Smart Farming India",
    description:
      "Explore Central and State Government schemes for Indian farmers. Filter by financial support, subsidies, crop insurance, soil health, and eligibility criteria.",
    url: "https://smart-farming-india.vercel.app/schemes",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Government Schemes" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Schemes for Farmers & Subsidies | Smart Farming India",
    description:
      "Explore Central and State Government schemes for Indian farmers. Filter by financial support, subsidies, crop insurance, soil health, and eligibility criteria.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
