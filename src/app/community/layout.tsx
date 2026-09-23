import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Farmer Community Forum & Agriculture Discussions",
  description:
    "Join thousands of Indian farmers sharing real-time field experiences, crop advice, equipment reviews, and local agricultural knowledge.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/community",
  },
  openGraph: {
    title: "Farmer Community Forum & Agriculture Discussions | Smart Farming India",
    description:
      "Join thousands of Indian farmers sharing real-time field experiences, crop advice, equipment reviews, and local agricultural knowledge.",
    url: "https://smart-farming-india.vercel.app/community",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Community" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmer Community Forum & Agriculture Discussions | Smart Farming India",
    description:
      "Join thousands of Indian farmers sharing real-time field experiences, crop advice, equipment reviews, and local agricultural knowledge.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
