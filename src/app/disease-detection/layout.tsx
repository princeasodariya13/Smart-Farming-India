import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI Crop Disease Detection & Plant Diagnosis",
  description:
    "Upload crop photos for instant AI-powered plant disease diagnosis. Identify pests, fungal infections, and receive chemical and organic treatment guidelines.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/disease-detection",
  },
  openGraph: {
    title: "AI Crop Disease Detection & Plant Diagnosis | Smart Farming India",
    description:
      "Upload crop photos for instant AI-powered plant disease diagnosis. Identify pests, fungal infections, and receive chemical and organic treatment guidelines.",
    url: "https://smart-farming-india.vercel.app/disease-detection",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India AI Disease Detection" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Crop Disease Detection & Plant Diagnosis | Smart Farming India",
    description:
      "Upload crop photos for instant AI-powered plant disease diagnosis. Identify pests, fungal infections, and receive chemical and organic treatment guidelines.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
