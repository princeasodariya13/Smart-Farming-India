import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let mandiPrices = await prisma.mandiPrice.findMany();
    let crops = await prisma.crop.findMany();
    
    // Seed Mandi Prices if empty
    if (mandiPrices.length === 0) {
      const initialPrices = [
        { cropName: 'Groundnut', market: 'Gondal', price: 5500, unit: 'qtl', trendPercent: 2.4, trendDirection: 'UP' },
        { cropName: 'Cotton', market: 'Gondal', price: 7200, unit: 'qtl', trendPercent: -0.8, trendDirection: 'DOWN' },
        { cropName: 'Jeera', market: 'Gondal', price: 28500, unit: 'qtl', trendPercent: 1.2, trendDirection: 'UP' },
      ];
      
      for (const price of initialPrices) {
        await prisma.mandiPrice.create({ data: price });
      }
      mandiPrices = await prisma.mandiPrice.findMany();
    }

    // Seed Crops if empty (using a dummy user or existing user)
    // Note: To avoid foreign key error, we need a user. If no user exists, we won't seed crops to avoid crashing.
    if (crops.length === 0) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        const initialCrops = [
          { userId: firstUser.id, name: 'Basmati Rice', area: 12.5, healthScore: 98, stage: 'Harvest in 22d', harvestDays: 22, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj0WkFgyOcM8gK5ywoQq7z62-EtvvgpqWvsPZ_G21b8Erk7WusCrn7f_40jDFYCtg6CZVyJ5UYF_9mmOW94nv0oEJkgMVcBM9PhnwrZ5xzL1e3lJLwg1UVshYx5qUFRRKE3vKgEsN3O9IMuQ2J5hwnnG7T-NTGRAFjkGzVT4AGlYp0uhlSaxifyTWs6r4tlz7oy-JdBId1tuGHQxlnBe4c-dbBz2iv13PjOOJAOOBqv30VVbMET7Cz-Xky8tXHvY75MhCPj1Uk-Q' },
          { userId: firstUser.id, name: 'Mustard', area: 4.2, healthScore: 92, stage: 'Budding Stage', harvestDays: 45, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAniaglFKqx0zIViQqqJ5Y65dtWebWmperObvM1EQxp56PC9uzRVUxUSo2n_1H1tsm_MsExkOnSvyjKvj3iSZH-VDVvD3OA58ENnjMtyXeqh6IcYgbBf9pS0Ih7hD4hRAZRbiJ-J4OmTLcyfTMJ_r1aOCkMS5pgB-TLj1iddZEi74h9JLYKBu2Gtsq9BFtIZuE6vMsw35vb43uFuLVPYaCqdrZd48STlAsiguVUX5yFJJvDFw1ij7YyURRZXVVhCIG5SMc9DcJIvw' }
        ];
        for (const crop of initialCrops) {
          await prisma.crop.create({ data: crop });
        }
        crops = await prisma.crop.findMany();
      }
    }

    return NextResponse.json({ success: true, mandiPrices, crops });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
