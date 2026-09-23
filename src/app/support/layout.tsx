import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Help Desk & Customer Support",
  description:
    "Get assistance from Smart Farming India support team. Access FAQs, helpline contacts, and technical help for Indian farmers.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/support",
  },
  openGraph: {
    title: "Help Desk & Customer Support | Smart Farming India",
    description:
      "Get assistance from Smart Farming India support team. Access FAQs, helpline contacts, and technical help for Indian farmers.",
    url: "https://smart-farming-india.vercel.app/support",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Support" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Desk & Customer Support | Smart Farming India",
    description:
      "Get assistance from Smart Farming India support team. Access FAQs, helpline contacts, and technical help for Indian farmers.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
