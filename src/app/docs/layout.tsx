import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Documentation & User Guide",
  description:
    "User documentation and operational guides for Smart Farming India tools, including GPS area calculator, marketplace rules, and account configuration.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/docs",
  },
  openGraph: {
    title: "Platform Documentation & User Guide | Smart Farming India",
    description:
      "User documentation and operational guides for Smart Farming India tools, including GPS area calculator, marketplace rules, and account configuration.",
    url: "https://smart-farming-india.vercel.app/docs",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Documentation" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Documentation & User Guide | Smart Farming India",
    description:
      "User documentation and operational guides for Smart Farming India tools, including GPS area calculator, marketplace rules, and account configuration.",
    images: ["/logo.jpg"],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
