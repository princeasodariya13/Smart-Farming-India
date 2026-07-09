import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import FeaturesBento from "@/components/landing/FeaturesBento";
import ExpertBanner from "@/components/landing/ExpertBanner";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Smart Farming India | Intelligent Agriculture",
  description: "India's complete digital farming ecosystem. AI-driven insights, marketplace access, and government integration in one premium platform.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200">

      <Header />
      <main id="main-content" className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-12 pt-2 md:gap-16 md:px-8 md:pb-24 md:pt-4">
        <Hero />
        <FeaturesBento />
        <ExpertBanner />
      </main>
      <Footer />
    </div>
  );
}
