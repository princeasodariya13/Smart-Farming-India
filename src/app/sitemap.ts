import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://smart-farming-india.vercel.app";

  // Real public indexable routes discovered in Step 1
  const publicRoutes: Array<{
    path: string;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/weather", changeFrequency: "daily", priority: 0.9 },
    { path: "/schemes", changeFrequency: "daily", priority: 0.9 },
    { path: "/market", changeFrequency: "daily", priority: 0.9 },
    { path: "/market-insights", changeFrequency: "daily", priority: 0.9 },
    { path: "/disease-detection", changeFrequency: "weekly", priority: 0.8 },
    { path: "/gps-area-calculator", changeFrequency: "weekly", priority: 0.8 },
    { path: "/consult", changeFrequency: "weekly", priority: 0.8 },
    { path: "/community", changeFrequency: "daily", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/careers", changeFrequency: "monthly", priority: 0.6 },
    { path: "/compliance", changeFrequency: "monthly", priority: 0.6 },
    { path: "/docs", changeFrequency: "monthly", priority: 0.6 },
    { path: "/partner-network", changeFrequency: "monthly", priority: 0.6 },
    { path: "/press", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/refund", changeFrequency: "yearly", priority: 0.4 },
    { path: "/security", changeFrequency: "monthly", priority: 0.5 },
    { path: "/support", changeFrequency: "monthly", priority: 0.6 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  ];

  const currentDate = new Date();

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
