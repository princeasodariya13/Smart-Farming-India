const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.marketplaceProduct.deleteMany();
  console.log('Cleared Marketplace Products');
}
run().finally(() => prisma.$disconnect());
