import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Agri-Doctor Consultation & Expert Farm Advice",
  description:
    "Connect with certified agronomists and agricultural experts for personalized advice on soil health, pest management, and crop yield optimization.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/consult",
  },
  openGraph: {
    title: "Agri-Doctor Consultation & Expert Farm Advice | Smart Farming India",
    description:
      "Connect with certified agronomists and agricultural experts for personalized advice on soil health, pest management, and crop yield optimization.",
    url: "https://smart-farming-india.vercel.app/consult",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Expert Consult" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agri-Doctor Consultation & Expert Farm Advice | Smart Farming India",
    description:
      "Connect with certified agronomists and agricultural experts for personalized advice on soil health, pest management, and crop yield optimization.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
