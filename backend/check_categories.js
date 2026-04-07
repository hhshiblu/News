const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true
    }
  });
  console.log(JSON.stringify(categories, null, 2));
  await prisma.$disconnect();
}

checkCategories();
