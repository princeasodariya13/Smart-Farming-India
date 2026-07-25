const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.marketplaceProduct.findMany({ select: { name: true, image: true } });
  console.log(JSON.stringify(products, null, 2));
}
main().finally(() => prisma.$disconnect());
