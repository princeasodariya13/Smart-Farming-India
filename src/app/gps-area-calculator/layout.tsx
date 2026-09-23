import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GPS Field Area Calculator & Farm Land Mapping",
  description:
    "Accurately measure farm land boundaries and field area using high-resolution satellite GPS mapping. Instant area calculations in Acres, Bigha, and Hectares.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/gps-area-calculator",
  },
  openGraph: {
    title: "GPS Field Area Calculator & Farm Land Mapping | Smart Farming India",
    description:
      "Accurately measure farm land boundaries and field area using high-resolution satellite GPS mapping. Instant area calculations in Acres, Bigha, and Hectares.",
    url: "https://smart-farming-india.vercel.app/gps-area-calculator",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India GPS Calculator" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Field Area Calculator & Farm Land Mapping | Smart Farming India",
    description:
      "Accurately measure farm land boundaries and field area using high-resolution satellite GPS mapping. Instant area calculations in Acres, Bigha, and Hectares.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
