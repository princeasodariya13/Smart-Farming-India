const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.marketplaceProduct.updateMany({
    where: { name: 'High-Yield Wheat Seeds (HD-2967)' },
    data: {
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop'
    }
  });
  console.log('Updated ' + result.count + ' products.');
}

run().catch(console.error).finally(() => prisma.$disconnect());
