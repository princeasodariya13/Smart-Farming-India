import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      // Return empty structures if unauthenticated
      return NextResponse.json({ success: true, mandiPrices: [], crops: [], tasks: [], irrigation: null, soilHealth: null });
    }

    let mandiPrices = await prisma.mandiPrice.findMany();
    let crops = await prisma.crop.findMany({ where: { userId } });
    let tasks = await prisma.farmerTask.findMany({ where: { userId } });
    let irrigation = await prisma.irrigationSystem.findFirst({ where: { userId } });
    let soilHealth = await prisma.soilHealth.findFirst({ where: { userId } });
    
    // Seed Mandi Prices if missing or incomplete
    if (mandiPrices.length < 15) {
      await prisma.mandiPrice.deleteMany({}); // Clear existing to prevent duplicates during re-seeding
      const initialPrices = [
        { cropName: 'Groundnut (Peanut)', market: 'Gondal', price: 6200, unit: 'qtl', trendPercent: 2.4, trendDirection: 'UP' },
        { cropName: 'Cotton (Kapas)', market: 'Gondal', price: 7350, unit: 'qtl', trendPercent: -0.8, trendDirection: 'DOWN' },
        { cropName: 'Jeera (Cumin)', market: 'Gondal', price: 28500, unit: 'qtl', trendPercent: 1.2, trendDirection: 'UP' },
        { cropName: 'Wheat (Lokwan)', market: 'Gondal', price: 2600, unit: 'qtl', trendPercent: 0.5, trendDirection: 'UP' },
        { cropName: 'Garlic (Lahsun)', market: 'Gondal', price: 14500, unit: 'qtl', trendPercent: -3.2, trendDirection: 'DOWN' },
        { cropName: 'Onion (Red)', market: 'Gondal', price: 1850, unit: 'qtl', trendPercent: 5.4, trendDirection: 'UP' },
        { cropName: 'Sesame (White)', market: 'Gondal', price: 15200, unit: 'qtl', trendPercent: -1.1, trendDirection: 'DOWN' },
        { cropName: 'Castor Seed', market: 'Gondal', price: 5800, unit: 'qtl', trendPercent: 0.2, trendDirection: 'UP' },
        { cropName: 'Mustard (Sarson)', market: 'Gondal', price: 5400, unit: 'qtl', trendPercent: 1.5, trendDirection: 'UP' },
        { cropName: 'Coriander (Dhania)', market: 'Gondal', price: 7100, unit: 'qtl', trendPercent: -0.5, trendDirection: 'DOWN' },
        { cropName: 'Soybean', market: 'Gondal', price: 4600, unit: 'qtl', trendPercent: 2.1, trendDirection: 'UP' },
        { cropName: 'Green Gram (Moong)', market: 'Gondal', price: 8200, unit: 'qtl', trendPercent: 0.8, trendDirection: 'UP' },
        { cropName: 'Black Gram (Urad)', market: 'Gondal', price: 8900, unit: 'qtl', trendPercent: 1.4, trendDirection: 'UP' },
        { cropName: 'Chickpea (Chana)', market: 'Gondal', price: 6100, unit: 'qtl', trendPercent: -1.8, trendDirection: 'DOWN' },
        { cropName: 'Turmeric (Haldi)', market: 'Gondal', price: 13500, unit: 'qtl', trendPercent: 4.2, trendDirection: 'UP' },
        { cropName: 'Pearl Millet (Bajra)', market: 'Gondal', price: 2300, unit: 'qtl', trendPercent: 0.3, trendDirection: 'UP' },
        { cropName: 'Sorghum (Jowar)', market: 'Gondal', price: 2750, unit: 'qtl', trendPercent: -0.4, trendDirection: 'DOWN' },
        { cropName: 'Red Chilli (Dry)', market: 'Gondal', price: 19500, unit: 'qtl', trendPercent: 2.9, trendDirection: 'UP' },
        { cropName: 'Fennel (Saunf)', market: 'Gondal', price: 12200, unit: 'qtl', trendPercent: -2.1, trendDirection: 'DOWN' },
        { cropName: 'Fenugreek (Methi)', market: 'Gondal', price: 6500, unit: 'qtl', trendPercent: 0.7, trendDirection: 'UP' },
      ];
      
      await prisma.mandiPrice.createMany({ data: initialPrices });
      mandiPrices = await prisma.mandiPrice.findMany();
    }

    // Seed Crops if empty for this user
    if (crops.length === 0) {
      const initialCrops = [
        { userId, name: 'Basmati Rice', area: 12.5, healthScore: 98, stage: 'Harvest in 22d', harvestDays: 22, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj0WkFgyOcM8gK5ywoQq7z62-EtvvgpqWvsPZ_G21b8Erk7WusCrn7f_40jDFYCtg6CZVyJ5UYF_9mmOW94nv0oEJkgMVcBM9PhnwrZ5xzL1e3lJLwg1UVshYx5qUFRRKE3vKgEsN3O9IMuQ2J5hwnnG7T-NTGRAFjkGzVT4AGlYp0uhlSaxifyTWs6r4tlz7oy-JdBId1tuGHQxlnBe4c-dbBz2iv13PjOOJAOOBqv30VVbMET7Cz-Xky8tXHvY75MhCPj1Uk-Q' },
        { userId, name: 'Mustard', area: 4.2, healthScore: 92, stage: 'Budding Stage', harvestDays: 45, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAniaglFKqx0zIViQqqJ5Y65dtWebWmperObvM1EQxp56PC9uzRVUxUSo2n_1H1tsm_MsExkOnSvyjKvj3iSZH-VDVvD3OA58ENnjMtyXeqh6IcYgbBf9pS0Ih7hD4hRAZRbiJ-J4OmTLcyfTMJ_r1aOCkMS5pgB-TLj1iddZEi74h9JLYKBu2Gtsq9BFtIZuE6vMsw35vb43uFuLVPYaCqdrZd48STlAsiguVUX5yFJJvDFw1ij7YyURRZXVVhCIG5SMc9DcJIvw' }
      ];
      for (const crop of initialCrops) {
        await prisma.crop.create({ data: crop });
      }
      crops = await prisma.crop.findMany({ where: { userId } });
    }

    if (tasks.length === 0) {
      await prisma.farmerTask.createMany({
        data: [
          { userId, label: 'Fertilize Sector B with N-P-K', checked: false },
          { userId, label: 'Check Soil Moisture (Acres 4-8)', checked: false },
          { userId, label: 'Schedule Water Pump #2', checked: true },
        ]
      });
      tasks = await prisma.farmerTask.findMany({ where: { userId } });
    }

    if (!irrigation) {
      irrigation = await prisma.irrigationSystem.create({
        data: {
          userId,
          status: "Active",
          pumpName: "Pump #4",
          sector: "Sector A-12",
          waterUsage: 1240
        }
      });
    }

    if (!soilHealth) {
      soilHealth = await prisma.soilHealth.create({
        data: {
          userId,
          nitrogen: 82,
          phosphorus: 65,
          potassium: 45,
          status: "Balanced",
          action: "Fertilize in 4 days"
        }
      });
    }

    // Ensure potassium exists for backward compatibility with old DB records
    const normalizedSoilHealth = soilHealth ? {
      ...soilHealth,
      potassium: (soilHealth as any).potassium ?? 45
    } : null;

    return NextResponse.json({ success: true, mandiPrices, crops, tasks, irrigation, soilHealth: normalizedSoilHealth });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
