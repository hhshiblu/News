const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true
    }
  });
  
  const formatted = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentId: c.parentId,
    parentSlug: c.parent?.slug,
    children: c.children.map(ch => ch.slug)
  }));

  console.log(JSON.stringify(formatted, null, 2));
  await prisma.$disconnect();
}

checkCategories();
