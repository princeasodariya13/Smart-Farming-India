import type { Metadata } from "next";
import MarketplacePage from "@/components/marketplace/MarketplacePage";

export const metadata: Metadata = {
  title: "Marketplace | Smart Farming India",
  description:
    "Find premium agricultural equipment, high-yield seeds, fertilizers, and smart farming devices.",
};

export default function Page() {
  return <MarketplacePage />;
}
